// Placeholder for visual snapshots; requires Playwright config to run with proper setup.
import { test, expect } from '@playwright/test'

const stories = [
  'timeentries-list--loaded',
]

for (const id of stories) {
  test(`story: ${id}`, async ({ page }) => {
    await page.goto(`http://localhost:6006/iframe.html?id=${id}`)
    await page.setViewportSize({ width: 1280, height: 800 })
    await expect(page).toHaveScreenshot(`${id}.png`, {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    })
  })
}
