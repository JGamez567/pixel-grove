import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

const STATUS_STYLES = {
  pending:    { label: 'Pending',          color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)'  },
  processing: { label: 'Processing',       color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',   border: 'rgba(96,165,250,0.25)'  },
  delivering: { label: 'Out for Delivery', color: '#c084fc', bg: 'rgba(192,132,252,0.1)',  border: 'rgba(192,132,252,0.25)' },
  delivered:  { label: 'Delivered ✓',      color: '#4ade80', bg: 'rgba(74,222,128,0.1)',   border: 'rgba(74,222,128,0.25)'  },
  delayed:    { label: 'Delayed',          color: '#fb923c', bg: 'rgba(251,146,60,0.1)',   border: 'rgba(251,146,60,0.25)'  },
}

const STATUS_FLOW = ['pending', 'delayed', 'processing', 'delivering', 'delivered']

export default function AdminPanel() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('pg_admin') === 'true')
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState(null)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (authed) fetchOrders()
  }, [authed])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function fetchOrders() {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setOrders(data)
    setLoading(false)
  }

  function handleLogin(e) {
    e.preventDefault()
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem('pg_admin', 'true')
      setAuthed(true)
      setPasswordError('')
    } else {
      setPasswordError('Incorrect password')
      setPasswordInput('')
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('pg_admin')
    setAuthed(false)
  }

  async function updateStatus(orderId, newStatus) {
    setUpdating(orderId)
    try {
      const res = await fetch('https://pixel-grove-production.up.railway.app/update-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus, adminSecret: import.meta.env.VITE_ADMIN_SECRET })
      })
      const data = await res.json()
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        showToast(`Status updated to "${STATUS_STYLES[newStatus]?.label}" — email sent!`)
      } else {
        showToast('Failed to update status', 'error')
      }
    } catch (e) {
      showToast('Network error', 'error')
    }
    setUpdating(null)
  }

  const filtered = orders.filter(o => {
  const matchesFilter = filter === 'all' || o.status === filter
  const matchesSearch = !search.trim() || 
    o.username?.toLowerCase().includes(search.toLowerCase()) ||
    o.email?.toLowerCase().includes(search.toLowerCase())
  return matchesFilter && matchesSearch
})
  const counts = STATUS_FLOW.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length
    return acc
  }, {})

  // ── Login screen ──
  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#050c05', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '400px', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 65%)' }} />
      <div style={{ width: '100%', maxWidth: '380px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/PGLOGO1.png" alt="PixelGrove" style={{ height: '44px', marginBottom: '10px' }} />
          <p style={{ color: 'rgba(134,239,172,0.5)', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' }}>Admin Panel</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.12)', borderRadius: '20px', padding: '28px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)' }} />
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '7px', letterSpacing: '0.5px' }}>Admin Password</label>
              <input type="password" placeholder="Enter password..." value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)} autoFocus
                style={{ width: '100%', padding: '12px 16px', borderRadius: '11px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${passwordError ? 'rgba(239,68,68,0.4)' : 'rgba(74,222,128,0.18)'}`, color: '#f0faf0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              {passwordError && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '6px' }}>{passwordError}</p>}
            </div>
            <button type="submit" style={{ padding: '13px', borderRadius: '11px', background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#000', fontWeight: 700, fontSize: '14px', cursor: 'pointer', border: 'none', boxShadow: '0 0 20px rgba(74,222,128,0.2)' }}>
              Enter Admin Panel
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  // ── Admin dashboard ──
  return (
    <div style={{ minHeight: '100vh', background: '#050c05', fontFamily: 'system-ui, sans-serif', paddingBottom: '60px' }}>
      <div style={{ position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 65%)', zIndex: 0 }} />

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 999,
          padding: '12px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 600,
          background: toast.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(74,222,128,0.15)',
          border: toast.type === 'error' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(74,222,128,0.3)',
          color: toast.type === 'error' ? '#f87171' : '#4ade80',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'slideIn 0.3s ease',
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '60px 24px 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <p style={{ color: 'rgba(74,222,128,0.5)', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>PixelGrove</p>
            <h1 style={{ color: '#f0faf0', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Admin Panel</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button onClick={fetchOrders} style={{ padding: '9px 16px', borderRadius: '10px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              🔄 Refresh
            </button>
            <button onClick={handleLogout} style={{ padding: '9px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px', marginBottom: '28px' }}>
          {STATUS_FLOW.map(s => {
            const st = STATUS_STYLES[s]
            return (
              <div key={s} style={{ padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${st.border}`, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', opacity: filter === s || filter === 'all' ? 1 : 0.4 }}
                onClick={() => setFilter(filter === s ? 'all' : s)}>
                <div style={{ fontSize: '22px', fontWeight: 900, color: st.color }}>{counts[s] || 0}</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '3px' }}>{st.label}</div>
              </div>
            )
          })}
        </div>
{/* Search bar */}
<div style={{ marginBottom: '16px' }}>
  <input
    type="text"
    placeholder="Search by username or email..."
    value={search}
    onChange={e => setSearch(e.target.value)}
    style={{
      width: '100%', padding: '11px 16px', borderRadius: '12px',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(74,222,128,0.15)',
      color: '#f0faf0', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    }}
  />
</div>
        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button onClick={() => setFilter('all')}
            style={{ padding: '7px 14px', borderRadius: '9px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.2s', background: filter === 'all' ? 'linear-gradient(135deg, #4ade80, #22c55e)' : 'rgba(255,255,255,0.04)', color: filter === 'all' ? '#000' : '#6b7280' }}>
            All ({orders.length})
          </button>
          {STATUS_FLOW.map(s => {
            const st = STATUS_STYLES[s]
            return (
              <button key={s} onClick={() => setFilter(s)}
                style={{ padding: '7px 14px', borderRadius: '9px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', border: `1px solid ${filter === s ? st.border : 'transparent'}`, background: filter === s ? st.bg : 'rgba(255,255,255,0.03)', color: filter === s ? st.color : '#6b7280' }}>
                {st.label} ({counts[s] || 0})
              </button>
            )
          })}
        </div>

        {/* Orders list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#4ade80', fontSize: '13px', fontWeight: 700, letterSpacing: '2px' }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)', borderRadius: '20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📦</div>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>No orders found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(order => {
              const st = STATUS_STYLES[order.status] || STATUS_STYLES.pending
              const isUpdating = updating === order.id
              return (
                <div key={order.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)', borderRadius: '18px', padding: '20px', position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.08)'}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${st.color}50, transparent)` }} />

                  {/* Order header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <p style={{ color: '#6b7280', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '3px' }}>
                        Order #{String(order.id).slice(0, 8).toUpperCase()}
                      </p>
                      <p style={{ color: '#9ca3af', fontSize: '12px' }}>
                        {new Date(order.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                      {st.label}
                    </span>
                  </div>

                  {/* Order details */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '10px 12px' }}>
                      <p style={{ color: '#6b7280', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Roblox Username</p>
                      <p style={{ color: '#f0faf0', fontWeight: 700, fontSize: '14px' }}>{order.username}</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '10px 12px' }}>
                      <p style={{ color: '#6b7280', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Email</p>
                      <p style={{ color: '#9ca3af', fontSize: '13px' }}>{order.email || 'Guest'}</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '10px 12px' }}>
                      <p style={{ color: '#6b7280', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Total</p>
                      <p style={{ color: '#4ade80', fontWeight: 800, fontSize: '16px' }}>${order.total?.toFixed(2)}</p>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '10px 12px', marginBottom: '16px' }}>
                    <p style={{ color: '#6b7280', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Items</p>
                    <p style={{ color: '#f0faf0', fontSize: '13px', lineHeight: '1.6' }}>{order.items}</p>
                  </div>

                  {/* Status buttons */}
                  <div>
                    <p style={{ color: '#6b7280', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Update Status</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {STATUS_FLOW.filter(s => s !== order.status).map(s => {
                        const btnStyle = STATUS_STYLES[s]
                        return (
                          <button key={s} onClick={() => updateStatus(order.id, s)} disabled={isUpdating}
                            style={{
                              padding: '7px 14px', borderRadius: '9px', fontSize: '12px', fontWeight: 700,
                              cursor: isUpdating ? 'not-allowed' : 'pointer',
                              background: btnStyle.bg, color: btnStyle.color,
                              border: `1px solid ${btnStyle.border}`,
                              opacity: isUpdating ? 0.5 : 1,
                              transition: 'all 0.2s',
                            }}>
                            {isUpdating ? '...' : `→ ${btnStyle.label}`}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}