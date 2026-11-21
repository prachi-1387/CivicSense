
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const API_BASE_URL = 'http://127.0.0.1:8000'

function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: fullName.trim(),
            email: email.trim(),
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        const message = Array.isArray(data.detail)
          ? data.detail.map((item) => item.msg).join(', ')
          : data.detail || 'Registration failed'

        throw new Error(message)
      }

      setSuccess(
        `Welcome, ${data.full_name}! Your account has been created.`
      )

      setFullName('')
      setEmail('')
      setPassword('')

    } catch (err) {
      setError(
        err.message || 'Unable to connect to CivicSense server'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="flex min-h-[85vh] items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Join CivicSense and report civic issues.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                minLength={2}
                maxLength={100}
                autoComplete="name"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-emerald-400"
              />

              <p className="mt-2 text-xs text-slate-500">
                Password must contain at least 8 characters.
              </p>
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {success && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
                {success}
                <p className="mt-2">
                  <Link to="/login" className="font-bold underline">
                    Login to your account
                  </Link>
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Login here
            </Link>
          </p>

        </div>
      </main>
    </div>
  )
}

export default Register
