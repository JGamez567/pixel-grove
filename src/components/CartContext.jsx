import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  function addToCart(item, variant, price) {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.variant === variant)
      if (existing) {
        return prev.map(i =>
          i.id === item.id && i.variant === variant
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...item, variant, price, quantity: 1 }]
    })
  }

  function removeFromCart(id, variant) {
    setCart(prev => prev.filter(i => !(i.id === id && i.variant === variant)))
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}