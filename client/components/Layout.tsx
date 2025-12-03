import { Outlet } from 'react-router'
import Navbar from './Navbar'
import { useLocation } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  const location = useLocation()
  const noNavbarPaths = ['/', '/onboarding']
  const wingdings = true

  return (
    <div className={wingdings ? "font-['wingdings']" : 'font-sans'}>
      <Header />
      <main className="flex flex-col items-center bg-gradient-to-b from-[#e2ffc587] to-[#b1e082af] pb-20">
        {/* Bottom padding to account for fixed navbar height */}
        <Outlet />
      </main>
      {!noNavbarPaths.includes(location.pathname) && <Navbar />}
    </div>
  )
}
