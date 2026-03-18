import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

// ── Google Fonts injection ──
const fontLink = document.createElement('link')
fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap'
fontLink.rel = 'stylesheet'
if (!document.head.querySelector('[href*="Outfit"]')) document.head.appendChild(fontLink)

// ── Scroll reveal hook ──
function useScrollReveal() {
  const refs = useRef([])
  const add = useCallback(el => { if (el && !refs.current.includes(el)) refs.current.push(el) }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1'
          entry.target.style.transform = 'translateY(0) scale(1)'
          obs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    refs.current.forEach(el => {
      el.style.opacity = '0'
      el.style.transform = 'translateY(36px) scale(0.98)'
      el.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)'
      obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return add
}

// ── Staggered children reveal ──
function useStaggerReveal(delay = 0.1) {
  const parentRef = useRef(null)
  useEffect(() => {
    const el = parentRef.current
    if (!el) return
    const children = Array.from(el.children)
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            setTimeout(() => {
              child.style.opacity = '1'
              child.style.transform = 'translateY(0) scale(1)'
            }, i * (delay * 1000))
          })
          obs.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    children.forEach(child => {
      child.style.opacity = '0'
      child.style.transform = 'translateY(32px) scale(0.97)'
      child.style.transition = 'opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1)'
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return parentRef
}

// ── StarField ──
function StarField() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.25 + 0.05,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }))
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(star => {
        star.pulse += 0.018
        star.y -= star.speed
        if (star.y < 0) { star.y = canvas.height; star.x = Math.random() * canvas.width }
        const opacity = star.opacity * (0.55 + 0.45 * Math.sin(star.pulse))
        const grad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 2)
        grad.addColorStop(0, `rgba(134,239,172,${opacity})`)
        grad.addColorStop(1, `rgba(74,222,128,0)`)
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r * 2, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      })
      animationId = requestAnimationFrame(draw)
    }
    draw()
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', handleResize)
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', handleResize) }
  }, [])
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
}

