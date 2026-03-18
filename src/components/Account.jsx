import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabase'

const STATUS_STYLES = {
  pending:     { label: 'Pending',          color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)'  },
  processing:  { label: 'Processing',       color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.25)'  },
  delivering:  { label: 'Out for Delivery', color: '#c084fc', bg: 'rgba(192,132,252,0.1)',  border: 'rgba(192,132,252,0.25)' },
  delivered:   { label: 'Delivered ✓',      color: '#4ade80', bg: 'rgba(74,222,128,0.1)',   border: 'rgba(74,222,128,0.25)'  },
  delayed:     { label: 'Delayed',          color: '#fb923c', bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.25)'  },
}

export default function Account() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [tab, setTab] = useState('orders')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { navigate('/login'); return }
      setUser(user)

      // Fetch orders by email
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false })
      if (ordersData) setOrders(ordersData)

      // Fetch wishlist then manually fetch each item
      const { data: wishlistData } = await supabase
        .from('wishlist')
        .select('*')
        .eq('user_id', user.id)

      if (wishlistData && wishlistData.length > 0) {
        const itemIds = wishlistData.map(w => w.item_id)
        const { data: itemsData } = await supabase
          .from('items')
          .select('*')
          .in('id', itemIds)
        const itemsMap = {}
        itemsData?.forEach(item => { itemsMap[item.id] = item })
        setWishlist(wishlistData.map(w => ({ ...w, items: itemsMap[w.item_id] || null })))
      } else {
        setWishlist([])
      }

      setLoading(false)
    }
    load()
  }, [navigate])

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  async function removeFromWishlist(id) {
    await supabase.from('wishlist').delete().eq('id', id)
    setWishlist(prev => prev.filter(w => w.id !== id))
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050c05', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌿</div>
        <p style={{ color: '#4ade80', fontWeight: 700, letterSpacing: '3px', fontSize: '11px', textTransform: 'uppercase', fontFamily: 'system-ui' }}>Loading...</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#050c05', fontFamily: 'system-ui, sans-serif', paddingBottom: '60px' }}>
      <div style={{ position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 65%)', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', padding: '80px 24px 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ color: 'rgba(74,222,128,0.5)', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>My Account</p>
            <h1 style={{ color: '#f0faf0', fontSize: 'clamp(24px,5vw,36px)', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
              {user?.user_metadata?.username || user?.email?.split('@')[0]}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>{user?.email}</p>
          </div>
          <button onClick={handleSignOut}
            style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', padding: '4px', border: '1px solid rgba(74,222,128,0.08)' }}>
          {[{ key: 'orders', label: '📦 Order History' }, { key: 'wishlist', label: '❤️ Wishlist' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: '11px', borderRadius: '11px', fontSize: '13px', fontWeight: 700,
                cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                background: tab === t.key ? 'linear-gradient(135deg, #4ade80, #22c55e)' : 'transparent',
                color: tab === t.key ? '#000' : '#6b7280',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)', borderRadius: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '14px' }}>📦</div>
                <p style={{ color: '#f0faf0', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>No orders yet</p>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>Head to the shop to grab your first pet!</p>
                <Link to="/shop" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#000', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                  Browse Shop
                </Link>
              </div>
            ) : orders.map(order => {
              const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.pending
              return (
                <div key={order.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)', borderRadius: '20px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.2), transparent)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Order #{String(order.id).slice(0, 8).toUpperCase()}
                      </p>
                      <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <span style={{ padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                      {statusStyle.label}
                    </span>
                  </div>
                  <p style={{ color: '#f0faf0', fontSize: '14px', marginBottom: '10px', lineHeight: '1.6' }}>{order.items}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>Roblox: <strong style={{ color: '#9ca3af' }}>{order.username}</strong></span>
                    <span style={{ fontWeight: 800, fontSize: '16px', background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      ${order.total?.toFixed(2)}
                    </span>
                  </div>
                  {order.status === 'delayed' && (
                    <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.2)', color: '#fb923c', fontSize: '12px' }}>
                      ⏰ Your order is outside our delivery window. We'll deliver between 12PM–2AM CST tomorrow!
                    </div>
                  )}
                  {order.status === 'delivering' && (
                    <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.2)', color: '#c084fc', fontSize: '12px' }}>
                      🎮 We're ready to trade! Please hop on Roblox and accept our trade request.
                    </div>
                  )}
                  {order.status === 'delivered' && (
                    <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80', fontSize: '12px' }}>
                      ✅ Your pet has been delivered! Enjoy your new pet 🌿
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Wishlist Tab */}
        {tab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)', borderRadius: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '14px' }}>❤️</div>
                <p style={{ color: '#f0faf0', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>No wishlist items yet</p>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>Save pets you want to buy later!</p>
                <Link to="/shop" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#000', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                  Browse Shop
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
                {wishlist.map(w => (
                  <div key={w.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)', borderRadius: '18px', padding: '16px', position: 'relative' }}>
                    <button onClick={() => removeFromWishlist(w.id)}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '8px', width: '26px', height: '26px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      ✕
                    </button>
                    <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      {w.items?.image_url
                        ? <img src={w.items.image_url} alt={w.items?.name} style={{ maxHeight: '80px', objectFit: 'contain' }} />
                        : <span style={{ fontSize: '36px' }}>🐾</span>
                      }
                    </div>
                    <p style={{ color: '#f0faf0', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{w.items?.name}</p>
                    <p style={{ color: 'rgba(74,222,128,0.5)', fontSize: '11px', marginBottom: '10px' }}>{w.items?.category}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, fontSize: '15px', background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ${w.items?.price}
                      </span>
                      <Link to={`/shop/${encodeURIComponent(w.items?.name)}`}
                        style={{ fontSize: '11px', fontWeight: 700, padding: '5px 10px', borderRadius: '8px', background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', textDecoration: 'none' }}>
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}