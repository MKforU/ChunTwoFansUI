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
    
    // Deep dive into the render data
    const data = await page.evaluate(() => {
      const renderScript = document.getElementById('RENDER_DATA');
      if (!renderScript) return null;
      const decoded = decodeURIComponent(renderScript.textContent);
      return JSON.parse(decoded);
    });
    
    const app = data.app;
    
    // Get user info
    console.log('=== USER ===');
    if (app.user) {
      const u = app.user;
      console.log('nickname:', u.nickname);
      console.log('signature:', u.signature);
      console.log('secUid:', u.secUid);
      console.log('uid:', u.uid);
      console.log('uniqueId:', u.uniqueId);
      console.log('followerCount:', u.followerCount);
      console.log('followingCount:', u.followingCount);
      console.log('awemeCount:', u.awemeCount);
      console.log('diggCount:', u.diggCount);
      console.log('avatarLarger:', u.avatarLarger?.url_list?.[0]);
      console.log('avatarMedium:', u.avatarMedium?.url_list?.[0]);
    }
    
    // Look for posts/videos - check all keys
    console.log('\n=== LOOKING FOR POSTS ===');
    for (const key of Object.keys(app)) {
      const val = app[key];
      if (val && typeof val === 'object') {
        if (val.data && Array.isArray(val.data)) {
          console.log(`Found array in app.${key}.data, length: ${val.data.length}`);
          if (val.data[0]) {
            console.log('  First item keys:', Object.keys(val.data[0]).join(', '));
          }
        }
        if (val.awemeList) {
          console.log(`Found awemeList in app.${key}, length: ${val.awemeList.length}`);
        }
      }
    }
    
    // Also look in innerLink or other nested objects
    if (app.innerLink) {
      console.log('\ninnerLink:', JSON.stringify(app.innerLink).substring(0, 500));
    }
    
    // Check resourceList for video data
    if (app.resourceList) {
      console.log('\nresourceList type:', typeof app.resourceList);
      if (Array.isArray(app.resourceList)) {
        console.log('resourceList length:', app.resourceList.length);
        if (app.resourceList[0]) {
          console.log('First resource keys:', Object.keys(app.resourceList[0]).join(', '));
          const r = app.resourceList[0];
          console.log('awemeId:', r.awemeId);
          console.log('desc:', r.desc);
          console.log('video keys:', r.video ? Object.keys(r.video).join(', ') : 'none');
          if (r.video?.cover) console.log('cover:', r.video.cover?.url_list?.[0]);
          if (r.video?.playAddr) console.log('playAddr:', r.video.playAddr?.[0]?.src || JSON.stringify(r.video.playAddr));
          if (r.statistics) console.log('stats:', JSON.stringify(r.statistics));
        }
      }
    }
    
  } catch(e) {
    console.error('Error:', e.message, e.stack);
  } finally {
    await browser.close();
  }
})();
