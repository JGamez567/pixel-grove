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
      const response = await fetch('http://localhost:4000/create-checkout-session', {
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
      <div className="flex flex-col items-center justify-center text-center py-32">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-white text-3xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-8">Go add some items from the shop!</p>
        <Link to="/shop" className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3 rounded-lg transition">
          Browse Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="px-8 py-16 max-w-3xl mx-auto">
      <h1 className="text-5xl font-bold text-white mb-12">Your Cart</h1>
      <div className="flex flex-col gap-4">
        {cart.map(item => (
          <div key={`${item.id}-${item.variant}`} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{item.emoji}</span>
              <div>
                <h3 className="text-white font-bold text-lg">{item.name}</h3>
                <p className="text-gray-400 text-sm">{item.variant} • Qty: {item.quantity}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-green-400 font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</span>
              <button
                onClick={() => removeFromCart(item.id, item.variant)}
                className="text-red-400 hover:text-red-300 font-bold transition">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 flex justify-between items-center">
        <span className="text-white text-2xl font-bold">Total</span>
        <span className="text-green-400 text-3xl font-bold">${total.toFixed(2)}</span>
      </div>

      <div className="mt-8">
        <label className="text-white font-bold text-lg block mb-2">Roblox Username</label>
        <input
          type="text"
          placeholder="Enter your Roblox username..."
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 focus:border-green-500 text-white rounded-lg px-4 py-3 outline-none transition"
        />
        <p className="text-gray-500 text-sm mt-2">We need this to deliver your items in game 🌿</p>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-lg transition mt-6 text-xl">
        Proceed to Checkout
      </button>
    </div>
  )
}

export default Cart