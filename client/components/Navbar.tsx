import React from 'react'
import { Link } from 'react-router'

function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-around items-center shadow-lg">

      {/* Feed Link */}
      <Link to="/feed" className="flex flex-col items-center p-2 hover:bg-gray-700 rounded-md transition-colors duration-200">
        <span role="img" aria-label="feed">X</span>
        <span className="text-xs mt-1">Feed</span>
      </Link>

      {/* Profile Link */}
      <Link to="/profile" className="flex flex-col items-center p-2 hover:bg-gray-70 rounded-md transition-colors duration-200">
        <span role="img" aria-label="profile">Y</span>
        <span className="text-xs mt-1">Profile</span>
      </Link>

      {/* Add Image Link */}
      <Link to="/addImage" className="flex flex-col items-center p-2 hover:bg-gray-7 rounded-md transition-colors duration-200">
        <span role="img" aria-label="add image">Z</span>
        <span className="text- xs mt-1">Add Image</span>
      </Link>
    </nav>
  )
}
 
export default Navbar