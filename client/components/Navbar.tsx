import React from 'react'
import { Link } from 'react-router'

function Navbar() {
  const navItems = [
    { to: '/feed', label: 'Feed', 'aria-label': 'feed', icon: 'X' },
    { to: '/profile', label: 'Profile', 'aria-label': 'profile', icon: 'Y' },
    { to: '/upload', label: 'Upload', 'aria-label': 'add image', icon: 'Z' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around bg-gray-800 p-4 text-white shadow-lg">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="flex flex-col items-center rounded-md p-2 transition-colors duration-200 hover:bg-gray-700"
        >
          <span role="img" aria-label={item['aria-label']}>
            {item.icon}
          </span>
          <span className="mt-1 text-xs">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default Navbar
