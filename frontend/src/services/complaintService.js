
const API_BASE_URL = 'http://127.0.0.1:8000'

async function apiRequest(endpoint, options = {}) {
  const token = sessionStorage.getItem('civicsenseToken')

  if (!token) {
    throw new Error('Please log in to continue.')
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.detail || `Request failed with status ${response.status}`
    )
  }

  return data
}

// Get all complaints (Admin only)
export function getAllComplaints() {
  return apiRequest('/complaints/')
}

// Update complaint status (Admin only)
export function updateComplaintStatus(id, status, note = '') {
  return apiRequest(`/complaints/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
      note: note || null,
    }),
  })
}

// Get complaints submitted by the logged-in citizen
export function getMyComplaints() {
  return apiRequest('/complaints/mine')
}
// Submit a new complaint
export function submitComplaint(complaintData) {
  return apiRequest('/complaints/', {
    method: 'POST',
    body: JSON.stringify(complaintData),
  })
}