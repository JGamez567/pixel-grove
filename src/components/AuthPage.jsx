import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      })
      if (error) setError(error.message)
      else setSuccess('Check your email to confirm your account!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else navigate('/account')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: '12px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(74,222,128,0.18)',
    color: '#f0faf0', fontSize: '14px', outline: 'none',
    fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050c05', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Glow */}
      <div style={{ position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 65%)' }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/PGLOGO1.png" alt="PixelGrove" style={{ height: '48px', marginBottom: '12px' }} />
          <p style={{ color: 'rgba(134,239,172,0.6)', fontSize: '12px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.12)', borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)' }} />

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '4px' }}>
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }}
                style={{
                  flex: 1, padding: '9px', borderRadius: '9px', fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer', border: 'none', transition: 'all 0.2s', textTransform: 'capitalize',
                  background: mode === m ? 'linear-gradient(135deg, #4ade80, #22c55e)' : 'transparent',
                  color: mode === m ? '#000' : '#6b7280',
                }}>
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'signup' && (
              <div>
                <label style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '7px', letterSpacing: '0.5px' }}>Roblox Username</label>
                <input type="text" placeholder="Your Roblox username..." value={username} onChange={e => setUsername(e.target.value)} required style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.45)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.18)'} />
              </div>
            )}
            <div>
              <label style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '7px', letterSpacing: '0.5px' }}>Email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.45)'}
                onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.18)'} />
            </div>
            <div>
              <label style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '7px', letterSpacing: '0.5px' }}>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(74,222,128,0.45)'}
                onBlur={e => e.target.style.borderColor = 'rgba(74,222,128,0.18)'} />
            </div>

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '13px' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80', fontSize: '13px' }}>
                {success}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                padding: '14px', borderRadius: '12px', marginTop: '4px',
                background: loading ? 'rgba(74,222,128,0.3)' : 'linear-gradient(135deg, #4ade80, #22c55e)',
                color: '#000', fontWeight: 700, fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none', boxShadow: loading ? 'none' : '0 0 20px rgba(74,222,128,0.25)',
                transition: 'all 0.2s',
              }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(134,239,172,0.3)', fontSize: '12px', marginTop: '20px' }}>
          Guest checkout is always available — no account required to buy!
        </p>
      </div>
    </div>
  )
}