const puppeteer = require('puppeteer-core');
const fs = require('fs');

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
    
    // Collect API responses
    let profileData = null;
    let postData = null;
    
    page.on('response', async (response) => {
      const url = response.url();
      try {
        if (url.includes('/user/profile/other/')) {
          profileData = await response.json();
        }
        if (url.includes('/aweme/post/') && url.includes('sec_user_id')) {
          postData = await response.json();
        }
      } catch(e) {}
    });
    
    await page.goto('https://www.douyin.com/user/MS4wLjABAAAAHOVtxcxM99O16nn4WCfyniXigItbmbr75gHDssomtDI', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await new Promise(r => setTimeout(r, 5000));
    
    // Output profile data
    if (profileData && profileData.user) {
      const u = profileData.user;
      const result = {
        nickname: u.nickname,
        signature: u.signature,
        uid: u.uid,
        secUid: u.sec_uid,
        uniqueId: u.unique_id,
        shortId: u.short_id,
        avatarLarger: u.avatar_larger?.url_list?.[0],
        avatarMedium: u.avatar_medium?.url_list?.[0],
        avatarThumb: u.avatar_thumb?.url_list?.[0],
        avatar168: u.avatar_168x168?.url_list?.[0],
        followerCount: u.follower_count,
        followingCount: u.following_count,
        awemeCount: u.aweme_count,
        diggCount: u.digg_count,
        favoritingCount: u.favoriting_count,
        totalFavorited: u.total_favorited,
        constellation: u.constellation,
        location: u.location,
        schoolName: u.school_name,
        customVerify: u.custom_verify,
        enterpriseVerifyReason: u.enterprise_verify_reason,
        shareInfo: u.share_info,
      };
      
      console.log('=== PROFILE ===');
      console.log(JSON.stringify(result, null, 2));
    }
    
    // Output video list
    if (postData && postData.aweme_list) {
      console.log('\n=== VIDEOS (' + postData.aweme_list.length + ') ===');
      const videos = postData.aweme_list.map(v => {
        const video = v.video || {};
        const stats = v.statistics || {};
        const cover = video.cover || {};
        const originCover = video.originCover || {};
        const dynamicCover = video.dynamicCover || {};
        const playAddr = video.play_addr || {};
        const bitRate = video.bit_rate || [];
        
        // Get best quality play URL
        let playUrl = playAddr?.url_list?.[0] || '';
        if (bitRate.length > 0 && bitRate[0].play_addr?.url_list?.[0]) {
          playUrl = bitRate[0].play_addr.url_list[0];
        }
        
        return {
          awemeId: v.aweme_id,
          desc: v.desc,
          videoUrl: `https://www.douyin.com/video/${v.aweme_id}`,
          playUrl: playUrl,
          coverUrl: cover.url_list?.[0] || originCover.url_list?.[0] || dynamicCover.url_list?.[0],
          diggCount: stats.digg_count || 0,
          commentCount: stats.comment_count || 0,
          shareCount: stats.share_count || 0,
          playCount: stats.play_count || 0,
          createTime: v.create_time,
        };
      });
      
      console.log(JSON.stringify(videos, null, 2));
    }
    
  } catch(e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
