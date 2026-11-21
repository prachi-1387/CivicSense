
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  FileText,
  AlertCircle,
  ShieldCheck,
  Clock,
} from 'lucide-react'

import { getMyComplaints } from '../services/complaintService'

const STATUS_LABELS = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

function ComplaintDetails() {
  const { id } = useParams()

  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadComplaint() {
      setLoading(true)
      setError('')

      try {
        const data = await getMyComplaints()

        // Supports both numeric IDs and display IDs like CS-12
        const numericId = String(id).replace(/^CS-/i, '')

        const foundComplaint = data.find(
          (item) =>
            String(item.complaint_id) === numericId
        )

        if (!foundComplaint) {
          throw new Error(
            'Complaint not found or you do not have access to it.'
          )
        }

        if (active) {
          setComplaint(foundComplaint)
        }

      } catch (err) {
        if (active) {
          setError(
            err.message || 'Unable to load complaint details.'
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadComplaint()

    return () => {
      active = false
    }
  }, [id])

  const formattedDate = complaint?.created_at
    ? new Date(complaint.created_at).toLocaleString('en-IN')
    : 'Date unavailable'

  const statusLabel = complaint
    ? STATUS_LABELS[complaint.status] || complaint.status
    : ''

  const statusStyles = {
    submitted: 'bg-amber-500/10 text-amber-400',
    under_review: 'bg-blue-500/10 text-blue-400',
    assigned: 'bg-indigo-500/10 text-indigo-400',
    in_progress: 'bg-cyan-500/10 text-cyan-400',
    resolved: 'bg-emerald-500/10 text-emerald-400',
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-12">

        <Link
          to="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-emerald-400 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">
            Loading complaint details...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <AlertCircle
              size={45}
              className="mx-auto text-red-400"
            />

            <h1 className="mt-4 text-2xl font-bold">
              Complaint Not Found
            </h1>

            <p className="mt-2 text-slate-400">
              {error}
            </p>

            <Link
              to="/dashboard"
              className="mt-6 inline-block text-emerald-400 hover:underline"
            >
              Return to Dashboard
            </Link>

            {error.toLowerCase().includes('log in') && (
              <Link
                to="/login"
                className="ml-4 inline-block text-emerald-400 hover:underline"
              >
                Login
              </Link>
            )}
          </div>
        ) : complaint ? (

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4">

              <div>
                <p className="text-sm text-slate-400">
                  Complaint ID
                </p>

                <h1 className="mt-1 text-2xl font-bold">
                  CS-{complaint.complaint_id}
                </h1>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  statusStyles[complaint.status] ||
                  'bg-slate-700 text-slate-300'
                }`}
              >
                {statusLabel}
              </span>

            </div>

            {/* Complaint Description */}
            <div className="mt-8 border-t border-slate-800 pt-6">

              <h2 className="text-xl font-bold">
                {complaint.title}
              </h2>

              <p className="mt-3 whitespace-pre-wrap text-slate-400">
                {complaint.description}
              </p>

            </div>

            {/* Complaint Information */}
            <div className="mt-8 grid gap-6 border-t border-slate-800 pt-6 sm:grid-cols-2">

              <div>
                <p className="text-sm text-slate-400">
                  Category
                </p>

                <p className="mt-1 font-semibold">
                  {complaint.category || 'Not assigned'}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Priority
                </p>

                <p className="mt-1 font-semibold">
                  {complaint.priority_level || 'Not assigned'}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin size={16} />
                  Location
                </p>

                <p className="mt-1 font-semibold">
                  {complaint.location || 'Not available'}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm text-slate-400">
                  <CalendarDays size={16} />
                  Submitted
                </p>

                <p className="mt-1 font-semibold">
                  {formattedDate}
                </p>
              </div>

              <div>
                <p className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock size={16} />
                  Urgency Score
                </p>

                <p className="mt-1 font-semibold text-emerald-400">
                  {complaint.urgency_score ?? 0}/100
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Assigned Department
                </p>

                <p className="mt-1 font-semibold">
                  {complaint.assigned_department || 'Not assigned yet'}
                </p>
              </div>

            </div>

            {/* Issue Assessment */}
            <div className="mt-8 border-t border-slate-800 pt-6">

              <h3 className="flex items-center gap-2 font-bold">
                <ShieldCheck
                  size={19}
                  className="text-emerald-400"
                />
                Issue Assessment
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-4">

                {[
                  ['Severity', complaint.severity],
                  ['Public Impact', complaint.public_impact],
                  ['Safety Risk', complaint.safety_risk],
                  ['Duration', complaint.duration],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-800 bg-slate-800/50 p-4"
                  >
                    <p className="text-sm text-slate-400">
                      {label}
                    </p>

                    <p className="mt-2 text-xl font-bold">
                      {value ?? 'N/A'}
                      {value !== null && value !== undefined ? '/100' : ''}
                    </p>
                  </div>
                ))}

              </div>
            </div>

            {/* AI Urgency Explanation */}
            {complaint.urgency_explanation?.overall_summary && (
              <div className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">

                <h3 className="font-bold text-emerald-400">
                  AI Urgency Analysis
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {complaint.urgency_explanation.overall_summary}
                </p>

              </div>
            )}

            {/* Information */}
            <div className="mt-8 border-t border-slate-800 pt-6">

              <h3 className="flex items-center gap-2 font-bold">
                <FileText
                  size={18}
                  className="text-emerald-400"
                />
                Complaint Information
              </h3>

              <p className="mt-3 text-sm text-slate-400">
                Your complaint is stored in the CivicSense database.
                Its current status is updated by the administration.
              </p>

            </div>

          </div>

        ) : null}

      </main>
    </div>
  )
}

export default ComplaintDetails
