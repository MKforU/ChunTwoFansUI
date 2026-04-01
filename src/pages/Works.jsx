import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import GlassCard from '../components/GlassCard'

// 真实抖音作品数据
const douyinWorks = [
  {
    id: '7621526593139287538',
    desc: '#ooc致歉 #叉子摇',
    cover: 'https://p3-pc-sign.douyinpic.com/tos-cn-i-0813c001/oYAcMGEgDOAiKioGD1ek14f9A0BJACAI6Ag0NF~tplv-dy-cropcenter:323:430.jpeg?lk3s=138a59ce&x-expires=2090419200&x-signature=3c9rMQdn5Cc%2F59Ae6av9jnJ72uM%3D&from=327834062&s=PackSourceEnum_PUBLISH&se=true&sh=323_430&sc=cover&biz_tag=pcweb_cover&l=202604020021200391E2784EC0506692A7',
    videoUrl: 'https://www.douyin.com/video/7621526593139287538',
    diggCount: 887,
    commentCount: 28,
    shareCount: 28,
    createTime: 1774524943,
  },
  {
    id: '7608470718691676262',
    desc: '#旅行碎片',
    cover: 'https://p3-pc-sign.douyinpic.com/tos-cn-i-0813c000-ce/okWWe1Wp0EeAAAE6tEyiRCtiIpBArUAuywf4ud~noop.jpeg?lk3s=138a59ce&x-expires=1776268800&x-signature=fMdGoOgtFDWcGWDJKuZ9qaUaUsQ%3D&from=327834062&s=PackSourceEnum_PUBLISH&se=false&biz_tag=pcweb_cover&l=202604020021200391E2784EC0506692A7',
    videoUrl: 'https://www.douyin.com/video/7608470718691676262',
    diggCount: 1735,
    commentCount: 15,
    shareCount: 3,
    createTime: 1771485139,
  },
  {
    id: '7591457803786792393',
    desc: '流萤专属女友视角～😽#ooc致歉',
    cover: 'https://p3-pc-sign.douyinpic.com/tos-cn-i-0813c000-ce/ogAqGqBgYAENqi6aVDRujMAIqPRBYBABpiAPa~tplv-dy-cropcenter:323:430.jpeg?lk3s=138a59ce&x-expires=2090419200&x-signature=WFu%2BlJeO4cUuq%2F3LlbBTLUXGm6M%3D&from=327834062&s=PackSourceEnum_PUBLISH&se=true&sh=323_430&sc=cover&biz_tag=pcweb_cover&l=202604020021200391E2784EC0506692A7',
    videoUrl: 'https://www.douyin.com/video/7591457803786792393',
    diggCount: 1879,
    commentCount: 54,
    shareCount: 46,
    createTime: 1767524010,
  },
  {
    id: '7587148592176254254',
    desc: '往事流转 在你眼眸',
    cover: 'https://p3-pc-sign.douyinpic.com/tos-cn-i-0813c000-ce/ooIAVlSDHJ9AjA2xMCQACLITf7G4GKABfeAhf4~tplv-dy-cropcenter:323:430.jpeg?lk3s=138a59ce&x-expires=2090419200&x-signature=Ax4GeLT6rrzYTg%2FzSDIHibo7wxQ%3D&from=327834062&s=PackSourceEnum_PUBLISH&se=true&sh=323_430&sc=cover&biz_tag=pcweb_cover&l=202604020021200391E2784EC0506692A7',
    videoUrl: 'https://www.douyin.com/video/7587148592176254254',
    diggCount: 1001,
    commentCount: 34,
    shareCount: 26,
    createTime: 1766557800,
  },
  {
    id: '7584070604753554715',
    desc: 'bgm叫了你还叫什么#眼镜杀',
    cover: 'https://p9-pc-sign.douyinpic.com/tos-cn-p-0015/o4BiKhaAiAw5aThE2jvHdHBAZIPIAULCYQbBY~tplv-dy-cropcenter:323:430.jpeg?lk3s=138a59ce&x-expires=2090419200&x-signature=JlEXDJ8OfquGhM%2Bx%2BeADDRo5H6o%3D&from=327834062&s=PackSourceEnum_PUBLISH&se=true&sh=323_430&sc=cover&biz_tag=pcweb_cover&l=202604020021200391E2784EC0506692A7',
    videoUrl: 'https://www.douyin.com/video/7584070604753554715',
    diggCount: 1571,
    commentCount: 27,
    shareCount: 17,
    createTime: 1765804057,
  },
  {
    id: '7578200457395314634',
    desc: '#黑长直永远的神',
    cover: 'https://p3-pc-sign.douyinpic.com/tos-cn-i-0813/os9gMgLXAraAZ0D0ecmCAOQcSiINEAirAAAlfB~tplv-dy-cropcenter:323:430.jpeg?lk3s=138a59ce&x-expires=2090419200&x-signature=aqq32sd1MgZeaQTG1etCIi7bM78%3D&from=327834062&s=PackSourceEnum_PUBLISH&se=true&sh=323_430&sc=cover&biz_tag=pcweb_cover&l=202604020021200391E2784EC0506692A7',
    videoUrl: 'https://www.douyin.com/video/7578200457395314634',
    diggCount: 1318,
    commentCount: 13,
    shareCount: 6,
    createTime: 1764437298,
  },
  {
    id: '7569935070317678002',
    desc: '又出现啦～#流萤#ooc致歉',
    cover: 'https://p3-pc-sign.douyinpic.com/tos-cn-p-0015/o8N5gDBAEIpoi0dfQDfB90FM914jzcAvAiAZHE~tplv-dy-cropcenter:323:430.jpeg?lk3s=138a59ce&x-expires=2090419200&x-signature=bMnDVDQzRaA1vJZu%2BnjbDvGBgsA%3D&from=327834062&s=PackSourceEnum_PUBLISH&se=true&sh=323_430&sc=cover&biz_tag=pcweb_cover&l=202604020021200391E2784EC0506692A7',
    videoUrl: 'https://www.douyin.com/video/7569935070317678002',
    diggCount: 1720,
    commentCount: 35,
    shareCount: 54,
    createTime: 1762512857,
  },
]

