import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCart } from './CartContext'
import { supabase } from '../supabase'

const categories = ['All', 'Adopt Me Pet', 'Egg', 'Roblox Item', 'Pet Wear']

const TYPE_STYLES = {
  Normal: { label: 'Normal', color: '#9ca3af', active: '#e5e7eb', glow: 'rgba(229,231,235,0.3)' },
  Neon:   { label: 'Neon',   color: '#4ade80', active: '#4ade80', glow: 'rgba(74,222,128,0.4)' },
  Mega:   { label: 'Mega',   color: '#c084fc', active: '#c084fc', glow: 'rgba(192,132,252,0.4)' },
}

const POTION_STYLES = {
  'No Pot':   { label: 'No Pot',  color: '#9ca3af' },
  'Fly':      { label: '✈ Fly',   color: '#60a5fa' },
  'Ride':     { label: '🔴 Ride', color: '#f87171' },
  'Fly-Ride': { label: '✈🔴 FR', color: '#f59e0b' },
}

function Badge({ type, potion }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {type === 'Neon' && <span className="text-xs font-black px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' }}>N</span>}
      {type === 'Mega' && <span className="text-xs font-black px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(192,132,252,0.15)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.3)' }}>M</span>}
      {(potion === 'Fly' || potion === 'Fly-Ride') && <span className="text-xs font-black px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.3)' }}>F</span>}
      {(potion === 'Ride' || potion === 'Fly-Ride') && <span className="text-xs font-black px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)' }}>R</span>}
    </div>
  )
}

function StockLabel({ stock }) {
  if (stock === null || stock === undefined) return null
  if (stock <= 0) return <span className="text-xs font-bold" style={{ color: '#f87171' }}>Sold Out</span>
  if (stock === 1) return <span className="text-xs font-bold" style={{ color: '#fbbf24' }}>⚠ Only 1 left!</span>
  if (stock <= 3) return <span className="text-xs font-bold" style={{ color: '#fb923c' }}>{stock} in stock</span>
  return <span className="text-xs font-bold" style={{ color: 'rgba(74,222,128,0.5)' }}>{stock} in stock</span>
}

function PetCard({ petName, combos }) {
  const { addToCart, cart } = useCart()
  const [hovered, setHovered] = useState(false)

  const availableTypes = [...new Set(combos.map(c => c.type))]
  const availablePotions = [...new Set(combos.map(c => c.potion))]
  const bestCombo = [...combos].sort((a, b) => (b.stock || 0) - (a.stock || 0))[0]
  const [selectedType, setSelectedType] = useState(bestCombo.type)
  const [selectedPotion, setSelectedPotion] = useState(bestCombo.potion)

  const isRobloxItem = combos[0].category === 'Roblox Item'
  const currentCombo = combos.find(c => c.type === selectedType && c.potion === selectedPotion)
    || combos.find(c => c.type === selectedType) || bestCombo

  const soldOut = !currentCombo || currentCombo.stock === null || currentCombo.stock <= 0
  const cartItem = cart.find(c => c.id === currentCombo?.id)
  const cartQty = cartItem ? cartItem.quantity : 0
  const canAdd = currentCombo && currentCombo.stock > cartQty

  function handleTypeSelect(type) {
    setSelectedType(type)
    const comboWithSamePotion = combos.find(c => c.type === type && c.potion === selectedPotion)
    if (!comboWithSamePotion) {
      const bestForType = [...combos.filter(c => c.type === type)].sort((a, b) => (b.stock || 0) - (a.stock || 0))[0]
      if (bestForType) setSelectedPotion(bestForType.potion)
    }
  }

  function handleAddToCart() {
    if (!canAdd) return
    if (currentCombo.stock <= cartQty) { alert(`Only ${currentCombo.stock} in stock!`); return }
    addToCart(currentCombo, `${currentCombo.type} ${currentCombo.potion}`, currentCombo.price)
  }

  const typeStyle = TYPE_STYLES[selectedType] || TYPE_STYLES.Normal

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-5 transition-all duration-300 flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: hovered ? `1px solid ${typeStyle.active}40` : '1px solid rgba(74,222,128,0.08)',
        boxShadow: hovered ? `0 0 30px ${typeStyle.glow || 'rgba(74,222,128,0.06)'}` : 'none',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}>

      <div className="rounded-xl p-3 mb-4 flex items-center justify-center h-36 relative" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <img src={combos[0].image_url} alt={petName} className="h-full object-contain" />
        <div className="absolute top-2 right-2"><Badge type={selectedType} potion={selectedPotion} /></div>
      </div>

      <h3 className="text-white font-bold text-base mb-0.5">{petName}</h3>
      <p className="text-xs font-bold mb-3 tracking-wider uppercase" style={{ color: 'rgba(74,222,128,0.5)' }}>{combos[0].category}</p>

      {!isRobloxItem && availableTypes.length > 1 && (
        <div className="flex gap-1.5 mb-2">
          {['Normal', 'Neon', 'Mega'].filter(t => availableTypes.includes(t)).map(t => {
            const ts = TYPE_STYLES[t]
            const isActive = selectedType === t
            return (
              <button key={t} onClick={() => handleTypeSelect(t)}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={isActive ? {
                  background: t === 'Mega' ? 'linear-gradient(135deg, #c084fc, #a855f7)' : 'linear-gradient(135deg, #4ade80, #22c55e)',
                  color: '#000', boxShadow: `0 0 10px ${ts.glow}`
                } : { background: 'rgba(255,255,255,0.03)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}>
                {t}
              </button>
            )
          })}
        </div>
      )}

      {!isRobloxItem && availablePotions.length > 1 && (
        <div className="flex gap-1.5 mb-3">
          {['No Pot', 'Fly', 'Ride', 'Fly-Ride'].filter(p => availablePotions.includes(p)).map(p => {
            const ps = POTION_STYLES[p]
            const isActive = selectedPotion === p
            const comboExists = combos.find(c => c.type === selectedType && c.potion === p)
            return (
              <button key={p} onClick={() => comboExists && setSelectedPotion(p)}
                className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={isActive ? {
                  background: 'rgba(255,255,255,0.1)', color: ps.color,
                  border: `1px solid ${ps.color}60`, boxShadow: `0 0 8px ${ps.color}30`
                } : {
                  background: 'rgba(255,255,255,0.02)', color: comboExists ? '#6b7280' : '#374151',
                  border: '1px solid rgba(255,255,255,0.05)', opacity: comboExists ? 1 : 0.4,
                  cursor: comboExists ? 'pointer' : 'not-allowed'
                }}>
                {ps.label}
              </button>
            )
          })}
        </div>
      )}

      <div className="mt-auto pt-2">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-xl" style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {currentCombo ? `$${currentCombo.price}` : 'N/A'}
          </span>
          <StockLabel stock={currentCombo?.stock} />
        </div>
        {soldOut ? (
          <div className="w-full text-center text-xs font-bold py-2.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>Sold Out</div>
        ) : !canAdd ? (
          <div className="w-full text-center text-xs font-bold py-2.5 rounded-xl" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}>Max in cart</div>
        ) : (
          <button onClick={handleAddToCart}
            className="w-full text-black font-bold py-2.5 rounded-xl text-sm transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', boxShadow: '0 0 12px rgba(74,222,128,0.2)' }}>
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}

function Shop() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(() => searchParams.get('search') || '')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [stockFilter, setStockFilter] = useState('all') // 'all' | 'instock' | 'soldout'
  const [showFilters, setShowFilters] = useState(false)

  const [activeCategory, setActiveCategory] = useState(() => {
    const filter = searchParams.get('filter')
    if (filter === 'Egg') return 'Egg'
    if (filter === 'Roblox Item') return 'Roblox Item'
    if (filter === 'Pet Wear') return 'Pet Wear'
    if (filter === 'Mega' || filter === 'Neon' || filter === 'Normal') return 'Adopt Me Pet'
    return 'All'
  })

  const [activeType, setActiveType] = useState(() => {
    const filter = searchParams.get('filter')
    if (filter === 'Mega' || filter === 'Neon' || filter === 'Normal') return filter
    return null
  })

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    async function fetchItems() {
      const { data, error } = await supabase.from('items').select('*')
      if (error) console.error(error)
      else setItems(data || [])
      setLoading(false)
    }
    fetchItems()
  }, [])

  const grouped = items.reduce((acc, item) => {
    if (!acc[item.name]) acc[item.name] = []
    acc[item.name].push(item)
    return acc
  }, {})

  const filteredGroups = Object.entries(grouped).filter(([name, combos]) => {
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || combos[0].category === activeCategory
    const matchesType = !activeType || combos.some(c => c.type === activeType)

    // Price filter — check if any combo falls in range
    const min = minPrice !== '' ? parseFloat(minPrice) : null
    const max = maxPrice !== '' ? parseFloat(maxPrice) : null
    const matchesPrice = combos.some(c => {
      if (min !== null && c.price < min) return false
      if (max !== null && c.price > max) return false
      return true
    })

    // Stock filter
    const totalStock = combos.reduce((sum, c) => sum + (c.stock || 0), 0)
    const matchesStock =
      stockFilter === 'all' ? true :
      stockFilter === 'instock' ? totalStock > 0 :
      stockFilter === 'soldout' ? totalStock <= 0 : true

    return matchesSearch && matchesCategory && matchesType && matchesPrice && matchesStock
  })

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🌿</div>
        <p className="font-bold tracking-widest uppercase text-sm" style={{ color: '#4ade80' }}>Loading items...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.04) 0%, transparent 60%)', zIndex: 0 }} />

      <div className="relative px-4 md:px-8 py-16 max-w-6xl mx-auto" style={{ zIndex: 1 }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <div className="mb-2 text-xs font-bold tracking-widest uppercase" style={{ color: 'rgba(74,222,128,0.6)' }}>🌿 PixelGrove Store</div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">Browse <span style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Items</span></h1>
          <p className="text-gray-500 mb-10">Find your perfect pet or item</p>
        </div>

        {/* Search + Filter toggle */}
        <div className="flex gap-3 mb-6">
          <input type="text" placeholder="Search items..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-white rounded-xl px-5 py-4 outline-none transition"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(74,222,128,0.15)' }} />
          <button onClick={() => setShowFilters(!showFilters)}
            className="px-5 py-4 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
            style={showFilters ? {
              background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#000'
            } : {
              background: 'rgba(255,255,255,0.03)', color: '#9ca3af', border: '1px solid rgba(74,222,128,0.15)'
            }}>
            ⚙ Filters
          </button>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <div className="rounded-2xl p-5 mb-6 flex flex-wrap gap-6"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(74,222,128,0.1)' }}>

            {/* Price range */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'rgba(74,222,128,0.6)' }}>Price Range</p>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min $" value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="w-24 text-white text-sm rounded-lg px-3 py-2 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.15)' }} />
                <span className="text-gray-500">—</span>
                <input type="number" placeholder="Max $" value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="w-24 text-white text-sm rounded-lg px-3 py-2 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(74,222,128,0.15)' }} />
                {(minPrice || maxPrice) && (
                  <button onClick={() => { setMinPrice(''); setMaxPrice('') }}
                    className="text-xs font-bold px-2 py-1 rounded-lg"
                    style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)' }}>Clear</button>
                )}
              </div>
            </div>

            {/* Stock filter */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'rgba(74,222,128,0.6)' }}>Availability</p>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'instock', label: '✅ In Stock' },
                  { value: 'soldout', label: '❌ Sold Out' },
                ].map(opt => (
                  <button key={opt.value} onClick={() => setStockFilter(opt.value)}
                    className="px-3 py-2 rounded-lg text-xs font-bold transition-all"
                    style={stockFilter === opt.value ? {
                      background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#000'
                    } : {
                      background: 'rgba(255,255,255,0.03)', color: '#9ca3af', border: '1px solid rgba(74,222,128,0.15)'
                    }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(cat => (
            <button key={cat} onClick={() => { setActiveCategory(cat); setActiveType(null) }}
              className="px-4 py-2 rounded-xl font-bold text-sm transition-all"
              style={activeCategory === cat && !activeType ? {
                background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#000', boxShadow: '0 0 15px rgba(74,222,128,0.3)'
              } : {
                background: 'rgba(255,255,255,0.03)', color: '#9ca3af', border: '1px solid rgba(74,222,128,0.15)'
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Type filters */}
        {(activeCategory === 'All' || activeCategory === 'Adopt Me Pet') && (
          <div className="flex flex-wrap gap-2 mb-10">
            {['Mega', 'Neon', 'Normal'].map(t => (
              <button key={t} onClick={() => { setActiveType(activeType === t ? null : t); setActiveCategory('Adopt Me Pet') }}
                className="px-4 py-2 rounded-xl font-bold text-sm transition-all"
                style={activeType === t ? {
                  background: t === 'Mega' ? 'linear-gradient(135deg, #c084fc, #a855f7)' : 'linear-gradient(135deg, #4ade80, #22c55e)',
                  color: '#000',
                  boxShadow: t === 'Mega' ? '0 0 15px rgba(192,132,252,0.3)' : '0 0 15px rgba(74,222,128,0.3)'
                } : {
                  background: 'rgba(255,255,255,0.03)', color: '#9ca3af', border: '1px solid rgba(74,222,128,0.15)'
                }}>
                {t === 'Mega' ? '🟣' : t === 'Neon' ? '🟢' : '⚪'} {t}
              </button>
            ))}
          </div>
        )}

        {!(activeCategory === 'All' || activeCategory === 'Adopt Me Pet') && <div className="mb-10" />}

        {filteredGroups.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-xl">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {filteredGroups.map(([name, combos]) => (
              <PetCard key={name} petName={name} combos={combos} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Shop