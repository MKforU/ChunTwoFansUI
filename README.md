# 纯儿小屋 🦊

> 马猴烧酒纯儿酱🥯 的个人粉丝站

一个基于 React + Vite + Tailwind CSS 的现代化粉丝网站，采用暗色玻璃态设计风格。

---

## ✨ 功能特色

| 功能 | 说明 |
|------|------|
| 🏠 **首页** | 头像、昵称、基本信息、社交数据（粉丝/获赞/作品）、生日倒计时 |
| 🎬 **作品展示** | 3列网格布局，展示抖音作品封面、标题、点赞/评论/分享数，点击跳转抖音 |
| 🖼️ **图片库** | 瀑布流照片墙，支持点击放大浏览 |
| 💬 **留言板** | 访客留言，管理员审核后对外显示 |
| 🏆 **名人堂** | 粉丝入驻展示，支持抖音主页外显控制 |
| 🎵 **音乐播放器** | 底部迷你播放器 |
| 🌙 **主题切换** | 暗色/亮色主题 |
| 🔐 **管理后台** | 隐藏入口（导航栏Logo连续点击5次），支持站点信息/图片库/作品/留言审核/名人堂管理 |

---

## 🛠️ 技术栈

- **React** + **Vite** — 前端框架与构建工具
- **Tailwind CSS** — 原子化样式
- **Framer Motion** — 动画效果
- **Zustand** — 状态管理（localStorage 持久化）
- **React Router** — 客户端路由（HashRouter，兼容 GitHub Pages）

---

## 📁 项目结构

```
src/
├── main.jsx                 ← 程序入口
├── App.jsx                  ← 路由配置
├── index.css                ← 全局样式与动画
├── store/
│   └── useStore.js          ← 核心配置（昵称、简介、社交链接等）
├── components/
│   ├── Navbar.jsx           ← 导航栏
│   ├── Footer.jsx           ← 页脚
│   ├── GlassCard.jsx        ← 玻璃态卡片组件
│   ├── MusicPlayer.jsx      ← 音乐播放器
│   └── BirthdayCountdown.jsx ← 生日倒计时
├── pages/
│   ├── Home.jsx             ← 首页
│   ├── Gallery.jsx          ← 图片库
│   ├── Works.jsx            ← 作品展示（抖音数据）
│   ├── Guestbook.jsx        ← 留言板
│   ├── HallOfFame.jsx       ← 名人堂
│   ├── AdminLogin.jsx       ← 管理员登录
│   └── AdminDashboard.jsx   ← 管理后台
└── assets/images/           ← 静态资源
```

---

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（端口 3000）
npm run dev

# 构建生产版本
npm run build
```

---

## 📊 数据来源

- **用户信息** — 抖音主页 API（昵称、头像、粉丝数、获赞数等）
- **作品数据** — 抖音作品列表 API（封面、标题、点赞数、视频链接）
- **留言板 / 名人堂** — localStorage 存储，管理后台审核

---

## 🎨 设计风格

- **主题色**：玫红 `#E91E63` + 深紫 `#9C27B0` + 酒红 `#B71C1C`
- **背景色**：`#1A1A2E`
- **效果**：玻璃态毛玻璃、霓虹光晕、渐变文字

---

Made with 💖 by 包包 🦊
