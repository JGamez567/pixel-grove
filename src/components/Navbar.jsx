import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from './CartContext'
import { supabase } from '../supabase'

const shopCategories = [
  { label: '🟣 Mega Pets', filter: 'Mega' },
  { label: '🟢 Neon Pets', filter: 'Neon' },
  { label: '⚪ Normal Pets', filter: 'Normal' },
  { label: '🥚 Eggs', filter: 'Egg' },
  { label: '🎮 Roblox Items', filter: 'Roblox Item' },
  { label: '👒 Pet Wear', filter: 'Pet Wear' },
]

const moreLinks = [
  { label: '❓ How It Works', to: '/how-it-works' },
  { label: '⭐ Reviews', to: '/reviews' },
  { label: '📱 Socials', to: '/socials' },
  { label: 'ℹ️ About', to: '/about' },
]

function Navbar() {
  const { cart } = useCart()
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allItems, setAllItems] = useState([])
  const shopRef = useRef(null)
  const moreRef = useRef(null)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  // Load all items once for suggestions
  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase.from('items').select('id, name, image_url, category, price, type, potion')
      if (data) setAllItems(data)
    }
    fetchItems()
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopOpen(false)
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false)
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Filter suggestions as user types
  useEffect(() => {
    if (!search.trim()) { setSuggestions([]); return }
    const q = search.toLowerCase()
    // Group by name, get unique pet names with best image/price
    const seen = {}
    allItems.forEach(item => {
      if (item.name.toLowerCase().includes(q)) {
        if (!seen[item.name]) seen[item.name] = item
      }
    })
    setSuggestions(Object.values(seen).slice(0, 6))
  }, [search, allItems])

  function goToShop(filter) {
    setShopOpen(false)
    setMenuOpen(false)
    navigate(`/shop?filter=${encodeURIComponent(filter)}`)
  }

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
      setSearch('')
      setShowSuggestions(false)
      setMenuOpen(false)
    }
  }

  function handleSuggestionClick(name) {
    navigate(`/shop?search=${encodeURIComponent(name)}`)
    setSearch('')
    setShowSuggestions(false)
    setMenuOpen(false)
  }

  const dropdownStyle = { background: '#0a0f0a', border: '1px solid rgba(74,222,128,0.2)', zIndex: 200 }

  return (
    <nav className="bg-gray-950 border-b border-green-500 px-6 py-4 relative" style={{ zIndex: 100 }}>
      <div className="flex justify-between items-center max-w-7xl mx-auto gap-4">
        <Link to="/" className="text-green-400 text-xl font-bold tracking-widest flex-shrink-0">
          🌳 PixelGrove
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-5 items-center flex-1 justify-center">
          <Link to="/" className="text-gray-300 hover:text-green-400 transition text-sm font-medium flex-shrink-0">Home</Link>

          {/* Shop Dropdown */}
          <div className="relative flex-shrink-0" ref={shopRef}>
            <button onClick={() => { setShopOpen(!shopOpen); setMoreOpen(false) }}
              className="flex items-center gap-1 text-gray-300 hover:text-green-400 transition text-sm font-medium">
              Shop
              <span className="text-xs" style={{ transform: shopOpen ? 'rotate(180deg)' : 'rotate(0)', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
            </button>
            {shopOpen && (
              <div className="absolute top-8 left-0 rounded-xl py-2 min-w-48 shadow-2xl" style={dropdownStyle}>
                <Link to="/shop" onClick={() => setShopOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-green-400 transition font-bold border-b"
                  style={{ borderColor: 'rgba(74,222,128,0.1)' }}>
                  🛒 All Items
                </Link>
                {shopCategories.map(cat => (
                  <button key={cat.filter} onClick={() => goToShop(cat.filter)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-green-400 transition"
                    style={{ background: 'transparent' }}>
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* More Dropdown */}
          <div className="relative flex-shrink-0" ref={moreRef}>
            <button onClick={() => { setMoreOpen(!moreOpen); setShopOpen(false) }}
              className="flex items-center gap-1 text-gray-300 hover:text-green-400 transition text-sm font-medium">
              More
              <span className="text-xs" style={{ transform: moreOpen ? 'rotate(180deg)' : 'rotate(0)', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
            </button>
            {moreOpen && (
              <div className="absolute top-8 left-0 rounded-xl py-2 min-w-44 shadow-2xl" style={dropdownStyle}>
                {moreLinks.map(link => (
                  <Link key={link.to} to={link.to} onClick={() => setMoreOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-green-400 transition">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search bar with suggestions */}
          <div className="relative flex-1 max-w-xs" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input type="text" placeholder="Search pets..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setShowSuggestions(true) }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full text-white text-sm rounded-xl px-4 py-2 pr-8 outline-none transition"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.15)' }} />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition">🔍</button>
              </div>
            </form>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-12 left-0 w-full rounded-xl shadow-2xl overflow-hidden" style={dropdownStyle}>
                {suggestions.map(item => (
                  <button key={item.id} onClick={() => handleSuggestionClick(item.name)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-green-400 transition text-left"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {item.image_url
                      ? <img src={item.image_url} alt={item.name} className="w-8 h-8 object-contain rounded-lg flex-shrink-0"
                          style={{ background: 'rgba(255,255,255,0.05)' }} />
                      : <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-lg"
                          style={{ background: 'rgba(74,222,128,0.1)' }}>🐾</div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-bold truncate">{item.name}</p>
                      <p className="text-xs truncate" style={{ color: 'rgba(74,222,128,0.6)' }}>{item.category}</p>
                    </div>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: '#4ade80' }}>${item.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
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
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-300 hover:text-green-400 text-2xl transition">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 pt-4 pb-2 border-t border-gray-800 mt-4 max-w-7xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2 mb-3">
            <input type="text" placeholder="Search pets..." value={search}
              onChange={e => { setSearch(e.target.value); setShowSuggestions(true) }}
              className="flex-1 text-white text-sm rounded-xl px-4 py-2 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.15)' }} />
            <button type="submit" className="px-3 py-2 rounded-xl text-black font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)' }}>🔍</button>
          </form>

          {/* Mobile suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="rounded-xl overflow-hidden mb-2" style={{ border: '1px solid rgba(74,222,128,0.15)', background: '#0a0f0a' }}>
              {suggestions.map(item => (
                <button key={item.id} onClick={() => handleSuggestionClick(item.name)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
                  style={{ background: 'transparent' }}>
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} className="w-8 h-8 object-contain rounded-lg flex-shrink-0" />
                    : <div className="w-8 h-8 rounded-lg flex-shrink-0 text-lg flex items-center justify-center" style={{ background: 'rgba(74,222,128,0.1)' }}>🐾</div>
                  }
                  <div className="flex-1">
                    <p className="text-white text-sm font-bold">{item.name}</p>
                    <p className="text-xs" style={{ color: 'rgba(74,222,128,0.6)' }}>{item.category}</p>
                  </div>
                  <span className="text-xs font-bold" style={{ color: '#4ade80' }}>${item.price}</span>
                </button>
              ))}
            </div>
          )}

          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-green-400 transition py-2">Home</Link>
          <div className="py-2">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'rgba(74,222,128,0.6)' }}>Shop</p>
            <Link to="/shop" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-green-400 transition py-1 pl-3">🛒 All Items</Link>
            {shopCategories.map(cat => (
              <button key={cat.filter} onClick={() => goToShop(cat.filter)}
                className="block w-full text-left text-gray-300 hover:text-green-400 transition py-1 pl-3 text-sm">
                {cat.label}
              </button>
            ))}
          </div>
          <div className="py-2">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'rgba(74,222,128,0.6)' }}>More</p>
            {moreLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
                className="block text-gray-300 hover:text-green-400 transition py-1 pl-3">
                {link.label}
              </Link>
            ))}
          </div>
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