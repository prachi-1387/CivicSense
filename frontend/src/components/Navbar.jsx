
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-8 py-5">

      {/* CivicSense Logo */}
      <Link to="/" className="text-2xl font-bold text-emerald-400">
        CivicSense
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">

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

      </div>
    </nav>
  )
}

export default Navbar
