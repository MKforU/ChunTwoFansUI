import { siteConfig } from '../store/useStore'

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 py-3 px-4 text-center glass-dark">
      <div className="text-white/60 text-xs">
        <p>© 2026 {siteConfig.name} 粉丝站 | Made with 💖</p>
      </div>
    </footer>
  )
}

export default Footer
