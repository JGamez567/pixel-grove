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
  const { cart, setDrawerOpen } = useCart()
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [mobileSearch, setMobileSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [mobileSuggestions, setMobileSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [allItems, setAllItems] = useState([])
  const [user, setUser] = useState(null)
  const [accountOpen, setAccountOpen] = useState(false)
  const shopRef = useRef(null)
  const moreRef = useRef(null)
  const accountRef = useRef(null)
  const desktopSearchRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchItems() {
      const { data } = await supabase.from('items').select('id, name, image_url, category, price, type, potion')
      if (data) setAllItems(data)
    }
    fetchItems()

    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClick(e) {
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopOpen(false)
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false)
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false)
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!search.trim()) { setSuggestions([]); return }
    const q = search.toLowerCase()
    const seen = {}
    allItems.forEach(item => {
      if (item.name.toLowerCase().includes(q) && !seen[item.name]) seen[item.name] = item
    })
    setSuggestions(Object.values(seen).slice(0, 6))
  }, [search, allItems])

  useEffect(() => {
    if (!mobileSearch.trim()) { setMobileSuggestions([]); return }
    const q = mobileSearch.toLowerCase()
    const seen = {}
    allItems.forEach(item => {
      if (item.name.toLowerCase().includes(q) && !seen[item.name]) seen[item.name] = item
    })
    setMobileSuggestions(Object.values(seen).slice(0, 6))
  }, [mobileSearch, allItems])

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
    }
  }

  function handleMobileSearch(e) {
    e.preventDefault()
    if (mobileSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(mobileSearch.trim())}`)
      setMobileSearch('')
      setMobileSuggestions([])
      setMobileSearchOpen(false)
      setMenuOpen(false)
    }
  }

  function handleSuggestionClick(name) {
    navigate(`/shop/${encodeURIComponent(name)}`)
    setSearch('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  function handleMobileSuggestionClick(name) {
    navigate(`/shop/${encodeURIComponent(name)}`)
    setMobileSearch('')
    setMobileSuggestions([])
    setMobileSearchOpen(false)
    setMenuOpen(false)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setAccountOpen(false)
    navigate('/')
  }

  const dropdownStyle = { background: '#0a0f0a', border: '1px solid rgba(74,222,128,0.2)', zIndex: 200 }

  const CartBtn = ({ mobile }) => (
    <button
      onClick={() => setDrawerOpen(true)}
      className={`relative ${mobile ? 'text-gray-300' : 'text-gray-300 hover:text-green-400 transition text-sm font-medium'}`}>
      🛒 {!mobile && 'Cart'}
      {itemCount > 0 && (
        <span className={`absolute ${mobile ? '-top-2 -right-2' : '-top-2 -right-4'} bg-green-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center`}>
          {itemCount}
        </span>
      )}
    </button>
  )

  // Account button + dropdown
  const AccountBtn = ({ mobile }) => (
    <div className={mobile ? '' : 'relative flex-shrink-0'} ref={mobile ? null : accountRef}>
      {user ? (
        <>
          <button
            onClick={() => mobile ? navigate('/account') : setAccountOpen(!accountOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '6px 12px', borderRadius: '10px',
              background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
              color: '#4ade80', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              transition: 'all 0.2s', fontFamily: 'system-ui',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(74,222,128,0.08)'}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #4ade80, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '11px', fontWeight: 900 }}>
              {(user.user_metadata?.username || user.email)?.[0]?.toUpperCase()}
            </div>
            {!mobile && <span>{user.user_metadata?.username || user.email?.split('@')[0]}</span>}
          </button>

          {/* Desktop account dropdown */}
          {!mobile && accountOpen && (
            <div className="absolute top-10 right-0 rounded-xl py-2 min-w-44 shadow-2xl" style={dropdownStyle}>
              <Link to="/account" onClick={() => setAccountOpen(false)}
                className="block px-4 py-2 text-sm text-gray-300 hover:text-green-400 transition">
                📦 Order History
              </Link>
              <Link to="/account" onClick={() => setAccountOpen(false)}
                className="block px-4 py-2 text-sm text-gray-300 hover:text-green-400 transition">
                ❤️ Wishlist
              </Link>
              <div style={{ borderTop: '1px solid rgba(74,222,128,0.08)', margin: '4px 0' }} />
              <button onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm transition"
                style={{ color: '#f87171', background: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                Sign Out
              </button>
            </div>
          )}
        </>
      ) : (
        <Link to="/login"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 14px', borderRadius: '10px',
            background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)',
            color: '#86efac', fontWeight: 700, fontSize: '13px',
            textDecoration: 'none', transition: 'all 0.2s', fontFamily: 'system-ui',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(74,222,128,0.06)'}>
          👤 {!mobile && 'Sign In'}
        </Link>
      )}
    </div>
  )

  return (
    <nav className="bg-gray-950 border-b border-green-500 px-6 py-4 relative" style={{ zIndex: 100 }}>
      <div className="flex justify-between items-center max-w-7xl mx-auto gap-4">

        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="/PGLOGO1.png" alt="PixelGrove" className="h-10 w-auto" />
          <span className="text-green-400 text-xl font-bold tracking-widest">PixelGrove</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-5 items-center flex-1 justify-center">
          <Link to="/" className="text-gray-300 hover:text-green-400 transition text-sm font-medium flex-shrink-0">Home</Link>

          {/* Shop Dropdown */}
          <div className="relative flex-shrink-0" ref={shopRef}>
            <button onClick={() => { setShopOpen(!shopOpen); setMoreOpen(false); setAccountOpen(false) }}
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
            <button onClick={() => { setMoreOpen(!moreOpen); setShopOpen(false); setAccountOpen(false) }}
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

          {/* Desktop Search */}
          <div className="relative flex-1 max-w-xs" ref={desktopSearchRef}>
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
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-12 left-0 w-full rounded-xl shadow-2xl overflow-hidden" style={dropdownStyle}>
                {suggestions.map(item => (
                  <button key={item.id} onClick={() => handleSuggestionClick(item.name)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 transition text-left"
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

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <AccountBtn mobile={false} />
          <CartBtn mobile={false} />
          <a href="https://discord.gg/yZHbUFTh" target="_blank" rel="noopener noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm">
            💬 Discord
          </a>
        </div>

       {/* Mobile Right Side */}
<div className="flex md:hidden items-center gap-3">
  <button
    onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMenuOpen(false); setMobileSearch(''); setMobileSuggestions([]) }}
    className="text-gray-300 hover:text-green-400 transition text-xl">
    🔍
  </button>
  <CartBtn mobile={true} />
  {user ? (
    <button onClick={() => navigate('/account')}
      style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #4ade80, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: '13px', fontWeight: 900, border: 'none', cursor: 'pointer' }}>
      {(user.user_metadata?.username || user.email)?.[0]?.toUpperCase()}
    </button>
  ) : (
    <Link to="/login" className="text-gray-300 hover:text-green-400 transition text-xl">👤</Link>
  )}
  <button onClick={() => { setMenuOpen(!menuOpen); setMobileSearchOpen(false) }} className="text-gray-300 hover:text-green-400 text-2xl transition">
    {menuOpen ? '✕' : '☰'}
  </button>
</div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-gray-800 mt-3 max-w-7xl mx-auto">
          <form onSubmit={handleMobileSearch} className="flex gap-2">
            <input autoFocus type="text" placeholder="Search pets..." value={mobileSearch}
              onChange={e => setMobileSearch(e.target.value)}
              className="flex-1 text-white text-sm rounded-xl px-4 py-2 outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.15)' }} />
            <button type="submit" className="px-3 py-2 rounded-xl text-black font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)' }}>Go</button>
          </form>
          {mobileSuggestions.length > 0 && (
            <div className="rounded-xl overflow-hidden mt-2" style={{ border: '1px solid rgba(74,222,128,0.15)', background: '#0a0f0a' }}>
              {mobileSuggestions.map(item => (
                <button key={item.id} onClick={() => handleMobileSuggestionClick(item.name)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
                  style={{ background: 'transparent' }}
                  onTouchStart={e => e.currentTarget.style.background = 'rgba(74,222,128,0.08)'}
                  onTouchEnd={e => e.currentTarget.style.background = 'transparent'}>
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
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 pt-4 pb-2 border-t border-gray-800 mt-4 max-w-7xl mx-auto">
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
          {/* Mobile account */}
          <div className="py-2 border-t border-gray-800 mt-1">
            <AccountBtn mobile={true} />
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