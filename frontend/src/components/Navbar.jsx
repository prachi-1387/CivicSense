
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem('civicsenseUser') || 'null'
      )
    } catch {
      return null
    }
  })

  const isLoggedIn =
    Boolean(sessionStorage.getItem('civicsenseToken')) &&
    Boolean(user)

  function handleLogout() {
    // Clear the current user's session
    sessionStorage.removeItem('civicsenseToken')
    sessionStorage.removeItem('civicsenseUser')

    setUser(null)

    // Redirect to login
    navigate('/login', { replace: true })
  }

  return (
    <nav className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-8 py-5">

      {/* CivicSense Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-emerald-400"
      >
        CivicSense
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-4 sm:gap-6">

        {isLoggedIn ? (
          <>
            <Link
              to={user.role === 'admin' ? '/admin' : '/dashboard'}
              className="font-medium text-slate-300 hover:text-emerald-400"
            >
              Dashboard
            </Link>

            <span className="hidden text-sm text-slate-400 sm:inline">
              {user.full_name || user.email}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-500/30 px-4 py-2.5 font-semibold text-red-400 transition hover:bg-red-500/10"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="font-medium text-slate-300 hover:text-emerald-400"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Get Started
            </Link>
          </>
        )}

      </div>
    </nav>
  )
}

export default Navbar
