import { test, expect } from '@playwright/test';

test('should load the kanban board and show tasks', async ({ page }) => {

  await page.goto('http://localhost:3000');
  await expect(page.locator('h1')).toContainText('Kanban Board');
  await expect(page.getByText('Task 1: Learn WebSockets')).toBeVisible();
});