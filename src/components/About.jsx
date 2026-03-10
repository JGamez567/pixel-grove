function About() {
  return (
    <div className="px-8 py-16 max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold text-white mb-4">About <span className="text-green-400">PixelGrove</span></h1>
      <p className="text-gray-400 mb-12">The story behind the store</p>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Why PixelGrove?</h2>
        <p className="text-gray-300 leading-relaxed">
          Trading in Adopt Me can take hours — searching for the right person, negotiating, and hoping you don't get scammed. 
          I built PixelGrove to fix that. Instead of wasting your time trading, you can come straight to our store, 
          pick the pet you want, and have it delivered fast. Get your Dream Pet with no hassle, no overpays, no wasted afternoons.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Show Off Your Rare Pets</h2>
        <p className="text-gray-300 leading-relaxed">
          Whether you're after a legendary, neon, or mega neon pet, we've got you covered. 
          Skip the grind and get straight to showing off your rare pets to your friends.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">⏰</div>
          <h3 className="text-white font-bold text-lg mb-2">Delivery Hours</h3>
          <p className="text-gray-400 text-sm">Our delivery hours are 12am-2am CST, you will get your pet within the next day if you order outside that time</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="text-white font-bold text-lg mb-2">Safe & Secure</h3>
          <p className="text-gray-400 text-sm">Secure payments powered by Stripe</p>
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6">
        <p className="text-gray-500 text-sm leading-relaxed text-center">
          ⚠️ PixelGrove is not affiliated with, endorsed by, or sponsored by Roblox Corporation or Uplift Games. 
          Roblox and Adopt Me are trademarks of their respective owners. 
          PixelGrove is an independent store and operates separately from these companies.
        </p>
      </div>
    </div>
  )
}

export default About