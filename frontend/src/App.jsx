

import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import IssueCardDemo from './pages/IssueCardDemo'
import Dashboard from './pages/Dashboard'
import ComplaintForm from './pages/ComplaintForm'
import ComplaintDetails from './pages/ComplaintDetails'
import AdminDashboard from './pages/AdminDashboard'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/complaints-demo" element={<IssueCardDemo />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
          path="/complaint-form"
          element={<ComplaintForm />}
          />
      <Route
        path="/complaint/:id"
        element={<ComplaintDetails />}
        />
        <Route
         path="/admin"
         element={<AdminDashboard />}
        />
    </Routes>
    
  )
}

export default App
