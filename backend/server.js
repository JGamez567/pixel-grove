require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')
const { Resend } = require('resend')

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)

const app = express()

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || origin.includes('vercel.app') || origin.includes('localhost') || origin.includes('thepixelgrove.shop')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

app.use('/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())

app.get('/', (req, res) => res.json({ status: 'PixelGrove backend running!' }))

// ── Helper: is it within delivery window? (12PM–2AM CST) ──
function isInDeliveryWindow() {
  const now = new Date()
  // CST = UTC-6
  const cstHour = (now.getUTCHours() - 6 + 24) % 24
  return cstHour >= 12 || cstHour < 2
}

// ── Send order confirmation email ──
async function sendOrderConfirmationEmail(email, username, items, total) {
  const inWindow = isInDeliveryWindow()
  const deliveryMsg = inWindow
    ? `Great news — you ordered during our delivery window! We'll deliver your items today between <strong>12PM–2AM CST</strong>.`
    : `Your order was placed outside our delivery window. No worries — we'll deliver your items tomorrow between <strong>12PM–2AM CST</strong>.`

  await resend.emails.send({
    from: 'PixelGrove <orders@thepixelgrove.shop>',
    to: email,
    subject: '🌿 Order Confirmed — PixelGrove',
    html: `
      <div style="background:#050c05;color:#f0faf0;font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;border-radius:16px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="color:#4ade80;font-size:28px;font-weight:900;margin:0;">🌿 PixelGrove</h1>
          <p style="color:#6b7280;font-size:13px;margin-top:6px;">Order Confirmed</p>
        </div>
        <div style="background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.15);border-radius:14px;padding:24px;margin-bottom:24px;">
          <p style="color:#f0faf0;font-size:16px;font-weight:700;margin:0 0 8px;">Hey ${username}! 👋</p>
          <p style="color:#9ca3af;font-size:14px;line-height:1.7;margin:0;">We've received your order and are getting ready to deliver. ${deliveryMsg}</p>
        </div>
        <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(74,222,128,0.1);border-radius:14px;padding:20px;margin-bottom:20px;">
          <p style="color:#6b7280;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Your Order</p>
          <p style="color:#f0faf0;font-size:14px;line-height:1.7;margin:0 0 12px;">${items}</p>
          <div style="border-top:1px solid rgba(74,222,128,0.08);padding-top:12px;display:flex;justify-content:space-between;">
            <span style="color:#6b7280;font-size:13px;">Total</span>
            <span style="color:#4ade80;font-weight:800;font-size:16px;">$${total.toFixed(2)}</span>
          </div>
        </div>
        <div style="background:rgba(74,222,128,0.04);border:1px solid rgba(74,222,128,0.1);border-radius:14px;padding:16px;margin-bottom:24px;">
          <p style="color:#9ca3af;font-size:13px;margin:0;">⏰ <strong style="color:#f0faf0;">Delivery window:</strong> 12PM – 2AM CST daily. Make sure to be online in Roblox during this time!</p>
        </div>
        <p style="color:#374151;font-size:12px;text-align:center;">Questions? Join our <a href="https://discord.gg/yZHbUFTh" style="color:#4ade80;">Discord</a> for support.</p>
      </div>
    `
  })
}

// ── Send delivery status email ──
async function sendStatusEmail(email, username, status, items) {
  const templates = {
    delivering: {
      subject: '🎮 Your Pet is Ready — PixelGrove',
      body: `We're ready to deliver your pet! Please <strong>hop on Roblox</strong> and accept our trade request. We'll be sending it shortly!`,
      color: '#c084fc',
    },
    delivered: {
      subject: '✅ Pet Delivered — PixelGrove',
      body: `Your pet has been successfully delivered in Roblox! We hope you love it 🌿 If you enjoyed your experience, please leave us a review on our website!`,
      color: '#4ade80',
    },
    delayed: {
      subject: '⏰ Order Delayed — PixelGrove',
      body: `Your order was placed outside our delivery window (12PM–2AM CST). No worries — we'll deliver your items during the next delivery window tomorrow. Thank you for your patience!`,
      color: '#fb923c',
    },
  }

  const t = templates[status]
  if (!t) return

  await resend.emails.send({
    from: 'PixelGrove <orders@thepixelgrove.shop>',
    to: email,
    subject: t.subject,
    html: `
      <div style="background:#050c05;color:#f0faf0;font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;border-radius:16px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h1 style="color:#4ade80;font-size:28px;font-weight:900;margin:0;">🌿 PixelGrove</h1>
        </div>
        <div style="background:rgba(255,255,255,0.02);border:1px solid ${t.color}30;border-radius:14px;padding:24px;margin-bottom:24px;">
          <p style="color:#f0faf0;font-size:16px;font-weight:700;margin:0 0 8px;">Hey ${username}!</p>
          <p style="color:#9ca3af;font-size:14px;line-height:1.7;margin:0;">${t.body}</p>
        </div>
        <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(74,222,128,0.1);border-radius:14px;padding:16px;margin-bottom:24px;">
          <p style="color:#6b7280;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Your Items</p>
          <p style="color:#f0faf0;font-size:14px;margin:0;">${items}</p>
        </div>
        <p style="color:#374151;font-size:12px;text-align:center;">Questions? Join our <a href="https://discord.gg/yZHbUFTh" style="color:#4ade80;">Discord</a></p>
      </div>
    `
  })
}

// ── Checkout session ──
app.post('/create-checkout-session', async (req, res) => {
  const { items, username } = req.body

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: { name: `${item.name} (${item.variant})` },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    allow_promotion_codes: true,
    success_url: 'https://thepixelgrove.shop/success',
    cancel_url: 'https://thepixelgrove.shop/cart',
    metadata: {
      username,
      cart: JSON.stringify(items.map(i => ({
        id: i.id, name: i.name, type: i.type,
        potion: i.potion, variant: i.variant, quantity: i.quantity
      })))
    }
  })

  res.json({ url: session.url })
})

