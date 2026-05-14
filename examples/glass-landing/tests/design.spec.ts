import { test, expect } from '@playwright/test';

test.describe('glass-landing design baselines', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('light — hero', async ({ page }) => {
    await page.goto('/');
    // Wait for fonts + backdrop-filter to settle
    await page.evaluate(() => document.fonts?.ready);
    await expect(page).toHaveScreenshot('hero-light.png', { fullPage: false });
  });

  test('dark — hero', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
    await page.evaluate(() => document.fonts?.ready);
    await expect(page).toHaveScreenshot('hero-dark.png', { fullPage: false });
  });

  test('light — full page', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.fonts?.ready);
    await expect(page).toHaveScreenshot('full-light.png', { fullPage: true });
  });

  test('dark — full page', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
    await page.evaluate(() => document.fonts?.ready);
    await expect(page).toHaveScreenshot('full-dark.png', { fullPage: true });
  });

  test('hover state — magnetic CTA does not move when pointer is far', async ({ page }) => {
    await page.goto('/');
    const btn = page.getByRole('button', { name: 'Get Started' });
    const box = await btn.boundingBox();
    if (!box) throw new Error('button not found');
    // 300px away — outside magnet radius (100px default)
    await page.mouse.move(box.x + box.width + 300, box.y + box.height + 300);
    await page.waitForTimeout(200);
    const transform = await btn.evaluate((el) => getComputedStyle(el).transform);
    expect(transform === 'none' || transform === '' || /matrix\(1, 0, 0, 1, 0, 0\)/.test(transform)).toBeTruthy();
  });

  test('a11y — Tab order lands on first nav link', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName + ':' + document.activeElement?.textContent);
    expect(focused).toContain('desing-manual'); // brand link is first
  });
});
