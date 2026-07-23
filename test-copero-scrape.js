// test-copero-scrape.js
// Scrape Copero career simulator using Puppeteer
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set a realistic user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating to Copero career simulator...');
  
  try {
    await page.goto('https://copero.com.ar/juegos/simulador-carrera', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait for React/Vue/Angular to hydrate
    await page.waitForTimeout(3000);

    // Get page title
    const title = await page.title();
    console.log('Page title:', title);

    // Get visible text content
    const bodyText = await page.evaluate(() => {
      return document.body.innerText;
    });
    console.log('\n=== PAGE TEXT CONTENT ===');
    console.log(bodyText.substring(0, 5000));

    // Get all interactive elements
    const elements = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, input, select, a, [role="button"]');
      return Array.from(buttons).map(el => ({
        tag: el.tagName,
        text: el.innerText?.trim() || el.value || '',
        type: el.type || '',
        id: el.id || '',
        class: el.className || '',
        ariaLabel: el.getAttribute('aria-label') || ''
      })).filter(el => el.text || el.ariaLabel);
    });

    console.log('\n=== INTERACTIVE ELEMENTS ===');
    elements.forEach((el, i) => {
      console.log(`${i + 1}. [${el.tag}] "${el.text}" (type:${el.type} id:${el.id})`);
    });

    // Get HTML structure
    const html = await page.evaluate(() => document.body.innerHTML);
    console.log('\n=== HTML (first 3000 chars) ===');
    console.log(html.substring(0, 3000));

  } catch (err) {
    console.error('Error:', err.message);
  }

  await browser.close();
})();
