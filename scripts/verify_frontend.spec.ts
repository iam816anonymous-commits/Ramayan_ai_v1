import { test, expect } from '@playwright/test';

test('verify all sanctum experiences', async ({ page }) => {
  await page.goto('http://localhost:3001');
  await page.waitForLoadState('networkidle');

  const experiences = [
    { id: 'home', label: 'Home Sanctum' },
    { id: 'inquiry', label: 'Sacred Inquiry' },
    { id: 'journey', label: 'The Pilgrimage' },
    { id: 'characters', label: 'Character Hall' },
    { id: 'library', label: 'Shloka Library' },
    { id: 'daily', label: 'Daily Wisdom' },
    { id: 'archive', label: 'Wisdom Archive' },
    { id: 'about', label: 'The Temple' },
  ];

  for (const exp of experiences) {
    console.log(`Verifying: ${exp.label}`);

    // Use regex to match the text regardless of case or whitespace
    const navButton = page.getByRole('button', { name: new RegExp(exp.label, 'i') });
    await expect(navButton).toBeVisible();
    await navButton.click();

    // Wait for animation
    await page.waitForTimeout(1500);

    // Verification of content
    if (exp.id === 'home') {
       await expect(page.getByText(/SACRED TEXTS/i)).toBeVisible();
    } else if (exp.id === 'inquiry') {
       await expect(page.getByText(/The Offering Hall/i)).toBeVisible();
    } else if (exp.id === 'journey') {
       await expect(page.getByText(/The Pilgrimage/i)).toBeVisible();
    } else if (exp.id === 'characters') {
       await expect(page.getByText(/Character Hall/i)).toBeVisible();
    } else if (exp.id === 'library') {
       await expect(page.getByText(/Shloka Library/i)).toBeVisible();
    } else if (exp.id === 'about') {
       await expect(page.getByText(/The Sanctum/i)).toBeVisible();
    }

    await page.screenshot({ path: `verification_${exp.id}.png`, fullPage: true });
  }
});
