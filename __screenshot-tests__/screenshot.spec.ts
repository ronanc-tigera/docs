import * as fs from 'fs';
import { test, expect } from '@playwright/test';
import pathnames from './pathnames.json';

const siteUrl = 'http://localhost:3000';
const stylesheetPath = '__screenshot-tests__/screenshot.css';
const stylesheet = fs.readFileSync(stylesheetPath).toString();

function waitForDocusaurusHydration() {
  return document.documentElement.dataset.hasHydrated === 'true';
}

const screenshotPathname = (pathname) => {
  test(`pathname ${pathname}`, async ({ page }) => {
    const url = siteUrl + pathname;
    console.log('URL = ', url);
    await page.goto(url);
    await page.waitForFunction(waitForDocusaurusHydration);
    await page.addStyleTag({ content: stylesheet });

    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixelRatio: 0.02,
    });
  });
};

test.describe('Docusaurus site screenshots', () => {
  const paths = pathnames.filter((path: string) => path.startsWith('/calico-cloud/'));
  const length = 20;//paths.length;

  for (let i = 0; i < length; i++) {
    screenshotPathname(paths[i])
  }
});
