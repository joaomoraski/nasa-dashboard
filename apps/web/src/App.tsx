import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import ApodPage from './pages/ApodPage'
import { Navigation } from './components/Navigation'
import AsteroidsPage from './pages/AsteroidsPage'

function App() {
  return (
    <div style={{ padding: 16 }}>
      <Navigation />
      <hr/>
      <Routes>
        <Route path="/" element={<Navigate to="/apod" replace />}/>
        <Route path="/apod" element={<ApodPage />}/>
        <Route path="/asteroids" element={<AsteroidsPage />}/>
      </Routes>
    </div>
  )
}

export default App
