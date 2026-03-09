require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const app = express()
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || origin.includes('vercel.app') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

app.use('/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'PixelGrove backend running!' })
})

app.post('/create-checkout-session', async (req, res) => {
  const { items, username } = req.body

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: `${item.name} (${item.variant})`,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: 'https://pixel-grove.vercel.app/success',
    cancel_url: 'https://pixel-grove.vercel.app/cart',
    metadata: {
      username,
      cart: JSON.stringify(items.map(i => ({
        id: i.id,
        name: i.name,
        type: i.type,
        potion: i.potion,
        variant: i.variant,
        quantity: i.quantity
      })))
    }
  })

  res.json({ url: session.url })
})

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

    // Save order
    const { error } = await supabase.from('orders').insert({
      username,
      items: cartItems.map(i => `${i.name} (${i.variant}) x${i.quantity}`).join(', '),
      total: session.amount_total / 100,
      status: 'pending'
    })

    if (error) console.error('Supabase error:', error)
    else console.log(`Order saved for ${username}`)

    // Reduce stock using id for exact row match
    for (const item of cartItems) {
      const { data: currentItem } = await supabase
        .from('items')
        .select('stock')
        .eq('id', item.id)
        .single()

      if (currentItem && currentItem.stock !== null) {
        const newStock = Math.max(0, currentItem.stock - item.quantity)
        await supabase
          .from('items')
          .update({ stock: newStock })
          .eq('id', item.id)

        console.log(`Stock updated: ${item.name} (${item.variant}) → ${newStock}`)
      }
    }
  }

  res.json({ received: true })
})

app.listen(4000, () => console.log('Server running on port 4000'))require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const cors = require('cors')
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const app = express()
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || origin.includes('vercel.app') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

app.use('/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'PixelGrove backend running!' })
})

app.post('/create-checkout-session', async (req, res) => {
  const { items, username } = req.body

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: `${item.name} (${item.variant})`,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: 'https://pixel-grove.vercel.app/success',
    cancel_url: 'https://pixel-grove.vercel.app/cart',
    metadata: {
      username,
      cart: JSON.stringify(items.map(i => ({
        id: i.id,
        name: i.name,
        type: i.type,
        potion: i.potion,
        variant: i.variant,
        quantity: i.quantity
      })))
    }
  })

  res.json({ url: session.url })
})

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

    // Save order
    const { error } = await supabase.from('orders').insert({
      username,
      items: cartItems.map(i => `${i.name} (${i.variant}) x${i.quantity}`).join(', '),
      total: session.amount_total / 100,
      status: 'pending'
    })

    if (error) console.error('Supabase error:', error)
    else console.log(`Order saved for ${username}`)

    // Reduce stock using id for exact row match
    for (const item of cartItems) {
      const { data: currentItem } = await supabase
        .from('items')
        .select('stock')
        .eq('id', item.id)
        .single()

      if (currentItem && currentItem.stock !== null) {
        const newStock = Math.max(0, currentItem.stock - item.quantity)
        await supabase
          .from('items')
          .update({ stock: newStock })
          .eq('id', item.id)

        console.log(`Stock updated: ${item.name} (${item.variant}) → ${newStock}`)
      }
    }
  }

  res.json({ received: true })
})

app.listen(4000, () => console.log('Server running on port 4000'))