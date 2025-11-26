import React from 'react'
import { Link } from 'react-router'

function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around bg-gray-800 p-4 text-white shadow-lg">
      {/* Feed Link */}
      <Link
        to="/feed"
        className="flex flex-col items-center rounded-md p-2 transition-colors duration-200 hover:bg-gray-700"
      >
        <span role="img" aria-label="feed">
          X
        </span>
        <span className="mt-1 text-xs">Feed</span>
      </Link>

      {/* Profile Link */}
      <Link
        to="/profile"
        className="flex flex-col items-center rounded-md p-2 transition-colors duration-200 hover:bg-gray-700"
      >
        <span role="img" aria-label="profile">
          Y
        </span>
        <span className="mt-1 text-xs">Profile</span>
      </Link>

      {/* Add Image Link */}
      <Link
        to="/upload"
        className="flex flex-col items-center rounded-md p-2 transition-colors duration-200 hover:bg-gray-700"
      >
        <span role="img" aria-label="add image">
          Z
        </span>
        <span className="mt-1 text-xs">Upload</span>
      </Link>
    </nav>
  )
}

export default Navbar
