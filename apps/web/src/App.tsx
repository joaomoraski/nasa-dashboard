import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import ApodPage from './pages/ApodPage'
import { Navigation } from './components/Navigation'

function App() {
  return (
    <div style={{ padding: 16 }}>
      <Navigation />
      <hr/>
      <Routes>
        <Route path="/" element={<Navigate to="/apod" replace />}/>
        <Route path="/apod" element={<ApodPage />}/>
      </Routes>
    </div>
  )
}

export default App
