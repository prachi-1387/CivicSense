
import { useState } from 'react'
import Navbar from '../components/Navbar'
import MapPicker from '../components/MapPicker'
import { submitComplaint } from '../services/complaintService'

const initialScores = {
  severity: 50,
  public_impact: 50,
  safety_risk: 50,
  duration: 50,
}

const scoreFields = [
  {
    key: 'severity',
    label: 'Issue Severity',
    description: 'How serious is the damage or problem?',
  },
  {
    key: 'public_impact',
    label: 'Public Impact',
    description: 'How many people are affected by this issue?',
  },
  {
    key: 'safety_risk',
    label: 'Safety Risk',
    description: 'How much danger does this issue create?',
  },
  {
    key: 'duration',
    label: 'Issue Duration',
    description: 'How long has this issue continued?',
  },
]

function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
  })

  const [scores, setScores] = useState(initialScores)
  const [selectedLocation, setSelectedLocation] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError('')
    setResult(null)
  }

  function handleScoreChange(e) {
    const { name, value } = e.target

    setScores((prev) => ({
      ...prev,
      [name]: Number(value),
    }))

    setResult(null)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    setError('')
    setResult(null)

    if (!selectedLocation) {
      setError('Please select the issue location on the map.')
      return
    }

    if (
      !formData.location.trim() ||
      formData.location.trim().length < 3
    ) {
      setError('Please enter a valid issue location.')
      return
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      severity: scores.severity,
      public_impact: scores.public_impact,
      safety_risk: scores.safety_risk,
      duration: scores.duration,
    }

    setLoading(true)

    try {
      const response = await submitComplaint(payload)

      setResult(response)

      setFormData({
        title: '',
        description: '',
        location: '',
      })

      setScores(initialScores)
      setSelectedLocation(null)

    } catch (err) {
      setError(
        err.message || 'Unable to submit complaint. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-12">

        <h1 className="text-3xl font-bold">
          Report a Civic Issue
        </h1>

        <p className="mt-2 text-slate-400">
          Help us make your neighbourhood better.
          Describe the problem below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-slate-800 bg-slate-900 p-6"
        >

          {/* Complaint Title */}
          <div>
            <label className="mb-2 block font-medium">
              Complaint Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Pothole near main road"
              minLength={5}
              maxLength={150}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-emerald-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the civic issue in detail..."
              minLength={10}
              required
              rows={5}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-emerald-400"
            />
          </div>

          {/* AI Assessment Inputs */}
          <div className="space-y-6 rounded-xl border border-slate-700 bg-slate-800/50 p-5">

            <div>
              <h2 className="text-lg font-semibold">
                Issue Assessment
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Rate each factor from 0 to 100. The AI will use
                these values to calculate complaint urgency.
              </p>
            </div>

            {scoreFields.map((field) => (
              <div key={field.key}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor={field.key}
                    className="font-medium"
                  >
                    {field.label}
                  </label>

                  <span className="font-bold text-emerald-400">
                    {scores[field.key]}/100
                  </span>
                </div>

                <input
                  id={field.key}
                  type="range"
                  name={field.key}
                  min="0"
                  max="100"
                  step="1"
                  value={scores[field.key]}
                  onChange={handleScoreChange}
                  className="w-full accent-emerald-400"
                />

                <p className="mt-1 text-xs text-slate-400">
                  {field.description}
                </p>

                <div className="mt-1 flex justify-between text-xs text-slate-500">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            ))}

          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block font-medium">
              Issue Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter area, street or landmark"
              minLength={3}
              maxLength={255}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-emerald-400"
            />
          </div>

          {/* Map Location Picker */}
          <div className="space-y-3">
            <label className="block font-medium">
              Pinpoint Issue Location on Map
            </label>

            <MapPicker
              onLocationSelect={(location) => {
                setSelectedLocation(location)
                setError('')
                setResult(null)

                if (
                  location.address &&
                  location.address !== 'Fetching address...' &&
                  location.address !== 'Address not found' &&
                  location.address !== 'Address could not be detected'
                ) {
                  setFormData((prev) => ({
                    ...prev,
                    location: location.address,
                  }))
                }
              }}
            />

            {selectedLocation && (
              <p className="text-sm text-emerald-400">
                Selected coordinates:{' '}
                {selectedLocation.lat.toFixed(5)},
                {' '}
                {selectedLocation.lng.toFixed(5)}
              </p>
            )}
          </div>

          {/* Backend Error */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Submitting Complaint...' : 'Submit Complaint'}
          </button>

          {/* Success Message */}
          {result && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-400">

              <p className="text-lg font-bold">
                Complaint submitted successfully! 🎉
              </p>

              <p className="mt-3 text-sm">
                Your Complaint ID:
              </p>

              <p className="mt-1 text-2xl font-bold">
                CS-{result.complaint_id}
              </p>

              <div className="mt-4 space-y-2 text-sm text-slate-200">
                <p>
                  Category: {result.category}
                </p>

                <p>
                  Priority: {result.priority_level}
                </p>

                <p>
                  Urgency Score: {result.urgency_score}/100
                </p>

                <p>
                  Status: {result.status}
                </p>
              </div>

              {result.urgency_explanation?.overall_summary && (
                <p className="mt-4 text-sm text-slate-300">
                  {result.urgency_explanation.overall_summary}
                </p>
              )}

              <p className="mt-4 text-sm">
                Your complaint has been recorded in CivicSense.
              </p>
            </div>
          )}

        </form>
      </main>
    </div>
  )
}

export default ComplaintForm
