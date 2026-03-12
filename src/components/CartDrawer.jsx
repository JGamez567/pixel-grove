import { useEffect, useRef } from 'react'
import { useCart } from './CartContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function CartDrawer() {
  const { cart, removeFromCart, total, drawerOpen, setDrawerOpen } = useCart()
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const drawerRef = useRef(null)
  const navigate = useNavigate()

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false)
      }
    }
    if (drawerOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [drawerOpen, setDrawerOpen])

  // Prevent body scroll when open
  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  async function handleCheckout() {
    if (!username.trim()) {
      alert('Please enter your Roblox username so we can deliver your items!')
      return
    }
    setLoading(true)
    try {
      const response = await fetch('https://pixel-grove-production.up.railway.app/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, username })
      })
      const data = await response.json()
      window.location.href = data.url
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong! Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 998,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '100%', maxWidth: '420px',
          zIndex: 999,
          background: '#080d08',
          borderLeft: '1px solid rgba(74,222,128,0.15)',
          boxShadow: drawerOpen ? '-20px 0 60px rgba(0,0,0,0.5)' : 'none',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}>

        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(74,222,128,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, background: '#080d08', zIndex: 10,
        }}>
          <div>
            <p style={{ color: 'rgba(74,222,128,0.5)', fontSize: '10px', fontWeight: 900, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '2px' }}>
              PixelGrove
            </p>
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '22px', margin: 0 }}>
              Your Cart
              {cart.length > 0 && (
                <span style={{
                  marginLeft: '10px', fontSize: '13px', fontWeight: 700,
                  background: 'rgba(74,222,128,0.15)', color: '#4ade80',
                  padding: '2px 10px', borderRadius: '999px',
                  border: '1px solid rgba(74,222,128,0.25)'
                }}>
                  {cart.reduce((s, i) => s + i.quantity, 0)} item{cart.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#9ca3af', fontSize: '18px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#9ca3af' }}
          >✕</button>
        </div>

        {/* Empty state */}
        {cart.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.4 }}>🛒</div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Your cart is empty</p>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>Add some items from the shop!</p>
            <button
              onClick={() => { setDrawerOpen(false); navigate('/shop') }}
              style={{
                padding: '12px 28px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                color: '#000', fontWeight: 800, fontSize: '14px', cursor: 'pointer',
                border: 'none', boxShadow: '0 0 20px rgba(74,222,128,0.25)',
              }}>
              Browse Shop
            </button>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

            {/* Cart items */}
            <div style={{ flex: 1, padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cart.map((item, idx) => (
                <div key={`${item.id}-${item.variant}`}
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(74,222,128,0.08)',
                    borderRadius: '16px', padding: '14px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    animation: `slideIn 0.3s ease ${idx * 0.05}s both`,
                  }}>
                  <div style={{
                    width: '54px', height: '54px', borderRadius: '12px', flexShrink: 0,
                    background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                  }}>
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      : <span style={{ fontSize: '24px' }}>🐾</span>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                    <p style={{ color: 'rgba(74,222,128,0.6)', fontSize: '11px', marginBottom: '4px' }}>{item.variant} · Qty {item.quantity}</p>
                    <p style={{
                      fontWeight: 800, fontSize: '15px',
                      background: 'linear-gradient(135deg, #4ade80, #86efac)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.variant)}
                    style={{
                      width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                      color: '#f87171', fontSize: '14px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                  >✕</button>
                </div>
              ))}
            </div>

            {/* Bottom section */}
            <div style={{
              padding: '20px 24px 32px',
              borderTop: '1px solid rgba(74,222,128,0.08)',
              background: '#080d08',
              position: 'sticky', bottom: 0,
            }}>
              {/* Total */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '16px', padding: '14px 16px', borderRadius: '14px',
                background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.1)',
              }}>
                <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 600 }}>Total</span>
                <span style={{
                  fontSize: '22px', fontWeight: 800,
                  background: 'linear-gradient(135deg, #4ade80, #86efac)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>${total.toFixed(2)}</span>
              </div>

              {/* Username input */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ color: '#fff', fontWeight: 700, fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                  Roblox Username
                </label>
                <input
                  type="text"
                  placeholder="Enter your Roblox username..."
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(74,222,128,0.2)',
                    color: '#fff', fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{ color: 'rgba(74,222,128,0.45)', fontSize: '11px', marginTop: '6px' }}>
                  We need this to deliver your items in game 🌿
                </p>
              </div>

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                style={{
                  width: '100%', padding: '15px', borderRadius: '14px',
                  background: loading ? 'rgba(74,222,128,0.3)' : 'linear-gradient(135deg, #4ade80, #22c55e)',
                  color: '#000', fontWeight: 800, fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
                  border: 'none', boxShadow: loading ? 'none' : '0 0 25px rgba(74,222,128,0.3)',
                  transition: 'all 0.2s', letterSpacing: '0.5px',
                }}>
                {loading ? 'Redirecting...' : '🔒 Checkout Securely'}
              </button>

              <p style={{ color: '#374151', fontSize: '11px', textAlign: 'center', marginTop: '10px' }}>
                Powered by Stripe · Secure payment
              </p>
            </div>
          </div>
        )}

        <style>{`
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    </>
  )
}

export default CartDrawer