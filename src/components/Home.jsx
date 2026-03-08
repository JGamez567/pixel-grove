import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function Home() {
  const [reviews, setReviews] = useState([])
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function fetchReviews() {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false })
        .limit(4)
      if (data) setReviews(data)
    }
    fetchReviews()
  }, [])

  async function handleSubmit() {
    if (!username.trim() || !message.trim()) {
      alert('Please fill in all fields!')
      return
    }
    const { error } = await supabase.from('reviews').insert({
      username,
      message,
      rating,
      approved: false
    })
    if (error) console.error(error)
    else setSubmitted(true)
  }

  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-32">
      <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
        Welcome to <span className="text-green-400">PixelGrove</span>
      </h1>
      <p className="text-gray-400 text-xl mb-10 max-w-xl">
        The best shop for Roblox & Adopt Me items.
        Rare pets and more — all in one place.
      </p>
      <div className="flex gap-4">
        <a href="/shop" className="bg-green-500 hover:bg-green-400 text-black font-bold px-8 py-3 rounded-lg transition">
          Browse Shop
        </a>
        <a href="/about" className="border border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-bold px-8 py-3 rounded-lg transition">
          Learn More
        </a>
      </div>
      <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto mt-8">
        <div className="bg-gray-900 border border-gray-800 hover:border-green-500 transition p-8 rounded-xl text-center">
          <div className="text-4xl mb-4">🐾</div>
          <h3 className="text-white font-bold text-xl mb-2">Adopt Me Pets</h3>
          <p className="text-gray-400">Legendary, neon, and mega neon pets at great prices</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 hover:border-green-500 transition p-8 rounded-xl text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-white font-bold text-xl mb-2">Fast Delivery</h3>
          <p className="text-gray-400">Quick and safe delivery every single time</p>
        </div>
      </div>
      <div className="flex gap-16 mt-24 border-t border-gray-800 pt-16 max-w-4xl w-full justify-center">
        <div className="text-center">
          <h3 className="text-green-400 text-4xl font-bold">Many</h3>
          <p className="text-gray-400 mt-1">Items Available</p>
        </div>
        <div className="text-center">
          <h3 className="text-green-400 text-4xl font-bold">Fast</h3>
          <p className="text-gray-400 mt-1">Delivery</p>
        </div>
        <div className="text-center">
          <h3 className="text-green-400 text-4xl font-bold">24/7</h3>
          <p className="text-gray-400 mt-1">Support</p>
        </div>
        <div className="text-center">
          <h3 className="text-green-400 text-4xl font-bold">100%</h3>
          <p className="text-gray-400 mt-1">Safe & Secure</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-24 border-t border-gray-800 pt-16 max-w-4xl w-full">
        <h2 className="text-4xl font-bold text-white mb-2">What People Say</h2>
        <p className="text-gray-400 mb-10">Real reviews from real customers 🌿</p>

        {reviews.length === 0 ? (
          <p className="text-gray-600 mb-10">No reviews yet — be the first!</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 mb-6 text-left">
              {reviews.map(review => (
                <div key={review.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold">{review.username}</h3>
                    <span className="text-yellow-400">{'⭐'.repeat(review.rating)}</span>
                  </div>
                  <p className="text-gray-400 text-sm">{review.message}</p>
                </div>
              ))}
            </div>
            <a
              href="/reviews"
              className="inline-block border border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-bold px-8 py-3 rounded-lg transition mb-10">
              See All Reviews
            </a>
          </>
        )}

        {/* Submit Review Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-left max-w-xl mx-auto">
          <h3 className="text-white font-bold text-xl mb-6">Leave a Review</h3>
          {submitted ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-green-400 font-bold">Thanks for your review!</p>
              <p className="text-gray-400 text-sm mt-1">It'll show up once approved</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-white font-bold text-sm block mb-2">Roblox Username</label>
                <input
                  type="text"
                  placeholder="Your Roblox username..."
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-green-500 text-white rounded-lg px-4 py-3 outline-none transition"
                />
              </div>
              <div>
                <label className="text-white font-bold text-sm block mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-2xl transition ${star <= rating ? 'opacity-100' : 'opacity-30'}`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-white font-bold text-sm block mb-2">Review</label>
                <textarea
                  placeholder="Tell us about your experience..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 focus:border-green-500 text-white rounded-lg px-4 py-3 outline-none transition resize-none"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-lg transition">
                Submit Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home