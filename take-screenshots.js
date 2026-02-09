const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Dismiss all dialogs automatically
  page.on('dialog', async dialog => {
    console.log('Dialog dismissed:', dialog.message());
    await dialog.dismiss();
  });
  
  // Set viewport
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Navigate to the app
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 30000 });
  
  // Wait a bit for rendering
  await page.waitForTimeout(3000);
  
  // Take full page screenshot
  await page.screenshot({ path: 'screenshot-homepage.png', fullPage: true });
  console.log('✅ Homepage screenshot saved');
  
  // Click on Chat button
  await page.click('button:has-text("Chat")');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-chat.png', fullPage: true });
  console.log('✅ Chat section screenshot saved');
  
  // Click on News button
  await page.click('button:has-text("News")');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot-news.png', fullPage: true });
  console.log('✅ News section screenshot saved');
  
  await browser.close();
  console.log('✅ All screenshots completed!');
})();
