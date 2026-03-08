import { useState, useEffect } from 'react'
import { useCart } from './CartContext'
import { supabase } from '../supabase'

const categories = ['All', 'Adopt Me Pet', 'Egg', 'Roblox Item']

function ItemCard({ item }) {
  const { addToCart } = useCart()
  const [selected, setSelected] = useState('Normal')
  const [hovered, setHovered] = useState(false)

  if (!item.has_variants) {
    const soldOut = item.normal_stock === null || item.normal_stock <= 0
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="rounded-2xl p-6 transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: hovered ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(74,222,128,0.08)',
          boxShadow: hovered ? '0 0 30px rgba(74,222,128,0.06)' : 'none',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}>
        <div className="rounded-xl p-4 mb-4 flex items-center justify-center h-40"
          style={{ background: 'rgba(255,255,255,0.03)' }}>
          <img src={item.image_url} alt={item.name} className="h-full object-contain" />
        </div>
        <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
        <p className="text-xs font-bold mb-4 tracking-wider uppercase"
          style={{ color: 'rgba(74,222,128,0.6)' }}>{item.category}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-xl"
            style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ${item.normal_price}
          </span>
          {soldOut ? (
            <span className="text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
              Sold Out
            </span>
          ) : (
            <button
              onClick={() => addToCart(item, 'Normal', item.normal_price)}
              className="text-black font-bold px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #4ade80, #22c55e)', boxShadow: '0 0 12px rgba(74,222,128,0.2)' }}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    )
  }

  const variants = {
    Normal: { price: item.normal_price, stock: item.normal_stock },
    Neon: { price: item.neon_price, stock: item.neon_stock },
    Mega: { price: item.mega_price, stock: item.mega_stock },
  }

  const variant = variants[selected]
  const soldOut = variant.stock === null || variant.stock <= 0

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-6 transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: hovered ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(74,222,128,0.08)',
        boxShadow: hovered ? '0 0 30px rgba(74,222,128,0.06)' : 'none',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}>
      <div className="rounded-xl p-4 mb-4 flex items-center justify-center h-40"
        style={{ background: 'rgba(255,255,255,0.03)' }}>
        <img src={item.image_url} alt={item.name} className="h-full object-contain" />
      </div>
      <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
      <p className="text-xs font-bold mb-4 tracking-wider uppercase"
        style={{ color: 'rgba(74,222,128,0.6)' }}>{item.category}</p>
      <div className="flex gap-2 mb-4">
        {Object.keys(variants).map(v => (
          <button
            key={v}
            onClick={() => setSelected(v)}
            className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={selected === v ? {
              background: 'linear-gradient(135deg, #4ade80, #22c55e)',
              color: '#000',
              border: '1px solid transparent',
              boxShadow: '0 0 10px rgba(74,222,128,0.3)'
            } : {
              background: 'rgba(255,255,255,0.03)',
              color: '#9ca3af',
              border: '1px solid rgba(74,222,128,0.15)'
            }}>
            {v}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="font-bold text-xl"
          style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ${variant.price}
        </span>
        {soldOut ? (
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            Sold Out
          </span>
        ) : (
          <button
            onClick={() => addToCart(item, selected, variant.price)}
            className="text-black font-bold px-4 py-2 rounded-lg text-sm transition-all hover:scale-105"
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
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    async function fetchItems() {
      const { data, error } = await supabase.from('items').select('*')
      if (error) console.error(error)
      else setItems(data)
      setLoading(false)
    }
    fetchItems()
  }, [])

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🌿</div>
        <p className="font-bold tracking-widest uppercase text-sm"
          style={{ color: '#4ade80' }}>Loading items...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(74,222,128,0.04) 0%, transparent 60%)', zIndex: 0 }} />

      <div className="relative px-4 md:px-8 py-16 max-w-6xl mx-auto" style={{ zIndex: 1 }}>
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease'
        }}>
          <div className="mb-2 text-xs font-bold tracking-widest uppercase"
            style={{ color: 'rgba(74,222,128,0.6)' }}>🌿 PixelGrove Store</div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">Browse <span style={{
            background: 'linear-gradient(135deg, #4ade80, #86efac)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Items</span></h1>
          <p className="text-gray-500 mb-10">Find your perfect pet or item</p>
        </div>

        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-white rounded-xl px-5 py-4 mb-6 outline-none transition"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(74,222,128,0.15)',
          }}
        />

        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-xl font-bold text-sm transition-all"
              style={activeCategory === cat ? {
                background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                color: '#000',
                boxShadow: '0 0 15px rgba(74,222,128,0.3)'
              } : {
                background: 'rgba(255,255,255,0.03)',
                color: '#9ca3af',
                border: '1px solid rgba(74,222,128,0.15)'
              }}>
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-xl">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {filtered.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Shop