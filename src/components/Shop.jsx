import { useState, useEffect } from 'react'
import { useCart } from './CartContext'
import { supabase } from '../supabase'

const categories = ['All', 'Adopt Me Pet', 'Egg', 'Roblox Item']

function ItemCard({ item }) {
  const { addToCart } = useCart()
  const [selected, setSelected] = useState('Normal')

  if (!item.has_variants) {
    const soldOut = item.normal_stock === null || item.normal_stock <= 0
    return (
      <div className="bg-gray-900 border border-gray-800 hover:border-green-500 transition rounded-xl p-6">
        <img src={item.image_url} alt={item.name} className="w-full h-40 object-contain mb-4" />
        <h3 className="text-white font-bold text-xl mb-1">{item.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{item.category}</p>
        <div className="flex justify-between items-center mt-8">
          <span className="text-green-400 font-bold text-xl">${item.normal_price}</span>
          {soldOut ? (
            <span className="bg-red-900 text-red-400 font-bold px-4 py-2 rounded-lg text-sm">
              Sold Out
            </span>
          ) : (
            <button
              onClick={() => addToCart(item, 'Normal', item.normal_price)}
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-lg transition">
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
    <div className="bg-gray-900 border border-gray-800 hover:border-green-500 transition rounded-xl p-6">
      <img src={item.image_url} alt={item.name} className="w-full h-40 object-contain mb-4" />
      <h3 className="text-white font-bold text-xl mb-1">{item.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{item.category}</p>
      <div className="flex gap-2 mb-4">
        {Object.keys(variants).map(v => (
          <button
            key={v}
            onClick={() => setSelected(v)}
            className={`flex-1 py-1 rounded-lg text-sm font-bold transition border ${
              selected === v
                ? 'bg-green-500 text-black border-green-500'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-green-500'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-green-400 font-bold text-xl">${variant.price}</span>
        {soldOut ? (
          <span className="bg-red-900 text-red-400 font-bold px-4 py-2 rounded-lg text-sm">
            Sold Out
          </span>
        ) : (
          <button
            onClick={() => addToCart(item, selected, variant.price)}
            className="bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-lg transition">
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

  useEffect(() => {
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
    <div className="flex items-center justify-center py-32">
      <p className="text-green-400 text-xl">Loading items...</p>
    </div>
  )

  return (
    <div className="px-4 md:px-8 py-16 max-w-6xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Shop</h1>
      <p className="text-gray-400 mb-8">Browse our latest items</p>
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 focus:border-green-500 text-white rounded-lg px-4 py-3 mb-6 outline-none transition"
      />
      <div className="flex flex-wrap gap-3 mb-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg font-bold transition border text-sm ${
              activeCategory === cat
                ? 'bg-green-500 text-black border-green-500'
                : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-green-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-400 text-xl">No items found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filtered.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Shop