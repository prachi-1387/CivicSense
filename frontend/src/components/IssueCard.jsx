import { Link } from 'react-router-dom'
import {
  MapPin,
  CalendarDays,
  FileText,
  ArrowUpRight,
} from 'lucide-react'

function IssueCard({ complaint }) {
  const statusStyles = {
  Submitted: 'bg-amber-50 text-amber-700 ring-amber-200',
  'Under Review': 'bg-blue-50 text-blue-700 ring-blue-200',
  Assigned: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'In Progress': 'bg-blue-50 text-blue-700 ring-blue-200',
  Resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  }
  const complaintDate = complaint.createdAt || complaint.date

  const formattedDate = complaintDate
    ? new Date(complaintDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Date unavailable'

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <FileText size={18} />
            </span>

            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {complaint.id}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-emerald-700">
            {complaint.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {complaint.category}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
            statusStyles[complaint.status] ||
            'bg-slate-100 text-slate-700 ring-slate-200'
          }`}
        >
          {complaint.status || 'Pending'}
        </span>
      </div>

      {/* Complaint details */}
      <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <MapPin size={17} className="mt-0.5 shrink-0 text-emerald-600" />
          <span>{complaint.location || 'Location unavailable'}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <CalendarDays size={17} className="shrink-0 text-emerald-600" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs font-medium text-slate-400">
          CivicSense Complaint
        </span>

        <Link
        to={`/complaint/${complaint.backendId}`}
         className="flex items-center gap-1 text-xs font-semibold text-emerald-600 transition-transform group-hover:translate-x-1"
         >
        View details <ArrowUpRight size={15} />
        </Link>
      </div>

    </div>
  )
}

export default IssueCard
