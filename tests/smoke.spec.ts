import { expect, test } from "@playwright/test";

type DemoRole = "admin" | "advisor" | "engineer";

const roleNames: Record<DemoRole, string> = {
  admin: "Shaw Preview Admin",
  advisor: "Jordan Ellis",
  engineer: "Morgan Chen",
};

async function login(
  page: import("@playwright/test").Page,
  role: DemoRole = "advisor",
  returnTo = "/app",
) {
  await page.goto(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  await page.getByRole("button", { name: new RegExp(roleNames[role], "i") }).click();
}

test("public routes and role-based preview entry render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /exclusive collaboration/i })).toBeVisible();
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /enter the collaboration workspace/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Jordan Ellis/i })).toBeVisible();
  await page.goto("/missing-room");
  await expect(page.getByRole("heading", { name: /isn’t in the preview/i })).toBeVisible();
});

test("protected workspace deep link returns correctly and logout clears session", async ({ page }) => {
  const destination = "/app/community/advisors/channel/clinical-feedback";
  await page.goto(destination);
  await expect(page).toHaveURL(/\/login\?returnTo=/);
  await login(page, "advisor", destination);
  await expect(page).toHaveURL(new RegExp(`${destination}$`));
  await expect(page.getByRole("heading", { name: /welcome to #clinical-feedback/i })).toBeVisible();
  await page.getByRole("button", { name: "Log out" }).click();
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login\?returnTo=/);
});

test("role communities are visible only to the appropriate member", async ({ page }) => {
  await login(page, "advisor");
  const navigation = page.getByRole("navigation", { name: "Workspace navigation" });
  await expect(navigation.getByRole("link", { name: "Advisor Community" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Engineering Community" })).toHaveCount(0);

  await page.getByRole("button", { name: "Log out" }).click();
  await login(page, "engineer");
  await expect(navigation.getByRole("link", { name: "Engineering Community" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Advisor Community" })).toHaveCount(0);
});

test("a member can create a mixed team and its messages persist locally", async ({ page }) => {
  await login(page, "advisor", "/app/new-team");
  await page.getByLabel("Team name").fill("Probe Ergonomics");
  await page.getByLabel("Purpose").fill("Join clinical and engineering feedback.");
  await page.getByText("Morgan Chen", { exact: true }).click();
  await page.getByText("Maya Brooks", { exact: true }).click();
  await page.getByRole("button", { name: "Create team", exact: true }).click();

  await expect(page).toHaveURL(/\/app\/team\/probe-ergonomics-\d+\/channel\/.*-general$/);
  await expect(page.getByText("Probe Ergonomics", { exact: true }).first()).toBeVisible();
  await page.getByLabel(/Message #general/i).fill("Clinical and engineering review starts here.");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("Clinical and engineering review starts here.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Clinical and engineering review starts here.")).toBeVisible();
});

test("team owners manage rosters and admins oversee all teams", async ({ page }) => {
  await login(page, "advisor", "/app/team/portable-sonography/channel/portable-sonography-general");
  await expect(page.getByText("Manage team roster")).toHaveCount(0);
  await page.getByRole("button", { name: "Log out" }).click();

  await login(page, "admin", "/admin/teams");
  await expect(page.getByRole("heading", { name: "Cross-functional teams." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Portable Sonography" })).toBeVisible();
  await page.getByRole("link", { name: "Open" }).click();
  await expect(page.getByText("Manage team roster")).toBeVisible();
});

test("mobile navigation opens and follows anchor", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const mobileNav = page.getByRole("navigation", { name: "Mobile" });
  await expect(mobileNav).toBeVisible();
  await mobileNav.getByRole("link", { name: "Ecosystem", exact: true }).click();
  await expect(page).toHaveURL(/#ecosystem$/);
  await expect(page.getByRole("heading", { name: /Focused rooms/i })).toBeVisible();
});

test("scroll restoration and reduced motion remain usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#security");
  await expect(page.getByRole("heading", { name: /Security is a roadmap requirement/i })).toBeVisible();
  await login(page);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { name: /exclusive collaboration/i })).toBeVisible();
});

test("viewport reveals run once when scrolled into view", async ({ page }) => {
  await page.goto("/");
  const reveal = page.locator("#ecosystem .page > div").first();

  await expect.poll(() => reveal.evaluate((node) => getComputedStyle(node).opacity)).toBe("0");
  await reveal.scrollIntoViewIfNeeded();
  await expect.poll(() => reveal.evaluate((node) => getComputedStyle(node).opacity)).toBe("1");

  await page.evaluate(() => window.scrollTo(0, 0));
  await reveal.scrollIntoViewIfNeeded();
  await expect(reveal).toHaveCSS("opacity", "1");
});

test("the preview makes no backend or API requests", async ({ page }) => {
  const applicationRequests: string[] = [];
  page.on("request", (request) => {
    if (["fetch", "xhr", "websocket", "eventsource"].includes(request.resourceType())) {
      applicationRequests.push(request.url());
    }
  });

  await page.goto("/");
  await login(page, "advisor");
  await expect(page.getByRole("heading", { name: /welcome to #general/i })).toBeVisible();
  await page.goto("/app/directory");
  await expect(page.getByRole("heading", { name: "Find a collaborator." })).toBeVisible();

  expect(applicationRequests).toEqual([]);
});
