import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 配置信息（可替换）
export const siteConfig = {
  name: '{{昵称}}',
  subtitle: '{{简介描述}}',
  avatar: '/avatar.jpg',
  
  basicInfo: [
    { emoji: '🎂', label: '生日', value: '{{生日信息}}' },
    { emoji: '📏', label: '身高', value: '{{身高信息}}' },
    { emoji: '💼', label: '职业', value: '{{职业信息}}' },
    { emoji: '📍', label: '所在地', value: '{{所在地}}' },
  ],

  socialLinks: [
    { name: '抖音', url: '#', icon: 'douyin' },
    { name: 'B站', url: '#', icon: 'bilibili' },
    { name: '微博', url: '#', icon: 'weibo' },
    { name: '小红书', url: '#', icon: 'xiaohongshu' },
  ],

  birthday: {
    month: 2,  // 2月
    day: 11,   // 11日
  },

  music: {
    enabled: true,
    defaultVolume: 0.5,
  }
}

// 状态管理
export const useStore = create(
  persist(
    (set, get) => ({
      // 主题
      theme: 'dark',
      toggleTheme: () => set(state => ({ 
        theme: state.theme === 'dark' ? 'light' : 'dark' 
      })),

      // 音乐播放器
      isMusicPlaying: false,
      currentTrack: null,
      volume: siteConfig.music.defaultVolume,
      setMusicPlaying: (playing) => set({ isMusicPlaying: playing }),
      setCurrentTrack: (track) => set({ currentTrack: track }),
      setVolume: (volume) => set({ volume }),

      // 图片查看器
      isImageViewerOpen: false,
      currentImageIndex: 0,
      images: [],
      openImageViewer: (images, index) => set({ 
        isImageViewerOpen: true, 
        images, 
        currentImageIndex: index 
      }),
      closeImageViewer: () => set({ isImageViewerOpen: false }),
      setImageIndex: (index) => set({ currentImageIndex: index }),

      // 主题色
      primaryColor: '#E91E63',
      setPrimaryColor: (color) => set({ primaryColor: color }),
    }),
    {
      name: 'fansite-storage',
      partialize: (state) => ({ 
        theme: state.theme,
        volume: state.volume,
        primaryColor: state.primaryColor 
      }),
    }
  )
)
