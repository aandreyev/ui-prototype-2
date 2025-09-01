import { test, expect } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'

test.describe('a11y: TimeEntriesList', () => {
  const stories = ['timeentries-list--loaded', 'timeentries-list--empty']
  for (const id of stories) {
    test(`story: ${id}`, async ({ page }) => {
      await page.goto(`http://localhost:6006/iframe.html?id=${id}&amp;viewMode=story`)
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
      expect(accessibilityScanResults.violations).toEqual([])
    })
  }
})
