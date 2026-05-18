import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    // Override console.log to catch it
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    
    await page.goto('http://localhost:5173/');
    
    // Click "Start New Session"
    await page.waitForSelector('.pg-lobby__create-btn');
    await page.click('.pg-lobby__create-btn');
    
    // Wait for canvas to be there
    await page.waitForSelector('#physics-canvas');
    await page.waitForTimeout(2000);
    
    // Get canvas bounds
    const rect = await page.evaluate(() => {
      const el = document.querySelector('#physics-canvas');
      const rect = el.getBoundingClientRect();
      // Inject an event listener to see if it catches the click
      el.addEventListener('mousedown', (e) => {
        console.log('Mousedown on canvas wrapper! x:', e.clientX, 'y:', e.clientY);
      });
      document.querySelector('canvas').addEventListener('mousedown', (e) => {
        console.log('Mousedown on canvas element! x:', e.clientX, 'y:', e.clientY);
      });
      return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    });
    
    console.log("Canvas bounds:", rect);
    
    // Click in the center where the box spawns
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + 100;
    console.log(`Clicking at ${targetX}, ${targetY}`);
    
    await page.mouse.click(targetX, targetY);
    await page.waitForTimeout(1000);
    
    // Check if selectedBodyRef changed? We can't access it easily, but we can check if it changed visually
    const isCyan = await page.evaluate(() => {
      // The canvas image data is hard to parse, let's just see if a custom event was fired
      return window.lastBodySelected !== undefined;
    });
    
    console.log("Was body selected? (via event)?");
    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();
