
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import IssueCardDemo from './pages/IssueCardDemo'
import Dashboard from './pages/Dashboard'
import ComplaintForm from './pages/ComplaintForm'
import ComplaintDetails from './pages/ComplaintDetails'
import AdminDashboard from './pages/AdminDashboard'

// Read the current browser session
function getCurrentUser() {
  const token = sessionStorage.getItem('civicsenseToken')
  const storedUser = sessionStorage.getItem('civicsenseUser')

  if (!token || !storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    return null
  }
}

// Protect pages that require login
function RequireAuth({ children }) {
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Protect pages based on user role
function RequireRole({ role, children }) {
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== role) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin' : '/dashboard'}
        replace
      />
    )
  }

  return children
}

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/complaints-demo" element={<IssueCardDemo />} />

      {/* Citizen-only pages */}
      <Route
        path="/dashboard"
        element={
         <RequireAuth>
         <Dashboard />
         </RequireAuth>
       }
      />

      <Route
        path="/complaint-form"
        element={
          <RequireRole role="citizen">
            <ComplaintForm />
          </RequireRole>
        }
      />

      <Route
        path="/complaint/:id"
        element={
          <RequireRole role="citizen">
            <ComplaintDetails />
          </RequireRole>
        }
      />

      {/* Admin-only page */}
      <Route
        path="/admin"
        element={
          <RequireRole role="admin">
            <AdminDashboard />
          </RequireRole>
        }
      />

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
