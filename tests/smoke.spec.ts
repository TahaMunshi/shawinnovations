import { expect, test } from "@playwright/test";

async function login(page: import("@playwright/test").Page, returnTo = "/dashboard") {
  await page.goto(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  await page.getByLabel("Username").fill("Preview User");
  await page.getByLabel("Password").fill("not-stored");
  await page.getByRole("button", { name: "Enter design preview" }).click();
}

test("public routes and branded missing route render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Advancing healthcare together/i })).toBeVisible();
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Preview login" })).toBeVisible();
  await page.goto("/missing-panel");
  await expect(page.getByRole("heading", { name: /isn’t in the preview/i })).toBeVisible();
});

test("protected deep link preserves returnTo and logout clears session", async ({ page }) => {
  await page.goto("/sections/shared-design-prototypes");
  await expect(page).toHaveURL(/\/login\?returnTo=/);
  await login(page, "/sections/shared-design-prototypes");
  await expect(page).toHaveURL(/\/sections\/shared-design-prototypes$/);
  await expect(page.getByRole("heading", { name: "Shared Design / Prototypes" })).toBeVisible();
  await page.getByRole("button", { name: "Log out" }).click();
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login\?returnTo=/);
});

test("all staged routes render after login", async ({ page }) => {
  await login(page);
  for (const [path, heading] of [
    ["/dashboard", /Welcome, Preview User/],
    ["/admin", "Platform control concept."],
    ["/admin/users/advisor-1", "Jordan Ellis"],
    ["/admin/meetings", "Meetings and minutes."],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
  }
});

test("mobile navigation opens and follows anchor", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  const mobileNav = page.getByRole("navigation", { name: "Mobile" });
  await expect(mobileNav).toBeVisible();
  await mobileNav.getByRole("link", { name: "Ecosystem", exact: true }).click();
  await expect(page).toHaveURL(/#ecosystem$/);
  await expect(page.getByRole("heading", { name: /Connected communities/i })).toBeVisible();
});

test("scroll restoration and reduced motion remain usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#security");
  await expect(page.getByRole("heading", { name: /Security is a roadmap requirement/i })).toBeVisible();
  await login(page);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { name: /Advancing healthcare together/i })).toBeVisible();
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
  await login(page);
  await expect(page.getByRole("heading", { name: /Welcome, Preview User/ })).toBeVisible();
  await page.goto("/admin/meetings");
  await expect(page.getByRole("heading", { name: "Meetings and minutes." })).toBeVisible();

  expect(applicationRequests).toEqual([]);
});
