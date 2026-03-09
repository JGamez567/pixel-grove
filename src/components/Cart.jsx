import { useState } from 'react'
import { useCart } from './CartContext'
import { Link } from 'react-router-dom'

function Cart() {
  const { cart, removeFromCart, total } = useCart()
  const [username, setUsername] = useState('')

  async function handleCheckout() {
    if (!username.trim()) {
      alert('Please enter your Roblox username so we can deliver your items!')
      return
    }
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
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.04) 0%, transparent 60%)', zIndex: 0 }} />
        <div className="relative" style={{ zIndex: 1 }}>
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="text-white text-3xl font-bold mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Go add some items from the shop!</p>
          <Link to="/shop"
            className="inline-block text-black font-bold px-8 py-3 rounded-xl transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', boxShadow: '0 0 20px rgba(74,222,128,0.3)' }}>
            Browse Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.04) 0%, transparent 60%)', zIndex: 0 }} />

      <div className="relative px-4 md:px-8 py-16 max-w-3xl mx-auto" style={{ zIndex: 1 }}>
        <div className="mb-2 text-xs font-bold tracking-widest uppercase"
          style={{ color: 'rgba(74,222,128,0.6)' }}>🌿 PixelGrove</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10">Your <span style={{
          background: 'linear-gradient(135deg, #4ade80, #86efac)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Cart</span></h1>

        <div className="flex flex-col gap-3 mb-8">
          {cart.map(item => (
            <div key={`${item.id}-${item.variant}`}
              className="rounded-2xl p-5 flex justify-between items-center transition-all"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.08)' }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(74,222,128,0.08)' }}>
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} className="w-full h-full object-contain rounded-xl" />
                    : '🐾'}
                </div>
                <div>
                  <h3 className="text-white font-bold">{item.name}</h3>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(74,222,128,0.6)' }}>
                    {item.variant} • Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg"
                  style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(item.id, item.variant)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="rounded-2xl p-6 mb-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.1)' }}>
          <div className="flex justify-between items-center">
            <span className="text-white font-bold text-xl">Total</span>
            <span className="text-3xl font-bold"
              style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Username */}
        <div className="rounded-2xl p-6 mb-6"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.1)' }}>
          <label className="text-white font-bold block mb-2">Roblox Username</label>
          <input
            type="text"
            placeholder="Enter your Roblox username..."
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full text-white rounded-xl px-4 py-3 outline-none transition"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(74,222,128,0.2)' }}
          />
          <p className="text-xs mt-2" style={{ color: 'rgba(74,222,128,0.5)' }}>
            We need this to deliver your items in game 🌿
          </p>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full text-black font-bold py-4 rounded-xl transition-all hover:scale-105 text-lg"
          style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', boxShadow: '0 0 25px rgba(74,222,128,0.3)' }}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}

export default Cart