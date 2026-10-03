import puppeteer from 'puppeteer';
import fs from 'fs';
import { generatePdfHtml } from './templateService.js';

// Resolve Chrome executable on macOS or server environment
function getChromeExecutablePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  const macChromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (fs.existsSync(macChromePath)) {
    return macChromePath;
  }
  return undefined;
}

/**
 * Compile student records into multi-page landscape PDF
 */
export async function compileLandscapePdf(students = [], visibility = {}) {
  const htmlContent = generatePdfHtml(students, visibility);

  const executablePath = getChromeExecutablePath();
  const launchOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
      '--disable-gpu',
    ],
  };

  if (executablePath) {
    launchOptions.executablePath = executablePath;
  } else {
    launchOptions.channel = 'chrome';
  }

  let browser;
  try {
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Set landscape viewport
    await page.setViewport({
      width: 1400,
      height: 900,
      deviceScaleFactor: 2,
    });

    // Set page content
    await page.setContent(htmlContent, {
      waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
      timeout: 30000,
    });

    // Ensure custom fonts are loaded
    await page.evaluateHandle('document.fonts.ready');

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    });

    return pdfBuffer;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
