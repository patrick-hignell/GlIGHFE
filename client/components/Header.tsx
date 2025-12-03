import { useAuth0 } from '@auth0/auth0-react'
import { IfAuthenticated } from './Authenticated'

function Header() {
  const { logout } = useAuth0()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="flex flex-row items-center justify-between bg-[#b9da97] p-3">
      <div className="flex flex-row items-center">
        <h1 className="text-4xl">GlIGHFE!</h1>
        <img
          className="h-12"
          src="/images/GlIGHFE-Icon.png"
          alt="Green hieroglyph bird icon"
        />
      </div>

      <IfAuthenticated>
        <button onClick={handleLogout} aria-label="Logout">
          <i className="bi bi-lock-fill text-4xl"></i>
        </button>
      </IfAuthenticated>
    </header>
  )
}

export default Header
