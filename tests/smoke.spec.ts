import { expect, test } from "@playwright/test";
for (const [path, title] of [
  ["/", "Good ideas."],
  ["/about", "Small team."],
  ["/services", "From the big picture"],
  ["/blog", "A few things"],
  ["/contact", "Every good thing"],
]) {
  test(`${path} renders with metadata and no overflow`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(path);
    await expect(page.locator("h1")).toContainText(title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /^https:\/\//,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });
}
test("journal articles, RSS, sitemap and social preview exist", async ({
  page,
  request,
}) => {
  await page.goto("/blog");
  await page.getByRole("link", { name: /Design that leaves room/ }).click();
  await expect(page.locator("article h1")).toHaveText(
    "Design that leaves room",
  );
  for (const path of [
    "/rss.xml",
    "/sitemap-index.xml",
    "/robots.txt",
    "/social.png",
  ]) {
    const response = await request.get(path);
    expect(response.ok()).toBe(true);
  }
  expect(await (await request.get("/rss.xml")).text()).toContain(
    "A faster site is a kinder site",
  );
});
test("Cloudflare serves the custom 404 with a 404 status", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("This page took");
});
test("contact uses a direct email link", async ({ page }) => {
  await page.goto("/contact");
  await expect(
    page.getByRole("link", { name: /Email the studio/ }),
  ).toHaveAttribute("href", /^mailto:/);
});
test("navigation works on small screens", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByText("Menu", { exact: true }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "About", exact: true })
      .click();
  } else {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "About", exact: true })
      .click();
  }
  await expect(page).toHaveURL(/\/about/);
});
