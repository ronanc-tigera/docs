import * as fs from 'fs';
import {test, expect} from '@playwright/test';
import {argosScreenshot} from '@argos-ci/playwright';
import {extractSitemapPathnames, pathnameToArgosName} from './utils';

// Constants
const siteUrl = 'http://localhost:3000';
const sitemapPath = './build/sitemap.xml';
const stylesheetPath = 'argos/screenshot.css';
const stylesheet = fs.readFileSync(stylesheetPath).toString();

// Wait for hydration, requires Docusaurus v2.4.3+
// Docusaurus adds a <html data-has-hydrated="true"> once hydrated
// See https://github.com/facebook/docusaurus/pull/9256
function waitForDocusaurusHydration() {
  return document.documentElement.dataset.hasHydrated === 'true';
}


// function cleanPathname (pathname) {
//   let converted = pathname.replaceAll('/', '_');

//   if (converted.charAt(0) === '_') {
//     converted = converted.substring(1, converted.length);
//   }

//   if (converted.charAt(converted.length - 1) === '_') {
//     converted = converted.substring(0, converted.length -1);
//   }

//   return converted;
// }


function screenshotPathname(pathname) {
  test(`pathname ${pathname}`, async ({page}) => {
    const url = siteUrl + pathname;
    console.log("URL = ", url);
    await page.goto(url);
    await page.waitForFunction(waitForDocusaurusHydration);
    await page.addStyleTag({content: stylesheet});
    await argosScreenshot(page, pathnameToArgosName(pathname));
  });
}

test.describe('Docusaurus site screenshots', () => {
  let pathnames = extractSitemapPathnames(sitemapPath);
  pathnames = pathnames.slice(2, 3);
  console.log("Pathnames to screenshot:", pathnames);
  pathnames.forEach(screenshotPathname);
  for (const path of pathnames) {
    screenshotPathname(path);
  }
  // test 1 first
  // screenshotPathname('/calico-cloud/about/');
});


// function screenshotPathname(pathname) {
//   test(`pathname ${pathname}`, async ({page}) => {
//     const url = siteUrl + pathname;
//     console.log("URL = ", url);
//     await page.goto(url);
//     await page.waitForFunction(waitForDocusaurusHydration);
//     await page.addStyleTag({content: stylesheet});
//     // await argosScreenshot(page, pathnameToArgosName(pathname));
//     await expect(page).toHaveScreenshot({fullPage: true});
//   });
// }

// test.describe('Docusaurus site screenshots', () => {
//   let pathnames = extractSitemapPathnames(sitemapPath);
//   pathnames = pathnames.slice(2, 3);
//   console.log("Pathnames to screenshot:", pathnames);
//   ///////// try for loop!!!!!!!!!!!!!!!!
//   pathnames.forEach(screenshotPathname);
//   // test 1 first
//   // screenshotPathname('/calico-cloud/about/');
// });