const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    
    await page.goto('https://www.douyin.com/user/MS4wLjABAAAAHOVtxcxM99O16nn4WCfyniXigItbmbr75gHDssomtDI', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await new Promise(r => setTimeout(r, 5000));
    
    // The SSR data might not have user data - the page might load it via XHR
    // Let's intercept API responses
    const apiResponses = [];
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('aweme/v1') || url.includes('user/profile') || url.includes('aweme/post')) {
        try {
          const data = await response.json();
          apiResponses.push({ url: url.substring(0, 150), data: data });
        } catch(e) {}
      }
    });
    
    // Scroll down to trigger lazy loading of posts
    await page.evaluate(() => window.scrollTo(0, 1000));
    await new Promise(r => setTimeout(r, 3000));
    
    // Try to reload and wait for XHR
    await page.reload({ waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 5000));
    
    // Scroll to trigger post loading
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(r => setTimeout(r, 2000));
    }
    
    console.log('API responses captured:', apiResponses.length);
    for (const resp of apiResponses) {
      console.log('\n=== ' + resp.url + ' ===');
      const d = resp.data;
      console.log(JSON.stringify(d, null, 2).substring(0, 2000));
    }
    
    // Also try to get user info from the page DOM
    const domInfo = await page.evaluate(() => {
      const result = {};
      // Get all script tags that might have user data
      const scripts = document.querySelectorAll('script');
      for (const s of scripts) {
        const text = s.textContent;
        if (text.includes('nickname') && text.length < 500000) {
          const nickMatch = text.match(/"nickname"\s*:\s*"([^"]+)"/);
          if (nickMatch) result.nickname = nickMatch[1];
          const sigMatch = text.match(/"signature"\s*:\s*"([^"]*)"/);
          if (sigMatch) result.signature = sigMatch[1];
          const followMatch = text.match(/"followerCount"\s*:\s*(\d+)/);
          if (followMatch) result.followerCount = followMatch[1];
          const avatarMatch = text.match(/"avatarLarger"\s*:\s*\{[^}]*"url_list"\s*:\s*\["([^"]+)"\]/);
          if (avatarMatch) result.avatarLarger = avatarMatch[1];
          if (result.nickname) break;
        }
      }
      
      // Try data attributes on the page
      const userCard = document.querySelector('[data-e2e="user-info"]');
      if (userCard) result.userCardHTML = userCard.innerHTML.substring(0, 500);
      
      // Get page title which has the nickname
      result.title = document.title;
      
      return result;
    });
    
    console.log('\n=== DOM INFO ===');
    console.log(JSON.stringify(domInfo, null, 2));
    
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
