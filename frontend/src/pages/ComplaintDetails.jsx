
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  FileText,
  AlertCircle,
} from 'lucide-react'

function ComplaintDetails() {
  const { id } = useParams()

    const [complaints, setComplaints] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem('civicsenseComplaints') || '[]'
      )
    } catch {
      return []
    }
  })

  const complaint = complaints.find(
    (item) => item.id === id
  )
 function handleStatusChange(e) {
  const newStatus = e.target.value

  const updatedComplaints = complaints.map((item) =>
    item.id === id
      ? { ...item, status: newStatus }
      : item
  )

  localStorage.setItem(
    'civicsenseComplaints',
    JSON.stringify(updatedComplaints)
  )

  setComplaints(updatedComplaints)
}
  if (!complaint) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <main className="mx-auto max-w-3xl px-6 py-16 text-center">
          <AlertCircle size={45} className="mx-auto text-red-400" />
          <h1 className="mt-4 text-2xl font-bold">
            Complaint Not Found
          </h1>
          <p className="mt-2 text-slate-400">
            We couldn't find this complaint.
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-block text-emerald-400 hover:underline"
          >
            Back to Dashboard
          </Link>
        </main>
      </div>
    )
  }

  const date = complaint.createdAt || complaint.date
  const formattedDate = date && !Number.isNaN(Date.parse(date))
    ? new Date(date).toLocaleString('en-IN')
    : 'Date unavailable'

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

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">
                Complaint ID
              </p>
              <h1 className="mt-1 text-2xl font-bold">
                {complaint.id}
              </h1>
            </div>

            
            <select
            value={complaint.status || 'Pending'}
            onChange={handleStatusChange}
            className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-white outline-none focus:border-emerald-400"
            >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <h2 className="text-xl font-bold">
              {complaint.title}
            </h2>

            <p className="mt-2 text-slate-400">
              {complaint.description}
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-400">Category</p>
              <p className="mt-1 font-semibold">{complaint.category}</p>
            </div>

            <div>
              <p className="text-sm text-slate-400">Priority</p>
              <p className="mt-1 font-semibold">{complaint.priority}</p>
            </div>

            <div>
              <p className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin size={16} /> Location
              </p>
              <p className="mt-1 font-semibold">
                {complaint.location || 'Not available'}
              </p>
            </div>

            <div>
              <p className="flex items-center gap-2 text-sm text-slate-400">
                <CalendarDays size={16} /> Submitted
              </p>
              <p className="mt-1 font-semibold">{formattedDate}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <h3 className="flex items-center gap-2 font-bold">
              <FileText size={18} className="text-emerald-400" />
              Location Coordinates
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Latitude: {complaint.latitude ?? 'Unavailable'}
            </p>
            <p className="text-sm text-slate-400">
              Longitude: {complaint.longitude ?? 'Unavailable'}
            </p>
          </div>

          {complaint.imageName && (
            <p className="mt-6 text-sm text-slate-400">
              Uploaded photo: {complaint.imageName}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default ComplaintDetails
