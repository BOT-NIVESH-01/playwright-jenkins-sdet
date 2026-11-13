const { test, expect } = require('@playwright/test');

const username = 'standard_user';
const password = 'secret_sauce';

test('successful login redirects to products page', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText('Products')).toBeVisible();
});

test('login button is visible', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('button', { name: 'Login' })
  ).toBeVisible();
});

test('invalid password displays an error message', async ({ page }) => {
  await page.goto('/');

  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill('wrong_password');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.locator('[data-test="error"]')).toContainText(
    'Username and password do not match'
  );
});

test('empty credentials display a validation message', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.locator('[data-test="error"]')).toContainText(
    'Username is required'
  );
});
