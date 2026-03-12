import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useCart } from './CartContext'

const TYPE_STYLES = {
  Normal: { label: 'Normal', gradient: 'linear-gradient(135deg, #9ca3af, #6b7280)', glow: 'rgba(156,163,175,0.3)', color: '#e5e7eb' },
  Neon:   { label: 'Neon',   gradient: 'linear-gradient(135deg, #4ade80, #22c55e)', glow: 'rgba(74,222,128,0.4)',  color: '#4ade80' },
  Mega:   { label: 'Mega',   gradient: 'linear-gradient(135deg, #c084fc, #a855f7)', glow: 'rgba(192,132,252,0.4)', color: '#c084fc' },
}

const POTION_STYLES = {
  'No Pot':   { label: 'No Potion', color: '#9ca3af', bg: 'rgba(156,163,175,0.1)' },
  'Fly':      { label: '✈ Fly',     color: '#60a5fa', bg: 'rgba(96,165,250,0.1)'  },
  'Ride':     { label: '🔴 Ride',   color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  'Fly-Ride': { label: '✈🔴 FR',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
}

function StockBar({ stock }) {
  if (stock === null || stock === undefined) return null
  const pct = Math.min(100, (stock / 10) * 100)
  const color = stock <= 0 ? '#ef4444' : stock <= 2 ? '#f59e0b' : '#4ade80'
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ color: '#6b7280', fontSize: '12px', fontWeight: 600 }}>Stock</span>
        <span style={{ color, fontSize: '12px', fontWeight: 700 }}>
          {stock <= 0 ? 'Sold Out' : stock === 1 ? '⚠ Only 1 left!' : `${stock} available`}
        </span>
      </div>
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '99px', transition: 'width 0.5s ease' }} />
      </div>
    </div>
  )
}

