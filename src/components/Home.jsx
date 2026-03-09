import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabase'

function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars = Array.from({ length: 120 }, () => ({
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
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
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

  return (
    <div className="relative min-h-screen bg-gray-950 overflow-x-hidden">
      <StarField />

      {/* Glow blobs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)', zIndex: 0 }} />
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)', zIndex: 0 }} />

      <div className="relative flex flex-col items-center text-center px-4 md:px-8 pt-32 pb-20" style={{ zIndex: 1 }}>

        {/* Badge */}
        <div
          className="mb-8 px-4 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease',
            borderColor: 'rgba(74,222,128,0.3)',
            color: 'rgb(134,239,172)',
            background: 'rgba(74,222,128,0.05)'
          }}>
         Roblox & Adopt Me Store
        </div>

        {/* Hero */}
        <h1
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.7s ease 0.1s'
          }}>
          Get Your Dream<br />
          <span style={{
            background: 'linear-gradient(135deg, #4ade80, #86efac)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Pet Instantly</span>
        </h1>

        <p
          className="text-gray-400 text-lg md:text-xl mb-10 max-w-lg leading-relaxed"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.7s ease 0.2s'
          }}>
          Skip hours of trading. Browse rare Adopt Me pets and Roblox items — delivered fast, every time.
        </p>

        <div
          className="flex gap-4 mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.7s ease 0.3s'
          }}>
          <a href="/shop"
            className="px-8 py-3 rounded-lg font-bold text-black transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', boxShadow: '0 0 20px rgba(74,222,128,0.3)' }}>
            Browse Shop
          </a>
          <a href="/about"
            className="px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
            style={{ border: '1px solid rgba(74,222,128,0.4)', color: '#86efac', background: 'rgba(74,222,128,0.05)' }}>
            Learn More
          </a>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full mb-24">
          {[
            { icon: '🐾', title: 'Adopt Me Pets', desc: 'Legendary, neon, and mega neon pets at great prices' },
            { icon: '⚡', title: 'Fast Delivery', desc: 'Quick and safe delivery every single time' },
          ].map((card, i) => (
            <div key={i}
              className="rounded-2xl p-8 text-center transition-all hover:scale-105 cursor-default"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(74,222,128,0.1)',
                backdropFilter: 'blur(10px)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.7s ease ${0.4 + i * 0.1}s`
              }}>
              <div className="text-4xl mb-4">{card.icon}</div>
              <h3 className="text-white font-bold text-xl mb-2">{card.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl mb-24 pt-12"
          style={{ borderTop: '1px solid rgba(74,222,128,0.1)' }}>
          {[
            { value: 'Many', label: 'Items Available' },
            { value: 'Fast', label: 'Delivery' },
            { value: '24/7', label: 'Support' },
            { value: '100%', label: 'Safe & Secure' },
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

        {/* Reviews */}
        <div className="w-full max-w-4xl">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">What People Say</h2>
            <p className="text-gray-500">Real reviews from real customers 🌿</p>
          </div>

          {reviews.length === 0 ? (
            <p className="text-gray-600 mb-10">No reviews yet — be the first!</p>
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
              <a href="/reviews"
                className="inline-block mb-10 px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
                style={{ border: '1px solid rgba(74,222,128,0.3)', color: '#86efac', background: 'rgba(74,222,128,0.05)' }}>
                See All Reviews
              </a>
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
                    className="w-full text-white rounded-lg px-4 py-3 outline-none transition"
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
                    className="w-full text-white rounded-lg px-4 py-3 outline-none transition resize-none"
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
        </div>
      </div>
    </div>
  )
}

export default Home