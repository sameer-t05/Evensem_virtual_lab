import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    await page.goto('http://localhost:5173/');
    
    await page.waitForSelector('.pg-lobby__create-btn');
    await page.click('.pg-lobby__create-btn');
    
    await page.waitForSelector('#physics-canvas');
    await page.waitForTimeout(1000);
    
    const elementTag = await page.evaluate(() => {
      const el = document.elementFromPoint(600, 100);
      return el ? el.tagName + ' ' + el.id + ' ' + el.className : 'null';
    });
    
    console.log("Element at 600,100 is:", elementTag);
    
    // Let's also check activeTool
    const reactAppActiveTool = await page.evaluate(() => {
      // Find the active dock tool
      const active = document.querySelector('.pg-dock__tool--active');
      return active ? active.textContent : 'none';
    });
    console.log("Active tool in UI:", reactAppActiveTool);
    
    // Simulate a click on the canvas and see if body-selection-change fires
    const didFire = await page.evaluate(() => {
      return new Promise((resolve) => {
        window.addEventListener('body-selection-change', () => resolve(true));
        // Click at 600, 100
        const evt = new MouseEvent('mousedown', { clientX: 600, clientY: 100, bubbles: true });
        document.elementFromPoint(600, 100).dispatchEvent(evt);
        setTimeout(() => resolve(false), 500);
      });
    });
    
    console.log("Did selection event fire?", didFire);
    
    await browser.close();
  } catch (err) {
    console.error(err);
  }
})();