function ItemDetail() {
  const { name } = useParams()
  const navigate = useNavigate()
  const { addToCart, cart, setDrawerOpen } = useCart()
  const [combos, setCombos] = useState([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [selectedPotion, setSelectedPotion] = useState(null)
  const [added, setAdded] = useState(false)

  const decodedName = decodeURIComponent(name)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('items').select('*').eq('name', decodedName)
      if (data && data.length > 0) {
        setCombos(data)
        const best = [...data].sort((a, b) => (b.stock || 0) - (a.stock || 0))[0]
        setSelectedType(best.type)
        setSelectedPotion(best.potion)
      }
      setLoading(false)
      setTimeout(() => setVisible(true), 50)
    }
    fetch()
  }, [decodedName])

  const availableTypes = [...new Set(combos.map(c => c.type))]
  const availablePotions = [...new Set(combos.map(c => c.potion))]
  const isRobloxItem = combos[0]?.category === 'Roblox Item' || combos[0]?.category === 'Egg'

  const currentCombo = combos.find(c => c.type === selectedType && c.potion === selectedPotion)
    || combos.find(c => c.type === selectedType)
    || combos[0]

  const soldOut = !currentCombo || (currentCombo.stock !== null && currentCombo.stock <= 0)
  const cartItem = cart.find(c => c.id === currentCombo?.id)
  const cartQty = cartItem ? cartItem.quantity : 0
  const canAdd = currentCombo && currentCombo.stock > cartQty

  function handleTypeSelect(type) {
    setSelectedType(type)
    const match = combos.find(c => c.type === type && c.potion === selectedPotion)
    if (!match) {
      const best = [...combos.filter(c => c.type === type)].sort((a, b) => (b.stock || 0) - (a.stock || 0))[0]
      if (best) setSelectedPotion(best.potion)
    }
  }

  function handleAddToCart() {
    if (!canAdd) return
    addToCart(currentCombo, `${currentCombo.type} ${currentCombo.potion}`, currentCombo.price)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const typeStyle = TYPE_STYLES[selectedType] || TYPE_STYLES.Normal

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#030706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌿</div>
        <p style={{ color: '#4ade80', fontWeight: 700, letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase' }}>Loading...</p>
      </div>
    </div>
  )

  if (!currentCombo) return (
    <div style={{ minHeight: '100vh', background: '#030706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>Item not found</p>
        <button onClick={() => navigate('/shop')} style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#000', fontWeight: 700, padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Back to Shop</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#030706', position: 'relative', overflow: 'hidden' }}>

      {/* Glow background based on type */}
      <div style={{
        position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '600px', borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(circle, ${typeStyle.glow} 0%, transparent 70%)`,
        transition: 'background 0.5s ease',
      }} />

      <div style={{
        position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto',
        padding: '80px 24px 60px',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)',
        transition: 'all 0.5s ease',
      }}>

        {/* Back button */}
        <button onClick={() => navigate('/shop')} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          color: '#6b7280', fontSize: '13px', fontWeight: 600, background: 'none',
          border: 'none', cursor: 'pointer', marginBottom: '32px', padding: 0,
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#4ade80'}
          onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
        >
          ← Back to Shop
        </button>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'start' }}>

          {/* LEFT — Image */}
          <div>
            <div style={{
              borderRadius: '28px', padding: '40px',
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${typeStyle.color}20`,
              boxShadow: `0 0 60px ${typeStyle.glow}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: '320px', position: 'relative', overflow: 'hidden',
              transition: 'all 0.5s ease',
            }}>
              {/* Subtle grid pattern */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.03,
                backgroundImage: 'linear-gradient(rgba(74,222,128,1) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
              <img src={currentCombo.image_url} alt={decodedName}
                style={{ maxHeight: '260px', maxWidth: '100%', objectFit: 'contain', position: 'relative', zIndex: 1, filter: `drop-shadow(0 0 30px ${typeStyle.glow})`, transition: 'filter 0.5s ease' }} />
            </div>

            {/* All variants preview */}
            {combos.length > 1 && (
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {combos.map(c => (
                  <button key={c.id}
                    onClick={() => { setSelectedType(c.type); setSelectedPotion(c.potion) }}
                    style={{
                      padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                      cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                      background: (selectedType === c.type && selectedPotion === c.potion)
                        ? TYPE_STYLES[c.type]?.gradient || 'rgba(74,222,128,0.2)'
                        : 'rgba(255,255,255,0.04)',
                      color: (selectedType === c.type && selectedPotion === c.potion) ? '#000' : '#9ca3af',
                    }}>
                    {c.type} {c.potion !== 'No Pot' ? `· ${c.potion}` : ''}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Name + category */}
            <div>
              <p style={{ color: 'rgba(74,222,128,0.5)', fontSize: '11px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
                {currentCombo.category}
              </p>
              <h1 style={{ color: '#fff', fontSize: '40px', fontWeight: 900, lineHeight: 1.1, margin: 0, marginBottom: '8px' }}>
                {decodedName}
              </h1>
              {selectedType && (
                <span style={{
                  display: 'inline-block', padding: '4px 14px', borderRadius: '999px',
                  fontSize: '12px', fontWeight: 700,
                  background: typeStyle.gradient, color: '#000',
                  boxShadow: `0 0 12px ${typeStyle.glow}`,
                }}>
                  {selectedType}
                </span>
              )}
            </div>

            {/* Description */}
            {currentCombo.description && (
              <div style={{
                padding: '18px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)',
              }}>
                <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                  {currentCombo.description}
                </p>
              </div>
            )}

            {/* Type selector */}
            {!isRobloxItem && availableTypes.length > 1 && (
              <div>
                <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Type</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['Normal', 'Neon', 'Mega'].filter(t => availableTypes.includes(t)).map(t => {
                    const ts = TYPE_STYLES[t]
                    const isActive = selectedType === t
                    return (
                      <button key={t} onClick={() => handleTypeSelect(t)}
                        style={{
                          padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '13px',
                          cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                          background: isActive ? ts.gradient : 'rgba(255,255,255,0.04)',
                          color: isActive ? '#000' : '#6b7280',
                          boxShadow: isActive ? `0 0 16px ${ts.glow}` : 'none',
                          transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        }}>
                        {t}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Potion selector */}
            {!isRobloxItem && availablePotions.length > 1 && (
              <div>
                <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Potion</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['No Pot', 'Fly', 'Ride', 'Fly-Ride'].filter(p => availablePotions.includes(p)).map(p => {
                    const ps = POTION_STYLES[p]
                    const isActive = selectedPotion === p
                    const exists = combos.find(c => c.type === selectedType && c.potion === p)
                    return (
                      <button key={p} onClick={() => exists && setSelectedPotion(p)}
                        style={{
                          padding: '10px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '12px',
                          cursor: exists ? 'pointer' : 'not-allowed', border: `1px solid ${isActive ? ps.color + '60' : 'rgba(255,255,255,0.06)'}`,
                          transition: 'all 0.2s', opacity: exists ? 1 : 0.35,
                          background: isActive ? ps.bg : 'rgba(255,255,255,0.02)',
                          color: isActive ? ps.color : '#6b7280',
                          boxShadow: isActive ? `0 0 12px ${ps.color}25` : 'none',
                        }}>
                        {ps.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Price + stock */}
            <div style={{
              padding: '20px', borderRadius: '18px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.1)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: 600 }}>Price</span>
                <span style={{
                  fontSize: '32px', fontWeight: 900,
                  background: 'linear-gradient(135deg, #4ade80, #86efac)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  {currentCombo ? `$${currentCombo.price}` : 'N/A'}
                </span>
              </div>
              <StockBar stock={currentCombo?.stock} />
            </div>

            {/* Add to cart */}
            {soldOut ? (
              <div style={{
                padding: '16px', borderRadius: '16px', textAlign: 'center',
                background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#f87171', fontWeight: 700, fontSize: '15px',
              }}>Sold Out</div>
            ) : !canAdd ? (
              <div style={{
                padding: '16px', borderRadius: '16px', textAlign: 'center',
                background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)',
                color: '#fbbf24', fontWeight: 700, fontSize: '15px',
              }}>Max in Cart</div>
            ) : (
              <button onClick={handleAddToCart}
                style={{
                  padding: '18px', borderRadius: '16px', width: '100%',
                  background: added ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #4ade80, #22c55e)',
                  color: '#000', fontWeight: 800, fontSize: '16px', cursor: 'pointer',
                  border: 'none', boxShadow: '0 0 30px rgba(74,222,128,0.3)',
                  transition: 'all 0.3s', transform: added ? 'scale(0.98)' : 'scale(1)',
                  letterSpacing: '0.5px',
                }}>
                {added ? '✓ Added to Cart!' : '+ Add to Cart'}
              </button>
            )}

            {/* Delivery note */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '14px', borderRadius: '14px',
              background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.08)',
            }}>
              <span style={{ fontSize: '20px' }}>⏰</span>
              <p style={{ color: '#6b7280', fontSize: '12px', lineHeight: '1.5', margin: 0 }}>
                Delivered personally within <strong style={{ color: '#9ca3af' }}>24 hours</strong>. Delivery window: <strong style={{ color: '#9ca3af' }}>12PM – 2AM CST</strong> daily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetail