import { Outlet } from 'react-router'
import Navbar from './Navbar'
import { useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()
  const noNavbarPaths = ['/', '/onboarding']

  return (
    <>
      <header className="flex flex-col items-center font-serif">
        <h1>GlIGHFE!</h1>
      </header>
      <main className="pb-20">
        {/* Bottom padding to account for fixed navbar height */}
        <Outlet />
      </main>
      {!noNavbarPaths.includes(location.pathname) ? <Navbar /> : null}
    </>
  )
}
