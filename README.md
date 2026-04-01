# MKforChunTwo 粉丝站模板

一个基于 React + Vite 的现代化粉丝网站模板，采用暗色玻璃态设计，支持多页面切换、留言板、音乐播放器等功能。

---

## 📁 项目文件结构

```
F:\APP\小玩具\MKforChunTwo\
├── index.html              ← 网站入口文件（不要修改）
├── package.json             ← 项目配置（不要修改）
├── vite.config.js           ← Vite 构建配置（不要修改）
├── tailwind.config.js      ← 样式主题配置
├── postcss.config.js        ← CSS 处理器配置
│
├── start-dev.bat           ← ⭐双击启动开发服务器
├── build.bat               ← ⭐双击构建生产版本
├── install.bat             ← ⭐双击安装依赖（首次运行后不需要）
│
├── public/                 ← 公共资源文件夹
│   └── favicon.svg         ← 网站图标
│
└── src/                    ← 源代码文件夹（核心内容）
    ├── main.jsx            ← 程序入口（不要修改）
    ├── App.jsx             ← 主组件，控制页面跳转（不要修改）
    ├── index.css           ← 全局样式、动画效果
    │
    ├── store/              ← 数据配置文件夹 ⭐⭐⭐
    │   └── useStore.js     ← ⭐在这里修改所有个人信息！
    │
    ├── components/         ← 组件文件夹
    │   ├── Navbar.jsx      ← 顶部导航栏
    │   ├── Footer.jsx      ← 底部页脚
    │   ├── GlassCard.jsx   ← 玻璃态卡片组件
    │   ├── MusicPlayer.jsx ← 音乐播放器
    │   └── BirthdayCountdown.jsx ← 生日倒计时
    │
    ├── pages/              ← 页面文件夹
    │   ├── Home.jsx        ← 首页
    │   ├── Gallery.jsx     ← 图片库页面
    │   ├── Works.jsx       ← 作品展示页面
    │   └── Guestbook.jsx   ← 留言板页面
    │
    └── assets/             ← 资源文件夹
        └── images/         ← 存放图片（头像、封面等）
```

---

## 🔧 核心配置文件详解

### ⭐ useStore.js - 所有个人信息都在这里修改！

位置：`src/store/useStore.js`

这个文件包含了网站的**所有可配置内容**，修改这里就能改变网站信息。

```javascript
// 站点基本信息（修改这里的内容）
export const siteConfig = {
  name: '{{昵称}}',                    // ← 修改：网站名称/昵称
  subtitle: '{{简介描述}}',            // ← 修改：一句话简介
  avatar: '/avatar.jpg',             // ← 修改：头像图片路径

  // 基本信息卡片
  basicInfo: [
    { emoji: '🎂', label: '生日', value: '{{生日信息}}' },
    { emoji: '📏', label: '身高', value: '{{身高信息}}' },
    { emoji: '💼', label: '职业', value: '{{职业信息}}' },
    { emoji: '📍', label: '所在地', value: '{{所在地}}' },
  ],

  // 社交平台链接
  socialLinks: [
    { name: '抖音', url: '#', icon: 'douyin' },
    { name: 'B站', url: '#', icon: 'bilibili' },
    { name: '微博', url: '#', icon: 'weibo' },
    { name: '小红书', url: '#', icon: 'xiaohongshu' },
  ],

  // 生日设置（用于倒计时功能）
  birthday: {
    month: 1,   // ← 修改：生日月份
    day: 1,     // ← 修改：生日日期
  },

  // 音乐播放器设置
  music: {
    enabled: true,
    defaultVolume: 0.5,
  }
}
```

### tailwind.config.js - 主题色配置

位置：`tailwind.config.js`

修改主题色（御姐风格配色）：

```javascript
colors: {
  primary: '#E91E63',      // 玫红 - 主色调
  secondary: '#9C27B0',    // 深紫 - 辅助色
  accent: '#B71C1C',       // 酒红 - 强调色
  dark: '#1A1玩具',         // 深灰 - 背景色
  'dark-lighter': '#16213E',
}
```

---

## 🎨 功能介绍

| 功能 | 说明 | 位置 |
|------|------|------|
| 🏠 **首页** | 展示头像、昵称、基本信息、社交链接 | `src/pages/Home.jsx` |
| 🎂 **生日倒计时** | 自动计算距离下一个生日的时间 | `src/components/BirthdayCountdown.jsx` |
| 🖼️ **图片库** | 瀑布流布局展示照片，支持点击放大 | `src/pages/Gallery.jsx` |
| 🎬 **作品展示** | 展示视频/创作作品 | `src/pages/Works.jsx` |
| 💬 **留言板** | 访客留言、点赞功能（本地存储） | `src/pages/Guestbook.jsx` |
| 🎵 **音乐播放器** | 迷你播放器，支持播放/暂停/音量 | `src/components/MusicPlayer.jsx` |
| 🌙 **主题切换** | 暗色/亮色主题切换按钮 | `src/components/Navbar.jsx` |

---

## 🚀 快速开始

### 1. 安装依赖（首次运行）

双击运行：`install.bat`

> 提示：依赖安装成功后，不需要再次运行此文件。

### 2. 启动开发服务器

双击运行：`start-dev.bat`

启动后显示：
```
Local:   http://localhost:3000/
Network: http://192.168.x.x:3000/
```

在浏览器访问 `http://localhost:3000` 即可预览。

### 3. 停止服务器

在终端窗口按 `Ctrl + C`，然后输入 `Y` 回车。

---

## 📝 如何修改内容

### 步骤 1：修改个人信息

1. 打开 `src/store/useStore.js`
2. 按照注释修改 `siteConfig` 里的内容
3. 保存文件
4. 浏览器会自动刷新（开发模式下）

### 步骤 2：添加图片

1. 将图片放入 `public/` 文件夹
2. 在 `useStore.js` 中引用，例如：
   ```javascript
   avatar: '/my-avatar.jpg'
   ```

### 步骤 3：修改页面内容

| 页面 | 修改位置 |
|------|----------|
| 首页信息 | `src/store/useStore.js` |
| 图片库 | `src/pages/Gallery.jsx` 中的 `sampleImages` |
| 作品列表 | `src/pages/Works.jsx` 中的 `sampleWorks` |

---

## ❓ 常见问题

### Q: 页面显示空白
A: 确保开发服务器正在运行（终端窗口显示 `Local: http://localhost:3000/`）

### Q: 图片显示不出来
A: 检查图片是否放在 `public/` 文件夹，路径是否正确

### Q: 修改后没生效
A: 保存文件后，浏览器会自动刷新。如果没刷新，手动刷新浏览器

### Q: 想换主题色怎么办
A: 修改 `tailwind.config.js` 中的颜色值

---

## 📞 获取帮助

如果遇到问题，可以：
1. 检查终端是否有错误信息
2. 搜索错误信息关键词
3. 重新运行 `install.bat` 和 `start-dev.bat`

---

Made with 💖 by 包包 🦊