// ── Featured Card ──
function FeaturedCard({ item }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const soldOut = item.stock !== null && item.stock <= 0
  return (
    <div
      onClick={() => navigate(`/shop/${encodeURIComponent(item.name)}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="cursor-pointer flex flex-col"
      style={{
        background: hovered ? 'rgba(74,222,128,0.05)' : 'rgba(255,255,255,0.02)',
        border: hovered ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(74,222,128,0.08)',
        borderRadius: '20px', padding: '20px',
        boxShadow: hovered ? '0 20px 60px rgba(74,222,128,0.12)' : '0 0 0 transparent',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#4ade80', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', padding: '4px 10px', borderRadius: '999px', fontFamily: 'DM Sans, sans-serif' }}>
          🔥 Featured
        </span>
        {soldOut
          ? <span style={{ color: '#f87171', fontSize: '11px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>Sold Out</span>
          : item.stock <= 3
            ? <span style={{ color: '#fb923c', fontSize: '11px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>{item.stock} left</span>
            : <span style={{ color: 'rgba(74,222,128,0.5)', fontSize: '11px', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>{item.stock} in stock</span>
        }
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '140px', marginBottom: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid rgba(74,222,128,0.06)' }}>
        {item.image_url
          ? <img src={item.image_url} alt={item.name} style={{ maxHeight: '118px', objectFit: 'contain', filter: hovered ? 'drop-shadow(0 0 18px rgba(74,222,128,0.45))' : 'none', transition: 'filter 0.35s' }} />
          : <span style={{ fontSize: '44px' }}>🐾</span>
        }
      </div>
      <h3 style={{ color: '#f0faf0', fontWeight: 700, fontSize: '15px', marginBottom: '4px', fontFamily: 'Outfit, sans-serif' }}>{item.name}</h3>
      <p style={{ color: 'rgba(74,222,128,0.5)', fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px', fontFamily: 'DM Sans, sans-serif' }}>
        {item.type !== 'Normal' ? `${item.type} · ` : ''}{item.category}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontSize: '20px', fontWeight: 800, background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Outfit, sans-serif' }}>${item.price}</span>
        <span style={{
          fontSize: '11px', fontWeight: 600, padding: '6px 14px', borderRadius: '10px',
          background: hovered ? 'linear-gradient(135deg, #4ade80, #22c55e)' : 'rgba(74,222,128,0.07)',
          color: hovered ? '#000' : '#4ade80',
          border: hovered ? 'none' : '1px solid rgba(74,222,128,0.18)',
          transition: 'all 0.25s', fontFamily: 'DM Sans, sans-serif',
        }}>View →</span>
      </div>
    </div>
  )
}

// ── Main Home ──
function Home() {
  const [reviews, setReviews] = useState([])
  const [featuredItems, setFeaturedItems] = useState([])
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [submitted, setSubmitted] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)

  const reveal = useScrollReveal()
  const featuresRef = useStaggerReveal(0.12)
  const stepsRef = useStaggerReveal(0.1)
  const reviewsRef = useStaggerReveal(0.08)
  const featuredRef = useStaggerReveal(0.07)
  const statsRef = useStaggerReveal(0.1)

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 80)
    supabase.from('reviews').select('*').eq('approved', true).order('created_at', { ascending: false }).limit(4).then(({ data }) => { if (data) setReviews(data) })
    supabase.from('items').select('*').eq('featured', true).limit(6).then(({ data }) => { if (data) setFeaturedItems(data) })
  }, [])

  async function handleSubmit() {
    if (!username.trim() || !message.trim()) { alert('Please fill in all fields!'); return }
    const { error } = await supabase.from('reviews').insert({ username, message, rating, approved: false })
    if (error) console.error(error)
    else setSubmitted(true)
  }

  const heroFade = (delay = 0) => ({
    opacity: heroVisible ? 1 : 0,
    transform: heroVisible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(74,222,128,0.18)',
    color: '#f0faf0', fontSize: '14px', outline: 'none',
    fontFamily: 'DM Sans, sans-serif', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    color: '#f0faf0', fontWeight: 600, fontSize: '13px',
    display: 'block', marginBottom: '8px',
    fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.3px',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050c05', overflowX: 'hidden', fontFamily: 'DM Sans, sans-serif' }}>
      <StarField />

      {/* Ambient glows */}
      <div style={{ position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 65%)' }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', pointerEvents: 'none', zIndex: 0, background: 'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 65%)' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ══ HERO ══ */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'clamp(100px,15vw,140px) 24px 80px' }}>

          <div style={{ ...heroFade(0), marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 18px', borderRadius: '999px', border: '1px solid rgba(74,222,128,0.25)', background: 'rgba(74,222,128,0.05)', color: 'rgba(134,239,172,0.9)', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>
            ✦ Virtual Item Store ✦
          </div>

          <h1 style={{
            ...heroFade(0.1),
            fontSize: 'clamp(44px,8.5vw,96px)',
            fontWeight: 900, lineHeight: 1.02, color: '#f0faf0',
            marginBottom: '10px', letterSpacing: '-0.5px',
            fontFamily: 'Outfit, sans-serif',
            textShadow: '0 0 80px rgba(74,222,128,0.12)',
          }}>
            Get Your Dream
          </h1>
          <h1 style={{
            ...heroFade(0.18),
            fontSize: 'clamp(44px,8.5vw,96px)',
            fontWeight: 900, lineHeight: 1.02, marginBottom: '28px', letterSpacing: '-0.5px',
            fontFamily: 'Outfit, sans-serif',
            background: 'linear-gradient(135deg, #4ade80 0%, #86efac 50%, #4ade80 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(74,222,128,0.3))',
          }}>
            Pet Instantly
          </h1>

          <p style={{ ...heroFade(0.26), color: 'rgba(180,220,180,0.65)', fontSize: 'clamp(15px,2vw,19px)', lineHeight: 1.75, maxWidth: '500px', marginBottom: '40px' }}>
            Skip hours of trading. Browse rare Adopt Me pets and Roblox items — delivered personally, every time.
          </p>

          <div style={{ ...heroFade(0.34), display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginBottom: '40px' }}>
            <Link to="/shop" style={{
              padding: '14px 36px', borderRadius: '14px', fontWeight: 700, fontSize: '16px',
              color: '#061006', textDecoration: 'none', letterSpacing: '0.3px',
              background: 'linear-gradient(135deg, #4ade80, #22c55e)',
              boxShadow: '0 0 30px rgba(74,222,128,0.35), 0 4px 20px rgba(0,0,0,0.3)',
              fontFamily: 'DM Sans, sans-serif', transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 50px rgba(74,222,128,0.5), 0 4px 20px rgba(0,0,0,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(74,222,128,0.35), 0 4px 20px rgba(0,0,0,0.3)' }}>
              🛒 Shop All Now
            </Link>
            <Link to="/how-it-works" style={{
              padding: '14px 36px', borderRadius: '14px', fontWeight: 700, fontSize: '16px',
              color: '#86efac', textDecoration: 'none',
              border: '1px solid rgba(74,222,128,0.35)', background: 'rgba(74,222,128,0.05)',
              fontFamily: 'DM Sans, sans-serif', transition: 'transform 0.2s, background 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = 'rgba(74,222,128,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(74,222,128,0.05)' }}>
              How It Works
            </Link>
          </div>

          {/* Category pills */}
          <div style={{ ...heroFade(0.42), display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {[
              { label: '🐾 Mega Pets', filter: 'Mega' },
              { label: '✨ Neon Pets', filter: 'Neon' },
              { label: '🐶 Normal Pets', filter: 'Normal' },
              { label: '🥚 Eggs', filter: 'Egg' },
              { label: '🎮 Roblox Items', filter: 'Roblox Item' },
            ].map((cat, i) => (
              <Link key={i} to={`/shop?filter=${encodeURIComponent(cat.filter)}`} style={{
                padding: '8px 18px', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
                background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.14)',
                color: 'rgba(134,239,172,0.8)', textDecoration: 'none',
                fontFamily: 'DM Sans, sans-serif', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.12)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(74,222,128,0.06)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.14)' }}>
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Scroll indicator */}
          <div style={{ ...heroFade(0.6), marginTop: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'rgba(74,222,128,0.3)', fontSize: '11px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase' }}>Scroll</span>
            <div style={{ width: '1px', height: '40px', background: 'linear-gradient(180deg, rgba(74,222,128,0.4), transparent)', animation: 'pulse 2s ease-in-out infinite' }} />
          </div>
        </section>

        {/* ══ FEATURED ══ */}
        {featuredItems.length > 0 && (
          <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>
            <div ref={reveal} style={{ textAlign: 'center', marginBottom: '48px' }}>
              <p style={{ color: 'rgba(74,222,128,0.6)', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>🔥 Hand Picked</p>
              <h2 style={{ color: '#f0faf0', fontSize: 'clamp(28px,5vw,48px)', fontWeight: 900, marginBottom: '10px', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
                Featured <span style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Items</span>
              </h2>
              <p style={{ color: 'rgba(180,220,180,0.5)', fontSize: '15px' }}>Our most popular picks — grab them before they're gone</p>
            </div>
            <div ref={featuredRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {featuredItems.map(item => <FeaturedCard key={item.id} item={item} />)}
            </div>
            <div ref={reveal} style={{ textAlign: 'center' }}>
              <Link to="/shop" style={{
                display: 'inline-block', padding: '12px 32px', borderRadius: '12px',
                border: '1px solid rgba(74,222,128,0.25)', color: '#86efac',
                fontWeight: 600, fontSize: '14px', textDecoration: 'none',
                background: 'rgba(74,222,128,0.04)', fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.2s',
              }}>
                View All Items →
              </Link>
            </div>
          </section>
        )}

        {/* ══ FEATURES ══ */}
        <section style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto', borderTop: '1px solid rgba(74,222,128,0.07)' }}>
          <div ref={reveal} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ color: '#f0faf0', fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px' }}>
              Why <span style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PixelGrove?</span>
            </h2>
          </div>
          <div ref={featuresRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🤝', title: 'Personal Trading', desc: 'We personally trade every order — no bots, just real people delivering your items.' },
              { icon: '⏰', title: 'Within 24 Hours', desc: 'Delivery daily from 12PM to 2AM CST. Orders outside this window fulfilled next window.' },
              { icon: '🔒', title: 'Safe & Secure', desc: 'Stripe-powered secure checkout. Your payment details are always protected.' },
            ].map((card, i) => (
              <div key={i}
                style={{ borderRadius: '20px', padding: '28px 24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)', position: 'relative', overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(74,222,128,0.1)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.25)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.08)' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.3), transparent)' }} />
                <div style={{ fontSize: '38px', marginBottom: '16px' }}>{card.icon}</div>
                <h3 style={{ color: '#f0faf0', fontWeight: 700, fontSize: '17px', marginBottom: '10px', fontFamily: 'Outfit, sans-serif' }}>{card.title}</h3>
                <p style={{ color: 'rgba(180,220,180,0.55)', fontSize: '14px', lineHeight: '1.7' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ STATS ══ */}
        <section style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto', borderTop: '1px solid rgba(74,222,128,0.07)' }}>
          <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            {[
              { value: '24hr', label: 'Delivery Guarantee' },
              { value: 'Fast', label: 'Personal Delivery' },
              { value: '100%', label: 'Secure Payments' },
              { value: '🌿', label: 'PixelGrove' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.07)', borderRadius: '20px', transition: 'transform 0.3s, border-color 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.07)' }}>
                <div style={{ fontSize: 'clamp(30px,5vw,44px)', fontWeight: 900, marginBottom: '8px', background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Outfit, sans-serif' }}>
                  {stat.value}
                </div>
                <p style={{ color: 'rgba(134,239,172,0.4)', fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ HOW IT WORKS ══ */}
        <section style={{ padding: '80px 24px', maxWidth: '900px', margin: '0 auto', textAlign: 'center', borderTop: '1px solid rgba(74,222,128,0.07)' }}>
          <div ref={reveal} style={{ marginBottom: '48px' }}>
            <p style={{ color: 'rgba(74,222,128,0.6)', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>Simple process</p>
            <h2 style={{ color: '#f0faf0', fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px', marginBottom: '10px' }}>
              How It <span style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Works</span>
            </h2>
            <p style={{ color: 'rgba(180,220,180,0.5)', fontSize: '15px' }}>Four steps to get your dream pet 🌿</p>
          </div>
          <div ref={stepsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '36px' }}>
            {[
              { icon: '🛒', step: '01', title: 'Add to Cart', desc: 'Pick your pet and add it to your cart' },
              { icon: '👤', step: '02', title: 'Enter Username', desc: 'Tell us your Roblox username at checkout' },
              { icon: '💳', step: '03', title: 'Pay Securely', desc: 'Checkout safely via Stripe' },
              { icon: '🎮', step: '04', title: 'We Deliver!', desc: 'We trade your item in game personally' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '24px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)', borderRadius: '20px', textAlign: 'left', position: 'relative', overflow: 'hidden', transition: 'transform 0.3s, border-color 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.25)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(74,222,128,0.08)' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-10px', fontSize: '64px', opacity: 0.04, fontFamily: 'Outfit, sans-serif', fontWeight: 900 }}>{s.step}</div>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{s.icon}</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(74,222,128,0.5)', letterSpacing: '2px', marginBottom: '6px', textTransform: 'uppercase' }}>Step {s.step}</div>
                <p style={{ color: '#f0faf0', fontSize: '15px', fontWeight: 700, marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>{s.title}</p>
                <p style={{ color: 'rgba(180,220,180,0.5)', fontSize: '13px', lineHeight: '1.5' }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div ref={reveal}>
            <Link to="/how-it-works" style={{
              display: 'inline-block', padding: '12px 30px', borderRadius: '12px',
              border: '1px solid rgba(74,222,128,0.25)', color: '#86efac',
              fontWeight: 600, fontSize: '14px', textDecoration: 'none',
              background: 'rgba(74,222,128,0.04)', fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s',
            }}>
              Learn More →
            </Link>
          </div>
        </section>

        {/* ══ REVIEWS ══ */}
        <section style={{ padding: '80px 24px', maxWidth: '900px', margin: '0 auto', borderTop: '1px solid rgba(74,222,128,0.07)' }}>
          <div ref={reveal} style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p style={{ color: 'rgba(74,222,128,0.6)', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>Testimonials</p>
            <h2 style={{ color: '#f0faf0', fontSize: 'clamp(26px,4vw,42px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px', marginBottom: '10px' }}>
              What People <span style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Say</span>
            </h2>
            <p style={{ color: 'rgba(180,220,180,0.5)', fontSize: '15px' }}>Real reviews from real customers 🌿</p>
          </div>

          {reviews.length === 0 ? (
            <p ref={reveal} style={{ color: 'rgba(180,220,180,0.3)', textAlign: 'center', marginBottom: '40px', fontStyle: 'italic' }}>No reviews yet — be the first!</p>
          ) : (
            <>
              <div ref={reviewsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {reviews.map(review => (
                  <div key={review.id} style={{ padding: '22px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)', borderRadius: '20px', position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.22)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.08)'}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.2), transparent)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ color: '#f0faf0', fontWeight: 700, fontSize: '15px', fontFamily: 'Outfit, sans-serif' }}>{review.username}</h3>
                      <span style={{ color: '#fbbf24', fontSize: '13px' }}>{'⭐'.repeat(review.rating)}</span>
                    </div>
                    <p style={{ color: 'rgba(180,220,180,0.6)', fontSize: '14px', lineHeight: '1.7' }}>"{review.message}"</p>
                  </div>
                ))}
              </div>
              <div ref={reveal} style={{ textAlign: 'center', marginBottom: '40px' }}>
                <Link to="/reviews" style={{ display: 'inline-block', padding: '12px 30px', borderRadius: '12px', border: '1px solid rgba(74,222,128,0.25)', color: '#86efac', fontWeight: 600, fontSize: '14px', textDecoration: 'none', background: 'rgba(74,222,128,0.04)', fontFamily: 'DM Sans, sans-serif' }}>
                  See All Reviews
                </Link>
              </div>
            </>
          )}

          {/* Review form */}
          <div ref={reveal} style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.1)', borderRadius: '24px', maxWidth: '520px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.35), transparent)' }} />
            <h3 style={{ color: '#f0faf0', fontWeight: 800, fontSize: '20px', marginBottom: '24px', fontFamily: 'Outfit, sans-serif' }}>Leave a Review</h3>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '44px', marginBottom: '14px' }}>🎉</div>
                <p style={{ color: '#4ade80', fontWeight: 700, fontSize: '16px', fontFamily: 'Outfit, sans-serif' }}>Thanks for your review!</p>
                <p style={{ color: 'rgba(180,220,180,0.5)', fontSize: '13px', marginTop: '6px' }}>It will show up once approved.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Roblox Username</label>
                  <input type="text" placeholder="Your Roblox username..." value={username} onChange={e => setUsername(e.target.value)} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.18)'} />
                </div>
                <div>
                  <label style={labelStyle}>Rating</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1,2,3,4,5].map(star => (
                      <button key={star} onClick={() => setRating(star)} style={{ fontSize: '24px', background: 'none', border: 'none', cursor: 'pointer', opacity: star <= rating ? 1 : 0.22, transition: 'opacity 0.2s, transform 0.2s', transform: star <= rating ? 'scale(1.1)' : 'scale(1)' }}>⭐</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Review</label>
                  <textarea placeholder="Tell us about your experience..." value={message} onChange={e => setMessage(e.target.value)} rows={3}
                    style={{ ...inputStyle, resize: 'none' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.18)'} />
                </div>
                <button onClick={handleSubmit}
                  style={{ padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#061006', fontWeight: 700, fontSize: '15px', cursor: 'pointer', border: 'none', boxShadow: '0 0 20px rgba(74,222,128,0.25)', fontFamily: 'DM Sans, sans-serif', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 35px rgba(74,222,128,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(74,222,128,0.25)' }}>
                  Submit Review
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ══ SOCIALS CTA ══ */}
        <section style={{ padding: '80px 24px', maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div ref={reveal} style={{ padding: '56px 40px', background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.1)', borderRadius: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <div style={{ fontSize: '52px', marginBottom: '18px' }}>🌿</div>
            <h2 style={{ color: '#f0faf0', fontSize: 'clamp(22px,4vw,34px)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.5px', marginBottom: '12px' }}>
              Join Our <span style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Community</span>
            </h2>
            <p style={{ color: 'rgba(180,220,180,0.55)', marginBottom: '30px', fontSize: '15px', lineHeight: '1.7' }}>
              Follow us on TikTok and join our Discord for restocks, giveaways, and order updates!
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://discord.gg/yZHbUFTh" target="_blank" rel="noopener noreferrer"
                style={{ padding: '13px 28px', borderRadius: '14px', background: 'linear-gradient(135deg, #818cf8, #6366f1)', color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none', boxShadow: '0 0 25px rgba(99,102,241,0.3)', fontFamily: 'DM Sans, sans-serif', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                💬 Join Discord
              </a>
              <Link to="/socials"
                style={{ padding: '13px 28px', borderRadius: '14px', border: '1px solid rgba(74,222,128,0.3)', color: '#86efac', fontWeight: 700, fontSize: '14px', textDecoration: 'none', background: 'rgba(74,222,128,0.05)', fontFamily: 'DM Sans, sans-serif', transition: 'transform 0.2s, background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = 'rgba(74,222,128,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(74,222,128,0.05)' }}>
                All Socials →
              </Link>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer style={{ borderTop: '1px solid rgba(74,222,128,0.07)', background: 'rgba(0,0,0,0.4)' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px 40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '32px', marginBottom: '40px' }}>
              <div>
                <h3 style={{ color: '#4ade80', fontSize: '18px', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '12px', fontFamily: 'Outfit, sans-serif' }}>🌳 PixelGrove</h3>
                <p style={{ color: 'rgba(180,220,180,0.4)', fontSize: '13px', lineHeight: '1.7' }}>Your trusted Roblox & Adopt Me item store. Fast, safe, and personal delivery every time.</p>
              </div>
              <div>
                <h4 style={{ color: '#f0faf0', fontWeight: 700, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Shop</h4>
                {[['All Items', '/shop'], ['Mega Pets', '/shop?filter=Mega'], ['Neon Pets', '/shop?filter=Neon'], ['Normal Pets', '/shop?filter=Normal'], ['Eggs', '/shop?filter=Egg'], ['Roblox Items', '/shop?filter=Roblox Item']].map(([label, to]) => (
                  <Link key={to} to={to} style={{ display: 'block', color: 'rgba(180,220,180,0.4)', fontSize: '13px', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(180,220,180,0.4)'}>{label}</Link>
                ))}
              </div>
              <div>
                <h4 style={{ color: '#f0faf0', fontWeight: 700, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Help</h4>
                {[['How It Works', '/how-it-works'], ['Reviews', '/reviews'], ['About Us', '/about']].map(([label, to]) => (
                  <Link key={to} to={to} style={{ display: 'block', color: 'rgba(180,220,180,0.4)', fontSize: '13px', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(180,220,180,0.4)'}>{label}</Link>
                ))}
                <a href="https://discord.gg/yZHbUFTh" target="_blank" rel="noopener noreferrer" style={{ display: 'block', color: 'rgba(180,220,180,0.4)', fontSize: '13px', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(180,220,180,0.4)'}>Contact Us</a>
              </div>
              <div>
                <h4 style={{ color: '#f0faf0', fontWeight: 700, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '16px' }}>Legal</h4>
                {[['Privacy Policy', '/privacy-policy'], ['Terms of Service', '/terms-of-service'], ['Refund Policy', '/refund-policy']].map(([label, to]) => (
                  <Link key={to} to={to} style={{ display: 'block', color: 'rgba(180,220,180,0.4)', fontSize: '13px', textDecoration: 'none', marginBottom: '8px', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(180,220,180,0.4)'}>{label}</Link>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', borderTop: '1px solid rgba(74,222,128,0.06)', gap: '12px' }}>
              <p style={{ color: 'rgba(180,220,180,0.25)', fontSize: '12px' }}>© 2025 ThePixelGrove. Not affiliated with Roblox or Uplift Games.</p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <a href="https://discord.gg/yZHbUFTh" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(180,220,180,0.3)', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(180,220,180,0.3)'}>💬 Discord</a>
                <a href="https://www.tiktok.com/@thepixelgrove" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(180,220,180,0.3)', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f472b6'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(180,220,180,0.3)'}>🎵 TikTok</a>
              </div>
            </div>
          </div>
        </footer>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.15); }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  )
}

export default Home