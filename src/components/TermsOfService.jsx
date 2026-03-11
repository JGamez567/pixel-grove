function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.04) 0%, transparent 60%)', zIndex: 0 }} />
      <div className="relative px-4 md:px-8 py-16 max-w-3xl mx-auto" style={{ zIndex: 1 }}>
        <div className="mb-2 text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(74,222,128,0.6)' }}>🌿 PixelGrove</div>
        <h1 className="text-4xl font-bold text-white mb-2">Terms of <span style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Service</span></h1>
        <p className="text-gray-500 mb-10">Last updated: 2025</p>
        <div className="flex flex-col gap-8">
          {[
            { title: '1. Acceptance of Terms', body: 'By purchasing from ThePixelGrove, you agree to these Terms of Service. If you do not agree, please do not make a purchase.' },
            { title: '2. Our Service', body: 'ThePixelGrove sells virtual in-game items for Roblox games including Adopt Me. We are not affiliated with Roblox Corporation or Uplift Games.' },
            { title: '3. Delivery', body: 'We guarantee delivery within 24 hours of purchase. Delivery is performed manually by our team in-game. You must provide a valid Roblox username at checkout.' },
            { title: '4. User Responsibilities', body: 'You are responsible for providing the correct Roblox username at checkout. ThePixelGrove is not responsible for failed deliveries caused by incorrect usernames.' },
            { title: '5. Prohibited Activity', body: 'Chargebacks or payment disputes without first contacting us will result in a permanent ban from our store. Any attempt to defraud ThePixelGrove will be reported.' },
            { title: '6. Limitation of Liability', body: 'ThePixelGrove is not responsible for any account bans or penalties imposed by Roblox or Uplift Games as a result of purchasing virtual items.' },
            { title: '7. Contact', body: 'For any questions regarding these Terms, contact us on Discord at discord.gg/yZHbUFTh.' },
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
export default TermsOfService