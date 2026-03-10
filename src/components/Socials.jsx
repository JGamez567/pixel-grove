function Socials() {
  const socials = [
    {
      icon: '🎵',
      name: 'TikTok',
      handle: '@thepixelgrove',
      desc: 'Follow us on TikTok for pet showcases, restocks, giveaways, and behind the scenes content!',
      color: '#f0abfc',
      glow: 'rgba(240,171,252,0.15)',
      border: 'rgba(240,171,252,0.2)',
      href: 'https://www.tiktok.com/@thepixelgrove',
      btnLabel: 'Follow on TikTok',
      btnColor: 'linear-gradient(135deg, #f0abfc, #c084fc)',
    },
    {
      icon: '💬',
      name: 'Discord',
      handle: 'ThePixelGrove',
      desc: 'Join our Discord server to get order updates, coordinate deliveries, and chat with the community!',
      color: '#818cf8',
      glow: 'rgba(129,140,248,0.15)',
      border: 'rgba(129,140,248,0.2)',
      href: 'https://discord.gg/B6tghWX5mz',
      btnLabel: 'Join Discord',
      btnColor: 'linear-gradient(135deg, #818cf8, #6366f1)',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.04) 0%, transparent 60%)', zIndex: 0 }} />

      <div className="relative px-4 md:px-8 py-16 max-w-2xl mx-auto" style={{ zIndex: 1 }}>
        <div className="mb-2 text-xs font-bold tracking-widest uppercase"
          style={{ color: 'rgba(74,222,128,0.6)' }}>🌿 PixelGrove</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Our <span style={{
          background: 'linear-gradient(135deg, #4ade80, #86efac)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Socials</span></h1>
        <p className="text-gray-500 mb-12">Stay connected with ThePixelGrove community</p>

        <div className="flex flex-col gap-6">
          {socials.map((s, i) => (
            <div key={i} className="rounded-2xl p-8"
              style={{ background: s.glow, border: `1px solid ${s.border}` }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">{s.icon}</div>
                <div>
                  <h2 className="text-white font-bold text-2xl">{s.name}</h2>
                  <p className="text-sm font-bold" style={{ color: s.color }}>{s.handle}</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">{s.desc}</p>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-black font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 text-sm"
                style={{ background: s.btnColor, boxShadow: `0 0 20px ${s.border}` }}>
                {s.btnLabel}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Socials