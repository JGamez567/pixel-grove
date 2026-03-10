function HowItWorks() {
  const steps = [
    {
      icon: '🛒',
      title: 'Browse & Add to Cart',
      desc: 'Browse our shop and pick the pets or items you want. Select the type (Normal, Neon, Mega) and potion (No Pot, Fly, Ride, Fly-Ride) then add to cart.'
    },
    {
      icon: '👤',
      title: 'Enter Your Roblox Username',
      desc: 'At checkout, enter your exact Roblox username so we know who to trade in game. Make sure it\'s spelled correctly!'
    },
    {
      icon: '💳',
      title: 'Pay Securely',
      desc: 'Complete your payment through our secure Stripe checkout. We accept all major credit and debit cards.'
    },
    {
      icon: '🎮',
      title: 'We Deliver In Game',
      desc: 'Once payment is confirmed, we\'ll join your Adopt Me server and trade you your items directly. Simple and easy!'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.04) 0%, transparent 60%)', zIndex: 0 }} />

      <div className="relative px-4 md:px-8 py-16 max-w-3xl mx-auto" style={{ zIndex: 1 }}>
        <div className="mb-2 text-xs font-bold tracking-widest uppercase"
          style={{ color: 'rgba(74,222,128,0.6)' }}>🌿 PixelGrove</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">How It <span style={{
          background: 'linear-gradient(135deg, #4ade80, #86efac)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Works</span></h1>
        <p className="text-gray-500 mb-12">Everything you need to know about ordering from ThePixelGrove</p>

        {/* Steps */}
        <div className="flex flex-col gap-4 mb-12">
          {steps.map((step, i) => (
            <div key={i} className="rounded-2xl p-6 flex gap-5 items-start"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)' }}>
              <div className="text-4xl flex-shrink-0">{step.icon}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black px-2 py-0.5 rounded-md"
                    style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}>
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trading Notice */}
        <div className="rounded-2xl p-6 mb-6"
          style={{ background: 'rgba(251,191,36,0.04)', border: '1px solid rgba(251,191,36,0.15)' }}>
          <div className="flex gap-3 items-start">
            <span className="text-2xl flex-shrink-0">⚠️</span>
            <div>
              <h3 className="font-bold text-lg mb-2" style={{ color: '#fbbf24' }}>Trading Notice</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                The trading process is <span className="text-white font-bold">not fully automated</span>. We personally trade you every pet and item ourselves — no bots, no middlemen.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                During the day we are actively online and will deliver your order as quickly as possible. At night we may not be available immediately, but we <span className="text-white font-bold">guarantee delivery within 24 hours</span> of your purchase.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Once your order is ready, we'll find your server in Adopt Me and trade you directly. Make sure your username is correct at checkout!
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)' }}>
          <h3 className="text-white font-bold text-xl mb-4">Common Questions</h3>
          <div className="flex flex-col gap-4">
            {[
              { q: 'What if I enter the wrong username?', a: 'Contact us on Discord immediately after purchase and we\'ll sort it out.' },
              { q: 'How will I know when my order is coming?', a: 'Join our Discord to get notified when your order is being delivered.' },
              { q: 'What if I\'m not online when you deliver?', a: 'No worries! We\'ll try again. Just message us on Discord to coordinate a time.' },
              { q: 'Are your pets legit?', a: 'Yes! All our pets are obtained legitimately. We never use any hacks or exploits.' },
            ].map((faq, i) => (
              <div key={i} className="border-b pb-4" style={{ borderColor: 'rgba(74,222,128,0.06)' }}>
                <p className="text-white font-bold text-sm mb-1">{faq.q}</p>
                <p className="text-gray-500 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks