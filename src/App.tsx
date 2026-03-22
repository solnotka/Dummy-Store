import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { GoodsPage } from './pages/Goods/GoodsPage'
import { LoginPage } from './pages/Login/LoginPage'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { logoutUser } from './store/slices/userSlice'

function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useAppSelector((s) => s.user)
  if (status === 'restoring') return null
  return children
}

function RootRedirect() {
  const { isAuthenticated } = useAppSelector((s) => s.user)
  return <Navigate to={isAuthenticated ? '/goods' : '/login'} replace />
}

function GuestLogin() {
  const { isAuthenticated } = useAppSelector((s) => s.user)
  if (isAuthenticated) {
    return <Navigate to="/goods" replace />
  }
  return <LoginPage />
}

function RequireAuth() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, name } = useAppSelector((s) => s.user)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="app-authed">
      <header className="app-header">
        <span className="app-header__name">{name}</span>
        <button type="button" className="app-header__logout" onClick={() => dispatch(logoutUser())}>
          Выйти
        </button>
      </header>
      <main className="app-authed__main">
        <GoodsPage />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthGate>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<GuestLogin />} />
        <Route path="/goods" element={<RequireAuth />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </AuthGate>
  )
}
