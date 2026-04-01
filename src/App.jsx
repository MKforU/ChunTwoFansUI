import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useStore } from './store/useStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import Works from './pages/Works'
import Guestbook from './pages/Guestbook'
import MusicPlayer from './components/MusicPlayer'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const { theme } = useStore()

  return (
    <BrowserRouter>
      <div className={`min-h-screen relative ${theme === 'dark' ? 'bg-dark' : 'bg-gray-100'}`}>
        {/* 背景效果 */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(233, 30, 99, 0.15), transparent 50%),
                          radial-gradient(circle at 70% 70%, rgba(156, 39, 176, 0.15), transparent 50%),
                          radial-gradient(circle at 50% 50%, rgba(183, 28, 28, 0.1), transparent 50%)`
            }}
          />
        </div>

        {/* 导航栏 */}
        <Navbar />

        {/* 主内容区 */}
        <main className="pt-20 pb-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/works" element={<Works />} />
            <Route path="/guestbook" element={<Guestbook />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>

        {/* 音乐播放器 */}
        <MusicPlayer />

        {/* 页脚 */}
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
