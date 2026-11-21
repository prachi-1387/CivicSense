import AnalyticsDashboard from '../components/AnalyticsDashboard'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  MapPin,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'

import {
  getAllComplaints,
  updateComplaintStatus,
} from '../services/complaintService'

const STATUS_LABELS = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

const STATUS_OPTIONS = [
  'submitted',
  'under_review',
  'assigned',
  'in_progress',
  'resolved',
]

function AdminDashboard() {
  const [complaints, setComplaints] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Load complaints from the actual backend
  async function loadComplaints() {
    setLoading(true)
    setError('')

    try {
      const data = await getAllComplaints()

      if (!Array.isArray(data)) {
        throw new Error('Unexpected complaint response from server')
      }

      setComplaints(data)
    } catch (err) {
      setError(err.message || 'Unable to load complaints')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComplaints()
  }, [])

  // Update complaint status through FastAPI
  async function handleStatusChange(id, newStatus) {
    setError('')
    setMessage('')
    setUpdatingId(id)

    try {
      const result = await updateComplaintStatus(
        id,
        newStatus
      )

      setComplaints((current) =>
        current.map((complaint) =>
          complaint.complaint_id === id
            ? {
                ...complaint,
                status: result.new_status || newStatus,
                assigned_department:
                  result.assigned_department ??
                  complaint.assigned_department,
              }
            : complaint
        )
      )

      setMessage(
        `Complaint #${id} updated to ${STATUS_LABELS[newStatus]}.`
      )
    } catch (err) {
      setError(err.message || 'Unable to update complaint status')
    } finally {
      setUpdatingId(null)
    }
  }

  // Statistics
  const total = complaints.length

  const pending = complaints.filter((c) =>
    ['submitted', 'under_review', 'assigned'].includes(c.status)
  ).length

  const inProgress = complaints.filter(
    (c) => c.status === 'in_progress'
  ).length

  const resolved = complaints.filter(
    (c) => c.status === 'resolved'
  ).length

  const categories = [
    ...new Set(
      complaints.map((c) => c.category).filter(Boolean)
    ),
  ]

  // Search and filtering
  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase()

    const matchesSearch = [
      complaint.complaint_id,
      complaint.title,
      complaint.category,
      complaint.location,
      complaint.assigned_department,
    ].some((value) =>
      String(value || '').toLowerCase().includes(searchText)
    )

    const matchesStatus =
      statusFilter === 'All' ||
      complaint.status === statusFilter

    const matchesCategory =
      categoryFilter === 'All' ||
      complaint.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const statCards = [
    {
      title: 'Total Complaints',
      value: total,
      icon: FileText,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      title: 'Pending',
      value: pending,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'In Progress',
      value: inProgress,
      icon: AlertCircle,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Resolved',
      value: resolved,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={28} />
              <h1 className="text-3xl font-bold">
                Admin Dashboard
              </h1>
            </div>

            <p className="mt-2 text-slate-400">
              Monitor and manage all civic complaints.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadComplaints}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-emerald-400 hover:text-emerald-400 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <Link
              to="/dashboard"
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-emerald-400 hover:text-emerald-400"
            >
              User Dashboard
            </Link>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            {message}
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-slate-600"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      {card.title}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold">
                      {card.value}
                    </h2>
                  </div>

                  <div className={`rounded-xl p-3 ${card.bg} ${card.color}`}>
                    <Icon size={25} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />

        {/* Complaint Management */}
        <section className="mt-10">
          <h2 className="text-xl font-bold">
            Complaint Management
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Review complaints and update their status.
          </p>

          {/* Search and Filters */}
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search complaints..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm outline-none focus:border-emerald-400"
            >
              <option value="All">All Statuses</option>

              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 p-3 text-sm outline-none focus:border-emerald-400"
            >
              <option value="All">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Complaint List */}
          <div className="mt-6 space-y-4">

            {loading ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
                Loading complaints from CivicSense...
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
                <FileText
                  size={40}
                  className="mx-auto text-slate-500"
                />

                <h3 className="mt-4 text-lg font-semibold">
                  No complaints found
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <div
                  key={complaint.complaint_id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-600"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-emerald-400">
                        Complaint #{complaint.complaint_id}
                      </p>

                      <h3 className="mt-2 text-lg font-bold">
                        {complaint.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {complaint.category || 'Uncategorized'}
                        {' · '}
                        Priority: {complaint.priority_level || 'Not assigned'}
                        {' · '}
                        Urgency: {complaint.urgency_score ?? 'N/A'}
                      </p>

                      <p className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                        <MapPin size={16} />
                        {complaint.location || 'Location unavailable'}
                      </p>

                      {complaint.assigned_department && (
                        <p className="mt-2 text-xs text-slate-500">
                          Department: {complaint.assigned_department}
                        </p>
                      )}

                      {complaint.created_at && (
                        <p className="mt-2 text-xs text-slate-500">
                          Submitted:{' '}
                          {new Date(complaint.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={complaint.status || 'submitted'}
                        disabled={
                          updatingId === complaint.complaint_id
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            complaint.complaint_id,
                            e.target.value
                          )
                        }
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm outline-none focus:border-emerald-400 disabled:opacity-50"
                      >
                        <option value="submitted" disabled>
                          Submitted
                        </option>

                        {STATUS_OPTIONS
                          .filter((status) => status !== 'submitted')
                          .map((status) => (
                            <option key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </option>
                          ))}
                      </select>
                    </div>

                  </div>
                </div>
              ))
            )}

          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard
