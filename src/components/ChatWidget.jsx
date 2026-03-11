import { useState, useRef, useEffect } from 'react'

const FAQS = [
  { q: 'How long does delivery take?', a: 'Delivery is guaranteed within 24 hours! We deliver daily between 12AM - 2AM CST.' },
  { q: 'How do I receive my pet?', a: 'After payment, we will join your Adopt Me server and trade you directly. Make sure your Roblox username is correct!' },
  { q: 'What if I entered the wrong username?', a: 'Contact us on Discord immediately at discord.gg/yZHbUFTh and we will fix it right away.' },
  { q: 'Do you offer refunds?', a: 'All sales are final. However if we cannot deliver your order, you will receive a full refund.' },
  { q: 'Is my payment secure?', a: 'Yes! We use Stripe for all payments - the same secure payment system used by millions of businesses worldwide.' },
  { q: 'How do I track my order?', a: 'Join our Discord server and open a support ticket with your order details and we will give you a status update.' },
]

function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hey! Welcome to PixelGrove support 🌿 How can we help you today?' }
  ])
  const [input, setInput] = useState('')
  const [view, setView] = useState('home') // 'home' | 'chat' | 'faq'
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, view])

  function sendMessage() {
    if (!input.trim()) return
    const userMsg = { from: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, {
        from: 'bot',
        text: 'Thanks for your message! Our team will get back to you soon. For faster help, join our Discord at discord.gg/yZHbUFTh 🌿'
      }])
    }, 800)
  }

  function handleFAQ(faq) {
    setView('chat')
    setMessages(prev => [
      ...prev,
      { from: 'user', text: faq.q },
      { from: 'bot', text: faq.a }
    ])
  }

  return (
    <>
      {/* Chat bubble button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-black font-bold text-2xl transition-all hover:scale-110 shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', boxShadow: '0 0 25px rgba(74,222,128,0.4)', zIndex: 1000 }}>
        {open ? '✕' : '💬'}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ background: '#0a0f0a', border: '1px solid rgba(74,222,128,0.2)', zIndex: 1000, height: '480px' }}>

          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.05)', borderBottom: '1px solid rgba(74,222,128,0.1)' }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
              style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)' }}>🌿</div>
            <div>
              <p className="text-white font-bold text-sm">PixelGrove Support</p>
              <p className="text-xs" style={{ color: '#4ade80' }}>● Online</p>
            </div>
          </div>

          {/* Home view */}
          {view === 'home' && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              <p className="text-gray-400 text-sm">👋 Hi! How can we help you?</p>
              <button onClick={() => setView('chat')}
                className="w-full text-left p-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                💬 Send us a message
              </button>
              <button onClick={() => setView('faq')}
                className="w-full text-left p-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105"
                style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                ❓ Quick answers
              </button>
              <a href="https://discord.gg/yZHbUFTh" target="_blank" rel="noopener noreferrer"
                className="w-full text-left p-3 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 block"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                💜 Join our Discord
              </a>
            </div>
          )}

          {/* FAQ view */}
          {view === 'faq' && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              <button onClick={() => setView('home')} className="text-xs font-bold mb-1 text-left" style={{ color: '#4ade80' }}>← Back</button>
              <p className="text-gray-400 text-xs mb-2">Common questions — tap to get an instant answer:</p>
              {FAQS.map((faq, i) => (
                <button key={i} onClick={() => handleFAQ(faq)}
                  className="w-full text-left p-3 rounded-xl text-xs font-bold text-white transition-all hover:scale-105"
                  style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.1)' }}>
                  {faq.q}
                </button>
              ))}
            </div>
          )}

          {/* Chat view */}
          {view === 'chat' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                <button onClick={() => setView('home')} className="text-xs font-bold mb-1 text-left" style={{ color: '#4ade80' }}>← Back</button>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-xs px-3 py-2 rounded-xl text-sm"
                      style={msg.from === 'user' ? {
                        background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                        color: '#000',
                        fontWeight: 'bold'
                      } : {
                        background: 'rgba(255,255,255,0.05)',
                        color: '#e5e7eb',
                        border: '1px solid rgba(74,222,128,0.1)'
                      }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-3 flex gap-2" style={{ borderTop: '1px solid rgba(74,222,128,0.1)' }}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  className="flex-1 text-white text-sm rounded-xl px-3 py-2 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.15)' }} />
                <button onClick={sendMessage}
                  className="px-3 py-2 rounded-xl font-bold text-black text-sm transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)' }}>
                  ➤
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default ChatWidget