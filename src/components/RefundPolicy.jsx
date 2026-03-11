function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.04) 0%, transparent 60%)', zIndex: 0 }} />
      <div className="relative px-4 md:px-8 py-16 max-w-3xl mx-auto" style={{ zIndex: 1 }}>
        <div className="mb-2 text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(74,222,128,0.6)' }}>🌿 PixelGrove</div>
        <h1 className="text-4xl font-bold text-white mb-2">Refund <span style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Policy</span></h1>
        <p className="text-gray-500 mb-10">Last updated: 2025</p>
        <div className="flex flex-col gap-8">
          {[
            { title: 'All Sales Are Final', body: 'Due to the digital nature of our products, all sales are final. We do not offer refunds once an order has been delivered.' },
            { title: 'When You Are Eligible for a Refund', body: 'You are eligible for a full refund ONLY if we are unable to deliver your order within 24 hours. If we cannot fulfill your order for any reason, you will receive a complete refund automatically.' },
            { title: 'Wrong Username', body: 'If you entered an incorrect Roblox username and the item was delivered to the wrong account, we are unable to issue a refund. Please double-check your username before checkout.' },
            { title: 'How to Request a Refund', body: 'If you believe you are eligible for a refund, please contact us on our Discord server at discord.gg/yZHbUFTh with your order details and we will review your case within 24 hours.' },
            { title: 'Chargebacks', body: 'Filing a chargeback without first contacting us will result in a permanent ban from ThePixelGrove. Please reach out to us first and we will do our best to resolve the issue.' },
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
export default RefundPolicy