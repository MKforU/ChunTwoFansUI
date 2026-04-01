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
    
    // Set proper headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'zh-CN,zh;q=0.9',
    });
    
    // Override navigator
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    
    console.log('Navigating to douyin user page...');
    await page.goto('https://www.douyin.com/user/MS4wLjABAAAAHOVtxcxM99O16nn4WCfyniXigItbmbr75gHDssomtDI', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    
    // Wait for content to load
    await new Promise(r => setTimeout(r, 3000));
    
    // Get page content
    const content = await page.content();
    console.log('Page length:', content.length);
    
    // Try to extract user info
    const userInfo = await page.evaluate(() => {
      const result = {};
      
      // Try various selectors
      const nicknameEl = document.querySelector('[data-e2e="user-info-nickname"]') 
        || document.querySelector('.user-info-nickname')
        || document.querySelector('[class*="nickname"]');
      if (nicknameEl) result.nickname = nicknameEl.textContent;
      
      // Try getting render data
      const renderScript = document.getElementById('RENDER_DATA');
      if (renderScript) {
        result.hasRenderData = true;
        try {
          const decoded = decodeURIComponent(renderScript.textContent);
          const parsed = JSON.parse(decoded);
          
          // Navigate the data structure
          for (const key in parsed) {
            const data = parsed[key];
            if (data && data.user) {
              result.nickname = data.user.nickname;
              result.signature = data.user.signature;
              result.avatar = data.user.avatarLarger?.url_list?.[0] 
                || data.user.avatarMedium?.url_list?.[0]
                || data.user.avatarThumb?.url_list?.[0];
              result.followerCount = data.user.followerCount;
              result.followingCount = data.user.followingCount;
              result.awemeCount = data.user.awemeCount;
              result.diggCount = data.user.diggCount;
              result.uid = data.user.uid;
              result.secUid = data.user.secUid;
              result.uniqueId = data.user.uniqueId;
              break;
            }
          }
        } catch(e) {
          result.renderDataError = e.message;
        }
      }
      
      // Get all img srcs that look like avatars
      const imgs = document.querySelectorAll('img');
      const avatarImgs = [];
      imgs.forEach(img => {
        if (img.src && (img.src.includes('avatar') || img.className.includes('avatar'))) {
          avatarImgs.push(img.src);
        }
      });
      result.possibleAvatars = avatarImgs.slice(0, 5);
      
      // Try title
      result.title = document.title;
      
      return result;
    });
    
    console.log('\n=== USER INFO ===');
    console.log(JSON.stringify(userInfo, null, 2));
    
    // If we have render data, also try to get video list
    if (userInfo.hasRenderData) {
      const videos = await page.evaluate(() => {
        const renderScript = document.getElementById('RENDER_DATA');
        if (!renderScript) return [];
        try {
          const decoded = decodeURIComponent(renderScript.textContent);
          const parsed = JSON.parse(decoded);
          
          const videoList = [];
          for (const key in parsed) {
            const data = parsed[key];
            if (data && data.post) {
              const posts = data.post;
              if (posts.data && Array.isArray(posts.data)) {
                posts.data.slice(0, 12).forEach(post => {
                  videoList.push({
                    awemeId: post.awemeId,
                    desc: post.desc,
                    videoUrl: post.video?.playAddr?.[0]?.src || post.video?.bitRate?.[0]?.playAddr?.[0]?.src,
                    coverUrl: post.video?.cover?.url_list?.[0] || post.video?.originCover?.url_list?.[0],
                    diggCount: post.statistics?.diggCount,
                    commentCount: post.statistics?.commentCount,
                    shareCount: post.statistics?.shareCount,
                    playCount: post.statistics?.playCount,
                  });
                });
              }
            }
          }
          return videoList;
        } catch(e) { return []; }
      });
      
      if (videos.length > 0) {
        console.log('\n=== VIDEOS ===');
        videos.forEach((v, i) => {
          console.log(`\nVideo ${i+1}:`);
          console.log('  ID:', v.awemeId);
          console.log('  Desc:', v.desc);
          console.log('  Cover:', v.coverUrl);
          console.log('  Video:', v.videoUrl);
          console.log('  Likes:', v.diggCount);
          console.log('  Comments:', v.commentCount);
          console.log('  Shares:', v.shareCount);
          console.log('  Plays:', v.playCount);
        });
      } else {
        console.log('\nNo videos found in render data');
      }
    }
    
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
