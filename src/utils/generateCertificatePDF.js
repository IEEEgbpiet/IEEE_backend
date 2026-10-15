import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

/**
 * Cached browser promise to reuse a single Chromium instance across PDF requests.
 * Spawning a new Chromium process on every request takes 3-6+ seconds;
 * reusing a warm instance drops per-certificate render time to <1 second.
 */
let cachedBrowserPromise = null;

const getBrowser = async () => {
  if (cachedBrowserPromise) {
    try {
      const browser = await cachedBrowserPromise;
      if (browser && browser.isConnected()) {
        return browser;
      }
    } catch {
      cachedBrowserPromise = null;
    }
  }

  cachedBrowserPromise = (async () => {
    let executablePath;
    let args;
    let defaultViewport = chromium.defaultViewport;
    let headless = chromium.headless;

    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
      args = [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ];
    } else if (process.platform === "linux") {
      // Production Linux / Render environment
      executablePath = await chromium.executablePath();
      args = [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
      ];
    } else {
      // Local development (Windows / macOS)
      const puppeteerLocal = await import("puppeteer");
      executablePath = await puppeteerLocal.default.executablePath();
      args = [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ];
      defaultViewport = null;
      headless = true;
    }

    const browser = await puppeteer.launch({
      executablePath,
      args,
      defaultViewport,
      headless,
    });

    browser.on("disconnected", () => {
      cachedBrowserPromise = null;
    });

    return browser;
  })();

  return cachedBrowserPromise;
};

/**
 * Renders the provided HTML string into a PDF Buffer using a warm Puppeteer page.
 * @param {string} html - Fully rendered certificate HTML string.
 * @returns {Promise<Buffer>} - PDF as a Node.js Buffer.
 */
const generateCertificatePDF = async (html) => {
  let browser;
  try {
    browser = await getBrowser();
  } catch (err) {
    cachedBrowserPromise = null;
    browser = await getBrowser();
  }

  const page = await browser.newPage();

  try {
    // domcontentloaded is much faster than networkidle0 (which forces an arbitrary 500ms wait)
    await page.setContent(html, {
      waitUntil: "domcontentloaded",
    });

    // Ensure external web fonts (Syne, Abril Fatface) are fully parsed and ready before PDF capture
    await Promise.race([
      page.evaluateHandle("document.fonts.ready"),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);

    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    // Close only the tab/page to release memory, keeping the browser process warm for subsequent requests
    await page.close().catch(() => {});
  }
};

export default generateCertificatePDF;

