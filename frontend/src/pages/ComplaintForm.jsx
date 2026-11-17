
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Button from '../components/Button'
import MapPicker from '../components/MapPicker'

function ComplaintForm() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    priority: '',
  })

  const [selectedLocation, setSelectedLocation] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [complaintId, setComplaintId] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  function handleChange(e) {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setSubmitted(false)
    setComplaintId('')
  }

  function handleImageChange(e) {
    const file = e.target.files[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5 MB.')
      return
    }

    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (
      !formData.title.trim() ||
      !formData.category ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !formData.priority
    ) {
      alert('Please fill in all fields before submitting.')
      return
    }

    if (!selectedLocation) {
      alert('Please select the issue location on the map.')
      return
    }

    const newId =
      'CS-' + Math.floor(1000 + Math.random() * 9000)

    const newComplaint = {
      ...formData,
      id: newId,
      imageName: image?.name || null,
      latitude: selectedLocation.lat ?? null,
      longitude: selectedLocation.lng ?? null,
      status: 'Pending',

      // Save date in ISO format for reliable date parsing
      createdAt: new Date().toISOString(),
    }

    try {
      const existingComplaints = JSON.parse(
        localStorage.getItem('civicsenseComplaints') || '[]'
      )

      if (!Array.isArray(existingComplaints)) {
        throw new Error('Invalid complaint data in Local Storage')
      }

      existingComplaints.push(newComplaint)

      localStorage.setItem(
        'civicsenseComplaints',
        JSON.stringify(existingComplaints)
      )

      setComplaintId(newId)
      setSubmitted(true)

      console.log('Complaint Details:', newComplaint)

      setImage(null)
      setImagePreview('')

    } catch (error) {
      console.error('Complaint saving error:', error)
      alert('Unable to save complaint. Please try again.')
    }
  }

  function removeImage() {
    setImage(null)
    setImagePreview('')
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
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-emerald-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-2 block font-medium">
              Select Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-emerald-400"
            >
              <option value="">Choose a category</option>
              <option value="Roads">Roads & Infrastructure</option>
              <option value="Waste">Waste Management</option>
              <option value="Water">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Drainage">Drainage</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="mb-2 block font-medium">
              Select Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-emerald-400"
            >
              <option value="">Choose priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
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
              required
              rows="5"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white outline-none focus:border-emerald-400"
            />
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
                Selected coordinates: {selectedLocation.lat.toFixed(5)},
                {' '}{selectedLocation.lng.toFixed(5)}
              </p>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="mb-2 block font-medium">
              Upload Issue Photo (Optional)
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
            />

            {imagePreview && (
              <div className="mt-4">
                <p className="mb-2 text-sm text-slate-400">
                  Image Preview:
                </p>

                <img
                  src={imagePreview}
                  alt="Issue Preview"
                  className="h-48 w-full rounded-lg border border-slate-700 object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="mt-3 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"
                >
                  Remove Photo
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Submit Complaint
          </Button>

          {/* Success Message */}
          {submitted && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-5 text-center text-emerald-400">

              <p className="text-lg font-bold">
                Complaint submitted successfully! 🎉
              </p>

              <p className="mt-3 text-sm">
                Your Complaint ID:
              </p>

              <p className="mt-1 text-2xl font-bold">
                {complaintId}
              </p>

              <div className="mt-4 space-y-2 text-sm text-slate-200">
                <p>Category: {formData.category}</p>
                <p>Priority: {formData.priority}</p>
              </div>

              <p className="mt-4 text-sm">
                Save your Complaint ID to track your complaint later.
              </p>
            </div>
          )}

        </form>

      </main>

    </div>
  )
}

export default ComplaintForm
