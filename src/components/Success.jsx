import { Link } from 'react-router-dom'

function Success() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-32 px-8">
      <div className="text-8xl mb-6">🎉</div>
      <h1 className="text-5xl font-bold text-white mb-4">Order Confirmed!</h1>
      <p className="text-gray-400 text-xl mb-2">Thank you for your purchase!</p>
      <p className="text-gray-400 mb-8 max-w-md">
        Your pet will be delivered to your Roblox account soon. 
        Join our game and we'll trade it to you as fast as possible! 
      </p>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 mb-10 max-w-md w-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl">⚡</span>
            <div className="text-left">
              <h3 className="text-white font-bold">Delivery Hours</h3>
              <p className="text-gray-400 text-sm">Our delivery hours are at 12pm-2am CST.If you order outside that time frame we will ensure you get your pet the next day</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-3xl">🎮</span>
            <div className="text-left">
              <h3 className="text-white font-bold">How it works</h3>
              <p className="text-gray-400 text-sm">Expect a friend request from sourpatchcookie109 and accept their friend request and then join our server!</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-3xl">❓</span>
            <div className="text-left">
              <h3 className="text-white font-bold">Need help?</h3>
              <p className="text-gray-400 text-sm">Contact us by email thepixelgrove1@gmail.com or by joining our discord for any additional help!</p>
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/shop"
        className="bg-green-500 hover:bg-green-400 text-black font-bold px-10 py-4 rounded-lg transition text-xl">
        Back to Shop
      </Link>
    </div>
  )
}

export default Success