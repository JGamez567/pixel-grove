import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Shop from './components/Shop'
import { CartProvider } from './components/CartContext'
import Cart from './components/Cart'
import About from './components/About'
import Success from './components/Success'
import Reviews from './components/Reviews'



function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-gray-950">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/about" element={<About />} />
            <Route path="/success" element={<Success />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App