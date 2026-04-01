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
    
    // Extract full render data structure to understand it
    const structure = await page.evaluate(() => {
      const renderScript = document.getElementById('RENDER_DATA');
      if (!renderScript) return null;
      try {
        const decoded = decodeURIComponent(renderScript.textContent);
        const parsed = JSON.parse(decoded);
        
        // Show all top-level keys
        const result = { topKeys: Object.keys(parsed) };
        
        for (const key in parsed) {
          const data = parsed[key];
          result[key + '_keys'] = Object.keys(data || {});
          
          if (data && data.user) {
            result.userData = {
              nickname: data.user.nickname,
              signature: data.user.signature,
              secUid: data.user.secUid,
              uid: data.user.uid,
              uniqueId: data.user.uniqueId,
              followerCount: data.user.followerCount,
              followingCount: data.user.followingCount,
              awemeCount: data.user.awemeCount,
              diggCount: data.user.diggCount,
              favoritingCount: data.user.favoritingCount,
              avatarLarger: data.user.avatarLarger?.url_list?.[0],
              avatarMedium: data.user.avatarMedium?.url_list?.[0],
              avatarThumb: data.user.avatarThumb?.url_list?.[0],
              shareInfo: data.user.shareInfo,
            };
          }
          
          // Check for post/list data
          if (data && data.post) {
            result.postKeys = Object.keys(data.post);
            if (data.post.data) {
              result.postDataLen = data.post.data.length;
              // Get first post structure
              if (data.post.data[0]) {
                result.firstPostKeys = Object.keys(data.post.data[0]);
              }
            }
          }
        }
        
        return result;
      } catch(e) { return { error: e.message }; }
    });
    
    console.log(JSON.stringify(structure, null, 2));
    
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