function formatCount(count) {
  if (count >= 10000) return (count / 10000).toFixed(1) + '万'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'k'
  return count.toString()
}

function Works() {
  const { primaryColor } = useStore()

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">作品展示</h1>
          <p className="text-white/60">精选创作内容</p>
        </motion.div>

        {/* 作品列表 */}
        <div className="space-y-6">
          {douyinWorks.map((work, index) => (
            <motion.a
              key={work.id}
              href={work.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="block group"
            >
              <GlassCard className="overflow-hidden transition-all duration-300 hover:scale-[1.01]">
                <div className="flex flex-col md:flex-row">
                  {/* 封面 */}
                  <div className="md:w-64 flex-shrink-0 relative overflow-hidden">
                    <img
                      src={work.cover}
                      alt={work.desc}
                      className="w-full h-48 md:h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* 播放图标 */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100"
                        style={{ background: 'rgba(0,0,0,0.6)' }}
                      >
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                          {work.desc}
                        </h3>
                      </div>
                    </div>

                    {/* 数据统计 */}
                    <div className="flex items-center gap-5 text-white/60 text-sm">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#E91E63' }}>
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        {formatCount(work.diggCount)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {formatCount(work.commentCount)}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        {formatCount(work.shareCount)}
                      </span>
                    </div>

                    {/* 查看按钮 */}
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium transition-colors"
                      style={{ color: primaryColor }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      在抖音中观看
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.a>
          ))}
        </div>

        {/* 底部提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <GlassCard className="inline-block px-8 py-4">
            <p className="text-white/50 text-sm">
              🎬 更多精彩作品请前往
              <a
                href="https://www.douyin.com/user/MS4wLjABAAAAHOVtxcxM99O16nn4WCfyniXigItbmbr75gHDssomtDI"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium transition-colors"
                style={{ color: '#E91E63' }}
              >
                {' '}抖音主页{' '}
              </a>
              查看～
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}

export default Works
