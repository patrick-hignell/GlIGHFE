import { Outlet } from 'react-router'
import Navbar from './Navbar'

export default function Layout() {
  //const font = 'sans'
  const font = 'Wingdings'
  return (
    <div className={`font-[${font}]`}>
      <header className="flex flex-col items-center">
        <h1 className="p-6 text-4xl">GlIGHFE!</h1>
      </header>
      <main className="flex flex-col items-center pb-20">
        {/* Bottom padding to account for fixed navbar height */}
        <Outlet />
      </main>
      <nav>
        <Navbar />
      </nav>
      {/* <footer></footer> */}
    </div>
  )
}
