
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Navbar from '../components/Navbar'
function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">

        <p className="mb-5 rounded-full bg-emerald-500/10 px-5 py-2 text-emerald-400">
          Building Better Communities Together
        </p>

        <h2 className="max-w-3xl text-5xl font-bold leading-tight md:text-6xl">
          Your City. Your Voice.
          <span className="text-emerald-400">
            {' '}Our Responsibility.
          </span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Report civic issues, track complaints and help make
          your city cleaner, safer and better for everyone.
        </p>

       <Link
        to="/register"
         className="mt-8 rounded-xl bg-emerald-500 px-8 py-4 font-bold text-slate-950 hover:bg-emerald-400"
         >
        Report an Issue
        </Link>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        © 2026 CivicSense. Empowering Citizens.
      </footer>

    </div>
  )
}

export default Home
