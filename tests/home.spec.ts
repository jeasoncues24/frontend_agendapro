import { test, expect } from '@playwright/test'
// TEST
test('homepage has correct title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('AgendaYa') 
})
