import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
    <div style={{ minHeight: '100vh', background: '#050c05', fontFamily: 'system-ui, sans-serif', paddingBottom: '60px' }}>
      <div style={{ position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 65%)', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '80px 24px 0' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ color: 'rgba(74,222,128,0.6)', fontSize: '11px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '12px' }}>Testimonials</p>
          <h1 style={{ color: '#f0faf0', fontSize: 'clamp(32px,6vw,56px)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '10px' }}>
            Customer <span style={{ background: 'linear-gradient(135deg, #4ade80, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Reviews</span>
          </h1>
          <p style={{ color: 'rgba(180,220,180,0.5)', fontSize: '15px' }}>Real reviews from verified customers 🌿</p>
        </div>

        {reviews.length === 0 && !loading ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '14px' }}>💬</div>
            <p style={{ color: 'rgba(180,220,180,0.4)', fontSize: '18px' }}>No reviews yet — be the first!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {reviews.map(review => (
              <div key={review.id} style={{
                padding: '22px', background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(74,222,128,0.08)', borderRadius: '20px',
                position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.22)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(74,222,128,0.08)'}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.2), transparent)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ color: '#f0faf0', fontWeight: 700, fontSize: '15px', margin: 0 }}>{review.username}</h3>
                      {review.verified && (
                        <span style={{
                          fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px',
                          background: 'rgba(74,222,128,0.1)', color: '#4ade80',
                          border: '1px solid rgba(74,222,128,0.25)', letterSpacing: '0.5px',
                        }}>
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '11px', marginTop: '3px' }}>
                      {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span style={{ color: '#fbbf24', fontSize: '13px', flexShrink: 0 }}>{'⭐'.repeat(review.rating)}</span>
                </div>
                <p style={{ color: 'rgba(180,220,180,0.6)', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>"{review.message}"</p>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#4ade80', fontSize: '13px', fontWeight: 700, letterSpacing: '2px' }}>Loading...</div>
        )}

        {hasMore && !loading && reviews.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button onClick={() => setPage(p => p + 1)}
              style={{ padding: '12px 36px', borderRadius: '14px', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.25)', color: '#86efac', fontWeight: 700, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(74,222,128,0.06)'}>
              Load More
            </button>
          </div>
        )}

        {/* Leave a review CTA */}
        <div style={{ marginTop: '60px', padding: '32px', background: 'rgba(74,222,128,0.03)', border: '1px solid rgba(74,222,128,0.1)', borderRadius: '24px', textAlign: 'center' }}>
          <p style={{ color: '#f0faf0', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Had a great experience?</p>
          <p style={{ color: 'rgba(180,220,180,0.5)', fontSize: '14px', marginBottom: '20px' }}>
            Leave a review on the home page — you'll need an account and a completed order to leave a verified review.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/#reviews" style={{ padding: '11px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #4ade80, #22c55e)', color: '#000', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
              Leave a Review
            </Link>
            <Link to="/login" style={{ padding: '11px 24px', borderRadius: '12px', border: '1px solid rgba(74,222,128,0.25)', color: '#86efac', fontWeight: 700, fontSize: '14px', textDecoration: 'none', background: 'rgba(74,222,128,0.04)' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reviews