import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import ApodPage from './pages/ApodPage'
import Layout from './components/Layout'
import AsteroidsPage from './pages/AsteroidsPage'
import NasaImagesPage from './pages/NasaImagesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import { AuthProvider } from './contexts/AuthContext'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './contexts/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/apod" replace />} />
          <Route path="/apod" element={<ApodPage />} />
          <Route path="/images" element={<NasaImagesPage />} />
          <Route path="/asteroids" element={<AsteroidsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
