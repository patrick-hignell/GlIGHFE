import { Link } from 'react-router'
import { useAuth0 } from '@auth0/auth0-react'

function Navbar() {
  const { user, isAuthenticated } = useAuth0()

  // const navItems = [
  //   { to: '/feed', label: 'Feed', 'aria-label': 'feed', icon: 'X' },
  //   {
  //     to: user ? `/profile/${user.sub}` : '/',
  //     label: 'Profile',
  //     'aria-label': 'profile',
  //     icon: 'bi bi-person-circle',
  //   },
  //   {
  //     to: '/upload',
  //     label: 'Upload',
  //     'aria-label': 'add image',
  //     icon: 'bi bi-upload',
  //   },
  // ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-around bg-gray-800 p-4 text-white shadow-lg">
      <Link
        to="/feed"
        className="flex flex-col items-center rounded-md p-2 transition-colors duration-200 hover:bg-gray-700"
      >
        <img className="w-10" src="/images/feed.png" alt="feed" />
        {/* <span className="mt-1 text-xs">Feed</span> */}
      </Link>
      <Link
        to={user ? `/profile/${user.sub}` : '/'}
        className="flex flex-col items-center rounded-md p-2 transition-colors duration-200 hover:bg-gray-700"
      >
        <i className="bi bi-person-circle text-4xl"></i>
        {/* <span className="mt-1 text-xs">Profile</span> */}
      </Link>
      <Link
        to={isAuthenticated ? '/upload' : '/'}
        className="flex flex-col items-center rounded-md p-2 transition-colors duration-200 hover:bg-gray-700"
      >
        <i className="bi bi-upload text-4xl"></i>
        {/* <span className="mt-1 text-xs">Upload</span> */}
      </Link>
    </nav>
  )
}

export default Navbar
