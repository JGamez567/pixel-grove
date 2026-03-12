import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Shop from './components/Shop'
import { CartProvider } from './components/CartContext'
import Cart from './components/Cart'
import About from './components/About'
import Success from './components/Success'
import Reviews from './components/Reviews'
import HowItWorks from './components/HowItWorks'
import Socials from './components/Socials'
import ChatWidget from './components/ChatWidget'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsOfService from './components/TermsOfService'
import RefundPolicy from './components/RefundPolicy'
import CartDrawer from './components/CartDrawer'
import ItemDetail from './components/ItemDetail'

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
            <Route path="/success" element={<Success />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/socials" element={<Socials />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/shop/:name" element={<ItemDetail />} />

          </Routes>
          <ChatWidget />
          <CartDrawer />
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App