import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

// ── Google Fonts injection ──
const fontLink = document.createElement('link')
fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap'
fontLink.rel = 'stylesheet'
if (!document.head.querySelector('[href*="Outfit"]')) document.head.appendChild(fontLink)

function Success() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [user, setUser] = useState(null)
  const [hasOrder, setHasOrder] = useState(false)
  const [reviewMessage, setReviewMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [submitted, setSubmitted] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 80)
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user)
      if (user?.email) {
        const { data } = await supabase.from('orders').select('id').eq('email', user.email).limit(1)
        setHasOrder(data && data.length > 0)
      }
    })
  }, [])

  async function handleSubmitReview() {
    if (!reviewMessage.trim()) return
    const { error } = await supabase.from('reviews').insert({
      username: user.user_metadata?.username || user.email?.split('@')[0],
      message: reviewMessage,
      rating,
      approved: false,
      verified: true,
    })
    if (!error) setSubmitted(true)
  }

  const fadeIn = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  return (
    <div style={{ minHeight: '100vh', background: '#050c05', fontFamily: 'DM Sans, sans-serif', overflowX: 'hidden' }}>
      {/* Glow */}
      <div style={{ position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 65%)' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px', margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>

        {/* Icon */}
        <div style={{ ...fadeIn(0), fontSize: '72px', marginBottom: '24px' }}>🎉</div>

        {/* Headline */}
        <div style={fadeIn(0.08)}>
          <p style={{ color: 'rgba(74,222,128,0.6)', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>Purchase Complete</p>
          <h1 style={{ color: '#f0faf0', fontSize: 'clamp(36px,7vw,64px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.5px', fontFamily: 'Outfit, sans-serif', marginBottom: '16px' }}>
            Order <span style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Confirmed!</span>
          </h1>
          <p style={{ color: 'rgba(180,220,180,0.6)', fontSize: '17px', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 48px' }}>
            Thank you for your purchase! Your pet will be delivered to your Roblox account during our next delivery window.
          </p>
        </div>

        {/* Info cards */}
        <div style={{ ...fadeIn(0.16), display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px', textAlign: 'left' }}>
          {[
            {
              icon: '⚡',
              title: 'Delivery Hours',
              desc: 'Our delivery hours are 12PM–2AM CST daily. If you ordered outside this window, your pet will arrive during the next delivery window.',
            },
            {
              icon: '🎮',
              title: 'How It Works',
              desc: 'Expect a friend request from sourpatchcookie109. Accept it and join our server — we\'ll trade your pet to you directly!',
            },
            {
              icon: '❓',
              title: 'Need Help?',
              desc: 'Contact us at thepixelgrove1@gmail.com or join our Discord for any questions or support.',
            },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '16px',
              padding: '20px', borderRadius: '18px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)',
              position: 'relative', overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.22)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.08)'}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.2), transparent)' }} />
              <span style={{ fontSize: '28px', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <h3 style={{ color: '#f0faf0', fontWeight: 700, fontSize: '15px', marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>{item.title}</h3>
                <p style={{ color: 'rgba(180,220,180,0.55)', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Review section */}
        {user && hasOrder && (
          <div style={{ ...fadeIn(0.24), marginBottom: '32px' }}>
            {!showReviewForm ? (
              <div style={{ padding: '28px', borderRadius: '20px', background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.12)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.3), transparent)' }} />
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⭐</div>
                <h3 style={{ color: '#f0faf0', fontWeight: 800, fontSize: '18px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>Enjoying your purchase?</h3>
                <p style={{ color: 'rgba(180,220,180,0.5)', fontSize: '14px', marginBottom: '20px' }}>Leave a quick verified review — it really helps us out!</p>
                <button onClick={() => setShowReviewForm(true)}
                  style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#000', fontWeight: 700, fontSize: '14px', cursor: 'pointer', border: 'none', boxShadow: '0 0 20px rgba(74,222,128,0.2)', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  ✓ Leave a Review
                </button>
              </div>
            ) : submitted ? (
              <div style={{ padding: '28px', borderRadius: '20px', background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.15)', textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
                <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '16px', fontFamily: 'Outfit, sans-serif' }}>Thanks for your review!</p>
                <p style={{ color: 'rgba(180,220,180,0.5)', fontSize: '13px', marginTop: '6px' }}>It will show up once approved.</p>
              </div>
            ) : (
              <div style={{ padding: '28px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.1)', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.35), transparent)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ color: '#f0faf0', fontWeight: 800, fontSize: '18px', fontFamily: 'Outfit, sans-serif', margin: 0 }}>Leave a Review</h3>
                  <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>✓ Verified Purchase</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Rating</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[1,2,3,4,5].map(star => (
                        <button key={star} onClick={() => setRating(star)} style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer', opacity: star <= rating ? 1 : 0.22, transition: 'all 0.2s', transform: star <= rating ? 'scale(1.1)' : 'scale(1)' }}>⭐</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Your Review</label>
                    <textarea placeholder="Tell us about your experience..." value={reviewMessage} onChange={e => setReviewMessage(e.target.value)} rows={3}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(74,222,128,0.18)', color: '#f0faf0', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.18)'} />
                  </div>
                  <button onClick={handleSubmitReview}
                    style={{ padding: '13px', borderRadius: '12px', background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#000', fontWeight: 700, fontSize: '14px', cursor: 'pointer', border: 'none', boxShadow: '0 0 20px rgba(74,222,128,0.2)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(74,222,128,0.35)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(74,222,128,0.2)' }}>
                    Submit Review
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ ...fadeIn(0.3), display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/shop" style={{
            padding: '14px 32px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #4ade80, #22c55e)',
            color: '#000', fontWeight: 700, fontSize: '15px', textDecoration: 'none',
            boxShadow: '0 0 25px rgba(74,222,128,0.3)', transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(74,222,128,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 25px rgba(74,222,128,0.3)' }}>
            🛒 Back to Shop
          </Link>
          <a href="https://discord.gg/yZHbUFTh" target="_blank" rel="noopener noreferrer"
            style={{ padding: '14px 32px', borderRadius: '14px', background: 'linear-gradient(135deg, #818cf8, #6366f1)', color: '#fff', fontWeight: 700, fontSize: '15px', textDecoration: 'none', boxShadow: '0 0 20px rgba(99,102,241,0.25)', transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            💬 Join Discord
          </a>
          {user && (
            <Link to="/account" style={{ padding: '14px 32px', borderRadius: '14px', border: '1px solid rgba(74,222,128,0.25)', color: '#86efac', fontWeight: 700, fontSize: '15px', textDecoration: 'none', background: 'rgba(74,222,128,0.05)', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(74,222,128,0.05)'}>
              📦 View Orders
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}

export default Success