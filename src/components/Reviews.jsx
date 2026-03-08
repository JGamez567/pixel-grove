import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const perPage = 12

  useEffect(() => {
    fetchReviews()
  }, [page])

  async function fetchReviews() {
    setLoading(true)
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    const { data } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (data) {
      if (page === 1) setReviews(data)
      else setReviews(prev => [...prev, ...data])
      if (data.length < perPage) setHasMore(false)
    }
    setLoading(false)
  }

  return (
    <div className="px-8 py-16 max-w-6xl mx-auto">
      <h1 className="text-5xl font-bold text-white mb-2">Reviews</h1>
      <p className="text-gray-400 mb-10">What our customers say 🌿</p>

      {reviews.length === 0 && !loading ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">💬</div>
          <p className="text-gray-400 text-xl">No reviews yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold">{review.username}</h3>
                <span className="text-yellow-400">{'⭐'.repeat(review.rating)}</span>
              </div>
              <p className="text-gray-400 text-sm">{review.message}</p>
              <p className="text-gray-700 text-xs mt-3">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="text-center py-10">
          <p className="text-green-400">Loading...</p>
        </div>
      )}

      {hasMore && !loading && reviews.length > 0 && (
        <div className="text-center mt-10">
          <button
            onClick={() => setPage(p => p + 1)}
            className="border border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-bold px-8 py-3 rounded-lg transition">
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default Reviews