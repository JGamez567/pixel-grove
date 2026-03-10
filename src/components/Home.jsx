import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'

function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.7 + 0.3,
      pulse: Math.random() * Math.PI * 2,
    }))

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(star => {
        star.pulse += 0.02
        star.y -= star.speed
        if (star.y < 0) {
          star.y = canvas.height
          star.x = Math.random() * canvas.width
        }
        const opacity = star.opacity * (0.6 + 0.4 * Math.sin(star.pulse))
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(134, 239, 172, ${opacity})`
        ctx.fill()
      })
      animationId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
  )
}

function Home() {
  const [reviews, setReviews] = useState([])
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [submitted, setSubmitted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    async function fetchReviews() {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(4)
      if (data) setReviews(data)
    }
    fetchReviews()
  }, [])

  async function handleSubmit() {
    if (!username.trim() || !message.trim()) {
      alert('Please fill in all fields!')
      return
    }
    const { error } = await supabase.from('reviews').insert({
      username, message, rating, approved: false
    })
    if (error) console.error(error)
    else setSubmitted(true)
  }

  const fadeIn = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `all 0.7s ease ${delay}s`
  })

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-x-hidden">
      <StarField />

      {/* Glow blobs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 70%)', zIndex: 0 }} />
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)', zIndex: 0 }} />

      <div className="relative" style={{ zIndex: 1 }}>

        {/* ── HERO ── */}
        <section className="flex flex-col items-center text-center px-4 md:px-8 pt-28 pb-16">

          {/* Badge */}
          <div
  className="mb-6 px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase"
  style={{
    ...fadeIn(0),
    borderColor: 'rgba(74,222,128,0.3)',
    color: 'rgb(134,239,172)',
    background: 'rgba(74,222,128,0.05)'
  }}>
            ✨ Roblox & Adopt Me Store
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" style={fadeIn(0.1)}>
            Get Your Dream<br />
            <span style={{
              background: 'linear-gradient(135deg, #4ade80, #86efac)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Pet Instantly</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-lg leading-relaxed" style={fadeIn(0.2)}>
            Skip hours of trading. Browse rare Adopt Me pets and Roblox items — delivered personally, every time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-10" style={fadeIn(0.3)}>
            <Link to="/shop"
              className="px-8 py-3 rounded-xl font-bold text-black transition-all hover:scale-105 text-lg"
              style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', boxShadow: '0 0 25px rgba(74,222,128,0.35)' }}>
              🛒 Shop All Now
            </Link>
            <Link to="/how-it-works"
              className="px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 text-lg"
              style={{ border: '1px solid rgba(74,222,128,0.4)', color: '#86efac', background: 'rgba(74,222,128,0.05)' }}>
              How It Works
            </Link>
          </div>

          {/* Category Quick Links */}
          <div className="flex flex-wrap gap-3 justify-center mb-20" style={fadeIn(0.4)}>
            {[
              { label: '🐾 Mega Pets', filter: 'Mega' },
              { label: '✨ Neon Pets', filter: 'Neon' },
              { label: '🐶 Normal Pets', filter: 'Normal' },
              { label: '🥚 Eggs', filter: 'Egg' },
              { label: '🎮 Roblox Items', filter: 'Roblox Item' },
            ].map((cat, i) => (
              <Link key={i} to={`/shop?filter=${encodeURIComponent(cat.filter)}`}
                className="px-4 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
                style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)', color: '#86efac' }}>
                {cat.label}
              </Link>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="px-4 md:px-8 pb-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🤝', title: 'Personal Trading', desc: 'We personally trade every order — no bots, just real people' },
              { icon: '⏰', title: 'Guaranteed delivery within 24 hours', desc: 'We deliver daily between 12AM – 2AM CST.If you order outside of these hours, no worries — your item will be on its way the next delivery window!' },
              { icon: '🔒', title: 'Safe & Secure', desc: 'Secure Stripe payments and trusted by our growing community' },
            ].map((card, i) => (
              <div key={i}
                className="rounded-2xl p-7 text-center transition-all hover:scale-105 cursor-default"
                style={{
                  ...fadeIn(0.4 + i * 0.1),
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(74,222,128,0.1)',
                }}>
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="px-4 md:px-8 pb-24 max-w-3xl mx-auto"
          style={{ borderTop: '1px solid rgba(74,222,128,0.08)', paddingTop: '3rem' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '24hr', label: 'Delivery Guarantee' },
              { value: 'Fast', label: 'Delivery' },
              { value: '100%', label: 'Safe & Secure' },
              { value: '🌿', label: 'PixelGrove' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1"
                  style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {stat.value}
                </div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS PREVIEW ── */}
        <section className="px-4 md:px-8 pb-24 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">How It Works</h2>
          <p className="text-gray-500 mb-10">Simple, safe, and fast 🌿</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: '🛒', step: '1', title: 'Add to Cart' },
              { icon: '👤', step: '2', title: 'Enter Username' },
              { icon: '💳', step: '3', title: 'Pay Securely' },
              { icon: '🎮', step: '4', title: 'We Deliver!' },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl p-5"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)' }}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-xs font-black mb-1" style={{ color: '#4ade80' }}>Step {s.step}</div>
                <p className="text-white text-sm font-bold">{s.title}</p>
              </div>
            ))}
          </div>
          <Link to="/how-it-works"
            className="inline-block px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
            style={{ border: '1px solid rgba(74,222,128,0.3)', color: '#86efac', background: 'rgba(74,222,128,0.05)' }}>
            Learn More →
          </Link>
        </section>

        {/* ── REVIEWS ── */}
        <section className="px-4 md:px-8 pb-24 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">What People Say</h2>
            <p className="text-gray-500">Real reviews from real customers 🌿</p>
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-600 text-center mb-10">No reviews yet — be the first!</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
                {reviews.map(review => (
                  <div key={review.id} className="rounded-2xl p-6"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-bold">{review.username}</h3>
                      <span className="text-yellow-400 text-sm">{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{review.message}</p>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Link to="/reviews"
                  className="inline-block mb-10 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
                  style={{ border: '1px solid rgba(74,222,128,0.3)', color: '#86efac', background: 'rgba(74,222,128,0.05)' }}>
                  See All Reviews
                </Link>
              </div>
            </>
          )}

          {/* Review Form */}
          <div className="rounded-2xl p-6 md:p-8 text-left max-w-xl mx-auto"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.1)' }}>
            <h3 className="text-white font-bold text-xl mb-6">Leave a Review</h3>
            {submitted ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">🎉</div>
                <p className="font-bold" style={{ color: '#4ade80' }}>Thanks for your review!</p>
                <p className="text-gray-500 text-sm mt-1">It'll show up once approved</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-white font-bold text-sm block mb-2">Roblox Username</label>
                  <input type="text" placeholder="Your Roblox username..." value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full text-white rounded-lg px-4 py-3 outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)' }} />
                </div>
                <div>
                  <label className="text-white font-bold text-sm block mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setRating(star)}
                        className={`text-2xl transition ${star <= rating ? 'opacity-100' : 'opacity-30'}`}>⭐</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-white font-bold text-sm block mb-2">Review</label>
                  <textarea placeholder="Tell us about your experience..." value={message}
                    onChange={e => setMessage(e.target.value)} rows={3}
                    className="w-full text-white rounded-lg px-4 py-3 outline-none resize-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.2)' }} />
                </div>
                <button onClick={handleSubmit}
                  className="w-full font-bold py-3 rounded-lg transition-all hover:scale-105 text-black"
                  style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', boxShadow: '0 0 15px rgba(74,222,128,0.2)' }}>
                  Submit Review
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── SOCIALS CTA ── */}
        <section className="px-4 md:px-8 pb-24 max-w-2xl mx-auto text-center">
          <div className="rounded-2xl p-10"
            style={{ background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.1)' }}>
            <div className="text-5xl mb-4">🌿</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Join Our Community</h2>
            <p className="text-gray-400 mb-6">Follow us on TikTok and join our Discord for restocks, giveaways, and order updates!</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="https://discord.gg/yZHbUFTh" target="_blank" rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #818cf8, #6366f1)', boxShadow: '0 0 20px rgba(129,140,248,0.2)' }}>
                💬 Join Discord
              </a>
              <Link to="/socials"
                className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                style={{ border: '1px solid rgba(74,222,128,0.3)', color: '#86efac', background: 'rgba(74,222,128,0.05)' }}>
                All Socials →
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default Home