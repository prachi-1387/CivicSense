
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Clock,
  CheckCircle,
  Plus,
  Search,
  ClipboardList,
} from 'lucide-react'

import Navbar from '../components/Navbar'
import Button from '../components/Button'
import IssueCard from '../components/IssueCard'
import { getMyComplaints } from '../services/complaintService'

const STATUS_LABELS = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

function Dashboard() {
  const [complaints, setComplaints] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch complaints belonging to the logged-in citizen
  useEffect(() => {
    let active = true

    async function loadComplaints() {
      setLoading(true)
      setError('')

      try {
        const data = await getMyComplaints()

        if (!Array.isArray(data)) {
          throw new Error('Unexpected complaint response from server')
        }

        const formattedComplaints = data.map((item) => ({
          ...item,
          id: `CS-${item.complaint_id}`,
          backendId: item.complaint_id,
          status: STATUS_LABELS[item.status] || item.status,
          priority: item.priority_level,
          createdAt: item.created_at,
        }))

        if (active) {
          setComplaints(formattedComplaints)
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load your complaints')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadComplaints()

    return () => {
      active = false
    }
  }, [])

  // Search and filter
  const filteredComplaints = complaints.filter((complaint) => {
    const search = searchTerm.toLowerCase()

    const matchesSearch = [
      complaint.title,
      complaint.category,
      complaint.id,
      complaint.location,
    ].some((value) =>
      String(value || '').toLowerCase().includes(search)
    )

    const matchesStatus =
      statusFilter === 'All' ||
      complaint.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Dashboard statistics
  const totalComplaints = complaints.length

  const pendingComplaints = complaints.filter((complaint) =>
    ['Submitted', 'Under Review', 'Assigned'].includes(
      complaint.status
    )
  ).length

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === 'Resolved'
  ).length

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Welcome Section */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-500/10 p-3">
              <ClipboardList
                size={28}
                className="text-emerald-400"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Your Civic Dashboard
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Together, let's make our city better.
              </p>
            </div>
          </div>

          <Link to="/complaint-form">
            <Button>
              <Plus size={18} className="mr-2 inline" />
              Report a New Issue
            </Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">

          <div className="rounded-2xl border border-sky-400/20 bg-gradient-to-br from-sky-500/15 to-blue-600/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Total Complaints
                </p>
                <h2 className="mt-3 text-4xl font-bold">
                  {totalComplaints}
                </h2>
              </div>
              <FileText size={28} className="text-sky-400" />
            </div>

            <p className="mt-4 text-xs text-slate-400">
              All your reported civic issues
            </p>
          </div>

          <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/15 to-orange-600/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Pending Complaints
                </p>
                <h2 className="mt-3 text-4xl font-bold">
                  {pendingComplaints}
                </h2>
              </div>
              <Clock size={28} className="text-amber-400" />
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Awaiting action
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/15 to-teal-600/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Resolved Complaints
                </p>
                <h2 className="mt-3 text-4xl font-bold">
                  {resolvedComplaints}
                </h2>
              </div>
              <CheckCircle size={28} className="text-emerald-400" />
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Successfully resolved
            </p>
          </div>
        </div>

        {/* Recent Complaints */}
        <section className="mt-12">

          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              Recent Complaints
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Keep track of your reported issues.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                placeholder="Search by ID, title, category or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-11 pr-4 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-500"
            >
              <option value="All">All Statuses</option>
              {Object.values(STATUS_LABELS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="rounded-xl border border-slate-700 p-8 text-center text-slate-400">
              Loading your complaints...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center">
              <p className="text-red-400">{error}</p>

              <Link
                to="/login"
                className="mt-4 inline-block font-semibold text-emerald-400 hover:underline"
              >
                Go to Login
              </Link>
            </div>
          ) : complaints.length === 0 ? (
            <div className="rounded-xl border border-slate-700 p-8 text-center">
              <p className="text-slate-300">
                No complaints reported yet.
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Submit your first civic issue to see it here.
              </p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="rounded-xl border border-slate-700 p-8 text-center">
              <Search
                size={30}
                className="mx-auto mb-3 text-slate-500"
              />

              <p className="text-slate-300">
                No matching complaints found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredComplaints.map((complaint) => (
                <IssueCard
                  key={complaint.backendId}
                  complaint={complaint}
                />
              ))}
            </div>
          )}

        </section>
      </main>
    </div>
  )
}

export default Dashboard
