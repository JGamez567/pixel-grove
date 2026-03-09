import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from './CartContext'

function Navbar() {
  const { cart } = useCart()
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-gray-950 border-b border-green-500 px-8 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-green-400 text-2xl font-bold tracking-widest">
          🌳 PixelGrove
        </h1>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="text-gray-300 hover:text-green-400 transition">Home</Link>
          <Link to="/shop" className="text-gray-300 hover:text-green-400 transition">Shop</Link>
          <Link to="/about" className="text-gray-300 hover:text-green-400 transition">About</Link>
          <Link to="/reviews" className="text-gray-300 hover:text-green-400 transition">Reviews</Link>
          <Link to="/cart" className="relative text-gray-300 hover:text-green-400 transition">
            🛒 Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-green-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <a
            href="https://discord.gg/yZHbUFTh"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg transition flex items-center gap-2">
            💬 Discord
          </a>
        </div>

        {/* Mobile Right Side */}
        <div className="flex md:hidden items-center gap-4">
          <Link to="/cart" className="relative text-gray-300">
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-300 hover:text-green-400 text-2xl transition">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 pt-4 pb-2 border-t border-gray-800 mt-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-green-400 transition">Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-green-400 transition">Shop</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-green-400 transition">About</Link>
          <Link to="/reviews" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-green-400 transition">Reviews</Link>
          <a
            href="https://discord.gg/yZHbUFTh"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 w-fit">
            💬 Discord
          </a>
        </div>
      )}
    </nav>
  )
}

export default Navbar