// ── Webhook ──
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { username, cart } = session.metadata
    const cartItems = JSON.parse(cart)
    const email = session.customer_details?.email
    const total = session.amount_total / 100
    const itemsStr = cartItems.map(i => `${i.name} (${i.variant}) x${i.quantity}`).join(', ')
    const inWindow = isInDeliveryWindow()
    const initialStatus = inWindow ? 'pending' : 'delayed'

    // Save order with email
    const { error } = await supabase.from('orders').insert({
      username,
      email,
      items: itemsStr,
      total,
      status: initialStatus
    })

    if (error) console.error('Supabase error:', error)
    else console.log(`Order saved for ${username} (${email}) — status: ${initialStatus}`)

    // Send confirmation email
    if (email) {
      try {
        await sendOrderConfirmationEmail(email, username, itemsStr, total)
        console.log(`Confirmation email sent to ${email}`)
      } catch (e) {
        console.error('Email error:', e.message)
      }
    }

    // Decrement stock
    for (const item of cartItems) {
      const { data: currentItem } = await supabase.from('items').select('stock').eq('id', item.id).single()
      if (currentItem && currentItem.stock !== null) {
        const newStock = Math.max(0, currentItem.stock - item.quantity)
        await supabase.from('items').update({ stock: newStock }).eq('id', item.id)
        console.log(`Stock: ${item.name} → ${newStock}`)
      }
    }
  }

  res.json({ received: true })
})

// ── Update order status + send email ──
app.post('/update-order-status', async (req, res) => {
  const { orderId, status, adminSecret } = req.body

  // Verify admin secret
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { data: order, error: fetchError } = await supabase
    .from('orders').select('*').eq('id', orderId).single()

  if (fetchError || !order) return res.status(404).json({ error: 'Order not found' })

  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  if (error) return res.status(500).json({ error: error.message })

  // Send status email if we have the customer's email
  if (order.email) {
    try {
      await sendStatusEmail(order.email, order.username, status, order.items)
      console.log(`Status email (${status}) sent to ${order.email}`)
    } catch (e) {
      console.error('Status email error:', e.message)
    }
  }

  res.json({ success: true })
})

app.listen(4000, () => console.log('Server running on port 4000'))