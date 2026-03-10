import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from './CartContext'

const shopCategories = [
  { label: '🟣 Mega Pets', filter: 'Mega' },
  { label: '🟢 Neon Pets', filter: 'Neon' },
  { label: '⚪ Normal Pets', filter: 'Normal' },
  { label: '🥚 Eggs', filter: 'Egg' },
  { label: '🎮 Roblox Items', filter: 'Roblox Item' },
]

function Navbar() {
  const { cart } = useCart()
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShopOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function goToShop(filter) {
    setShopOpen(false)
    setMenuOpen(false)
    navigate(`/shop?filter=${encodeURIComponent(filter)}`)
  }

  return (
    <nav className="bg-gray-950 border-b border-green-500 px-6 py-4 relative" style={{ zIndex: 100 }}>
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-green-400 text-2xl font-bold tracking-widest">
          🌳 PixelGrove
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-gray-300 hover:text-green-400 transition text-sm font-medium">Home</Link>

          {/* Shop Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShopOpen(!shopOpen)}
              className="flex items-center gap-1 text-gray-300 hover:text-green-400 transition text-sm font-medium">
              Shop
              <span className="text-xs" style={{ transform: shopOpen ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
            </button>

            {shopOpen && (
              <div className="absolute top-8 left-0 rounded-xl py-2 min-w-48 shadow-2xl"
                style={{ background: '#0f1a0f', border: '1px solid rgba(74,222,128,0.2)', zIndex: 200 }}>
                <Link to="/shop"
                  onClick={() => setShopOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-green-400 hover:bg-green-400 hover:bg-opacity-5 transition font-bold border-b"
                  style={{ borderColor: 'rgba(74,222,128,0.1)' }}>
                  🛒 All Items
                </Link>
                {shopCategories.map(cat => (
                  <button key={cat.filter}
                    onClick={() => goToShop(cat.filter)}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:text-green-400 transition"
                    style={{ background: 'transparent' }}>
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/how-it-works" className="text-gray-300 hover:text-green-400 transition text-sm font-medium">How It Works</Link>
          <Link to="/reviews" className="text-gray-300 hover:text-green-400 transition text-sm font-medium">Reviews</Link>
          <Link to="/socials" className="text-gray-300 hover:text-green-400 transition text-sm font-medium">Socials</Link>
          <Link to="/about" className="text-gray-300 hover:text-green-400 transition text-sm font-medium">About</Link>

          <Link to="/cart" className="relative text-gray-300 hover:text-green-400 transition text-sm font-medium">
            🛒 Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-green-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          <a href="https://discord.gg/yZHbUFTh" target="_blank" rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm">
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
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-300 hover:text-green-400 text-2xl transition">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 pt-4 pb-2 border-t border-gray-800 mt-4 max-w-7xl mx-auto">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-green-400 transition py-2">Home</Link>

          {/* Mobile Shop Section */}
          <div className="py-2">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'rgba(74,222,128,0.6)' }}>Shop</p>
            <Link to="/shop" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-green-400 transition py-1 pl-3">🛒 All Items</Link>
            {shopCategories.map(cat => (
              <button key={cat.filter}
                onClick={() => goToShop(cat.filter)}
                className="block w-full text-left text-gray-300 hover:text-green-400 transition py-1 pl-3 text-sm">
                {cat.label}
              </button>
            ))}
          </div>

          <Link to="/how-it-works" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-green-400 transition py-2">How It Works</Link>
          <Link to="/reviews" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-green-400 transition py-2">Reviews</Link>
          <Link to="/socials" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-green-400 transition py-2">Socials</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-green-400 transition py-2">About</Link>
          <a href="https://discord.gg/yZHbUFTh" target="_blank" rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 w-fit mt-2">
            💬 Discord
          </a>
        </div>
      )}
    </nav>
  )
}

export default Navbar