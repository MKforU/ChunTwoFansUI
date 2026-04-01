import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 配置信息（可替换）
export const siteConfig = {
  name: '马猴烧酒纯儿酱🥯',
  subtitle: '@星穹练习班',
  avatar: '/avatar.jpg',
  
  basicInfo: [
    { emoji: '🎂', label: '生日', value: '2002年2月11日' },
    { emoji: '🎬', label: '作品', value: '9' },
    { emoji: '❤️', label: '获赞', value: '2.0万' },
    { emoji: '👥', label: '粉丝', value: '2691' },
  ],

  socialLinks: [
    { name: '抖音', url: 'https://www.douyin.com/user/MS4wLjABAAAAHOVtxcxM99O16nn4WCfyniXigItbmbr75gHDssomtDI', icon: 'douyin' },
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
