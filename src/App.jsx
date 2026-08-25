import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage/LoginPage'
import { ProfilesPage } from './pages/ProfilesPage/ProfilesPage'
import { NewProfilePage } from './pages/NewProfilePage/NewProfilePage'
import { HomePage } from './pages/HomePage/HomePage'
import { SeriesDetailPage } from './pages/SeriesDetailPage/SeriesDetailPage'
import { SeriesPage } from './pages/SeriesPage/SeriesPage'
import { WatchPage } from './pages/WatchPage/WatchPage'
import { PlaceholderPage } from './pages/PlaceholderPage/PlaceholderPage'
import { RequireAuth } from './routes/RequireAuth'

function RootRedirect() {
  const isAuthenticated = Boolean(localStorage.getItem('token'))
  return <Navigate to={isAuthenticated ? '/profiles' : '/login'} replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/profiles"
        element={
          <RequireAuth>
            <ProfilesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/profiles/new"
        element={
          <RequireAuth>
            <NewProfilePage />
          </RequireAuth>
        }
      />
      <Route
        path="/home"
        element={
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        }
      />
      <Route
        path="/series"
        element={
          <RequireAuth>
            <SeriesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/series/:id"
        element={
          <RequireAuth>
            <SeriesDetailPage />
          </RequireAuth>
        }
      />
      <Route
        path="/watch/:id"
        element={
          <RequireAuth>
            <WatchPage />
          </RequireAuth>
        }
      />
      <Route
        path="/minha-lista"
        element={
          <RequireAuth>
            <PlaceholderPage title="Minha lista" />
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default App
