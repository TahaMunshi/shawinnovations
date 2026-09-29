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

async function signNda(page: import("@playwright/test").Page, name: string) {
  await page.getByLabel("Type your full legal name").fill(name);
  await page.getByRole("button", { name: "Use typed name as signature" }).click();
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
  const destination = "/app/group/sonography-advisors";
  await page.goto(destination);
  await expect(page).toHaveURL(/\/login\?returnTo=/);
  await login(page, "advisor", destination);
  await expect(page).toHaveURL(new RegExp(`${destination}$`));
  await expect(page.getByRole("heading", { name: "Sonography Advisors", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Log out" }).click();
  await page.goto("/app");
  await expect(page).toHaveURL(/\/login\?returnTo=/);
});

test("members see only communities assigned by the admin", async ({ page }) => {
  await login(page, "advisor");
  const navigation = page.getByRole("navigation", { name: "Workspace navigation" });
  await expect(navigation.getByRole("link", { name: "Sonography Advisors" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Engineering" })).toHaveCount(0);
  await page.goto("/app/group/engineering");
  await expect(page.getByRole("heading", { name: /isn’t assigned to you/i })).toBeVisible();

  await page.getByRole("button", { name: "Log out" }).click();
  await login(page, "engineer");
  await expect(navigation.getByRole("link", { name: "Engineering" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Sonography Advisors" })).toHaveCount(0);
});

test("NDA onboarding requires admin approval and community assignment", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("tab", { name: "Request access" }).click();
  await page.getByLabel("Full name").fill("Casey Lee");
  await page.getByLabel("Email").fill("casey@example.test");
  await page.getByLabel("Title or specialty").fill("Product engineer");
  await page.getByLabel("Organization").fill("Device Lab");
  await page.getByLabel("Professional role").selectOption("engineer");
  await page.getByLabel("Preferred community tab").selectOption("design-prototypes");
  await page.getByLabel("How would you contribute?").fill("Prototype and testing support.");
  await signNda(page, "Casey Lee");
  await page.getByRole("button", { name: "Submit NDA for approval" }).click();
  await expect(page.getByText(/nda submitted/i)).toBeVisible();

  await page.getByRole("tab", { name: "Approved member" }).click();
  await page.getByRole("button", { name: /Shaw Preview Admin/i }).click();
  await page.goto("/admin");
  const request = page.locator(".approval-card").filter({ hasText: "Casey Lee" });
  await expect(request.getByText(/nda e-signature/i)).toBeVisible();
  await request.getByLabel("Assign community tab").selectOption("design-prototypes");
  await request.getByRole("button", { name: "Approve and add" }).click();
  await page.getByRole("navigation", { name: "Admin navigation" }).getByRole("button", { name: /Users/i }).click();
  await page.getByRole("tab", { name: /Design & Prototypes/i }).click();
  await expect(page.locator(".member-admin-list").getByText("Casey Lee")).toBeVisible();
});

test("community messages persist and members have no peer DMs", async ({ page }) => {
  await login(page, "advisor");
  await expect(page.getByRole("link", { name: /create.*team/i })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Workspace navigation" }).getByRole("link", { name: "Morgan Chen" })).toHaveCount(0);
  await page.getByLabel(/Message Sonography Advisors/i).fill("Clinical review starts here.");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("Clinical review starts here.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Clinical review starts here.")).toBeVisible();
});

test("admin can DM, filter tabs, and start Zoom in a community", async ({ page }) => {
  await login(page, "admin");
  const navigation = page.getByRole("navigation", { name: "Workspace navigation" });
  for (const name of ["Sonography Advisors", "Clinical Advisors", "Engineering", "Design & Prototypes", "University Partners", "IP & Legal"]) {
    await expect(navigation.getByRole("link", { name })).toBeVisible();
  }
  await navigation.getByRole("link", { name: "Jordan Ellis" }).click();
  await page.getByLabel(/Message Jordan Ellis/i).fill("Please review the latest advisor notes.");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("Please review the latest advisor notes.")).toBeVisible();

  await page.goto("/admin");
  await page.getByRole("navigation", { name: "Admin navigation" }).getByRole("button", { name: /Users/i }).click();
  await page.getByRole("tab", { name: /Sonography Advisors/i }).click();
  await expect(page.locator(".member-admin-list").getByText("Jordan Ellis")).toBeVisible();
  await expect(page.locator(".member-admin-list").getByText("Morgan Chen")).toHaveCount(0);

  await page.goto("/app/group/sonography-advisors");
  await page.getByRole("button", { name: "Start Zoom meeting" }).click();
  await expect(page.getByText(/zoom meeting is live/i)).toBeVisible();
  await page.getByRole("button", { name: "Log out" }).click();
  await login(page, "advisor", "/app/group/sonography-advisors");
  await page.getByRole("button", { name: "Join Zoom" }).click();
  await expect(page.getByText("Connected").first()).toBeVisible();
});

test("admin can add, suspend, and remove users", async ({ page }) => {
  await login(page, "admin", "/admin");
  await page.getByRole("navigation", { name: "Admin navigation" }).getByRole("button", { name: /Add Member/i }).click();
  const addForm = page.locator("form.admin-panel").filter({ hasText: "Add member directly" });
  await addForm.getByLabel("Full name").fill("Riley Quinn");
  await addForm.getByLabel("Email").fill("riley@example.test");
  await addForm.getByLabel("Title").fill("Clinical specialist");
  await addForm.getByLabel("Organization").fill("Sample Clinic");
  await addForm.getByLabel("Professional role").selectOption("advisor");
  await addForm.getByLabel("Community tab").selectOption("clinical-advisors");
  await addForm.getByRole("button", { name: "Add with in-person NDA" }).click();
  await expect(page.getByText(/riley quinn was added/i)).toBeVisible();

  await page.getByRole("tab", { name: /Clinical Advisors/i }).click();
  const card = page.locator(".member-admin-list > article").filter({ hasText: "Riley Quinn" });
  await card.getByRole("button", { name: "Suspend access" }).click();
  await expect(card.getByText(/Suspended/i)).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await card.getByRole("button", { name: "Remove profile" }).click();
  await expect(page.locator(".member-admin-list").getByText("Riley Quinn")).toHaveCount(0);
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
  await expect(page.getByRole("heading", { name: "Sonography Advisors", exact: true })).toBeVisible();
  await page.goto("/app/direct/advisor-1");
  await expect(page.getByRole("heading", { name: "Platform admin" })).toBeVisible();

  expect(applicationRequests).toEqual([]);
});
