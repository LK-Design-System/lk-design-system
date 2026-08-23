import { expect, test } from '@playwright/test';

for (const theme of ['light', 'dark']) {
  for (const viewport of [{ width: 1280, height: 800 }, { width: 360, height: 800 }]) {
    test(`${theme} ${viewport.width}x${viewport.height} exercises ready then loading`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`/devices?theme=${theme}`);
      await expect(page.getByRole('heading', { name: 'Devices' })).toBeVisible();
      await page.getByRole('button', { name: 'Refresh' }).click();
      await expect(page.getByRole('status', { name: 'Loading devices' })).toBeVisible();
    });
  }
}
