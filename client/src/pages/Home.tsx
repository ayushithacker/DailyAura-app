import React from 'react'
import FeatherPen from '../assets/feather-pen.png'

const Home: React.FC = () => {
  const quote =
    'The mind is restless, but it can be controlled by constant practice and detachment. — Bhagavad Gita 6.35'

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to DailyAura 💫</h1>
      <p className="text-lg text-gray-600 mb-6 max-w-xl">
        Your peaceful space for daily moods, bhakti & healing.
      </p>

      {/* Quote box */}
      <div className="relative bg-white shadow-md rounded-xl p-6 max-w-xl">
        <p className="text-xl italic text-gray-700 leading-relaxed">
          🕊️ {quote}
        </p>

        {/* Feather pen image positioned nicely */}
        <img
          src={FeatherPen}
          alt="Peacock feather pen"
          className="absolute -bottom-4 -right-4 w-16 rotate-[35deg] opacity-90 pointer-events-none"
        />
      </div>
    </div>
  )
}

export default Home
