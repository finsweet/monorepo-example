import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
});
const TODO_ITEMS = ['buy some cheese', 'feed the cat', 'book a doctors appointment'];
test.describe('New Todo', () => {
    test('should allow me to add todo items', async ({ page }) => {
        await page.locator('.new-todo').fill(TODO_ITEMS[0]);
        await page.locator('.new-todo').press('Enter');
        await expect(page.locator('.view label')).toHaveText([TODO_ITEMS[0]]);
        await page.locator('.new-todo').fill(TODO_ITEMS[1]);
        await page.locator('.new-todo').press('Enter');
        await expect(page.locator('.view label')).toHaveText([TODO_ITEMS[0], TODO_ITEMS[1]]);
        await checkNumberOfTodosInLocalStorage(page, 2);
    });
    test('should clear text input field when an item is added', async ({ page }) => {
        await page.locator('.new-todo').fill(TODO_ITEMS[0]);
        await page.locator('.new-todo').press('Enter');
        await expect(page.locator('.new-todo')).toBeEmpty();
        await checkNumberOfTodosInLocalStorage(page, 1);
    });
    test('should append new items to the bottom of the list', async ({ page }) => {
        await createDefaultTodos(page);
        await expect(page.locator('.todo-count')).toHaveText('3 items left');
        await expect(page.locator('.todo-count')).toContainText('3');
        await expect(page.locator('.todo-count')).toHaveText(/3/);
        await expect(page.locator('.view label')).toHaveText(TODO_ITEMS);
        await checkNumberOfTodosInLocalStorage(page, 3);
    });
    test('should show #main and #footer when items added', async ({ page }) => {
        await page.locator('.new-todo').fill(TODO_ITEMS[0]);
        await page.locator('.new-todo').press('Enter');
        await expect(page.locator('.main')).toBeVisible();
        await expect(page.locator('.footer')).toBeVisible();
        await checkNumberOfTodosInLocalStorage(page, 1);
    });
});
async function createDefaultTodos(page) {
    for (const item of TODO_ITEMS) {
        await page.locator('.new-todo').fill(item);
        await page.locator('.new-todo').press('Enter');
    }
}
async function checkNumberOfTodosInLocalStorage(page, expected) {
    return await page.waitForFunction((e) => {
        return JSON.parse(localStorage['react-todos']).length === e;
    }, expected);
}
