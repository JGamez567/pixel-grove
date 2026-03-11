function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.04) 0%, transparent 60%)', zIndex: 0 }} />
      <div className="relative px-4 md:px-8 py-16 max-w-3xl mx-auto" style={{ zIndex: 1 }}>
        <div className="mb-2 text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(74,222,128,0.6)' }}>🌿 PixelGrove</div>
        <h1 className="text-4xl font-bold text-white mb-2">Privacy <span style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Policy</span></h1>
        <p className="text-gray-500 mb-10">Last updated: 2025</p>
        <div className="flex flex-col gap-8" style={{ color: '#9ca3af', lineHeight: '1.8' }}>
          {[
            { title: 'Information We Collect', body: 'When you place an order we collect your Roblox username and payment information. Payment details are processed securely by Stripe and we never store your card information on our servers.' },
            { title: 'How We Use Your Information', body: 'We use your Roblox username solely to deliver your purchased items in game. We do not sell, trade, or share your personal information with third parties.' },
            { title: 'Payment Security', body: 'All payments are processed through Stripe, a PCI-compliant payment processor. We never have access to your full card details.' },
            { title: 'Cookies', body: 'Our website may use basic cookies to improve your browsing experience. You can disable cookies in your browser settings at any time.' },
            { title: 'Contact', body: 'If you have any questions about this Privacy Policy, please contact us on our Discord server at discord.gg/yZHbUFTh.' },
          ].map((section, i) => (
            <div key={i} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)' }}>
              <h2 className="text-white font-bold text-lg mb-3">{section.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default PrivacyPolicy