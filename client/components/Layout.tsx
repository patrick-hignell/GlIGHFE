import { Outlet } from 'react-router'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <>
      <header>
        <h1>GLIFE!</h1>
      </header>
      <main className="pb-20">
        {/* Bottom padding to account for fixed navbar height */}
        <Outlet />
      </main>
      <Navbar />
      {/* <footer></footer> */}
    </>
  )
}
