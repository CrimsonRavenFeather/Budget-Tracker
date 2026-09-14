import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { logout } = useAuth()

  return (
    <div className="top-nav">
      <div className="brand">Ledger</div>
      <div className="tabs">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Dashboard
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => (isActive ? 'active' : '')}>
          Transactions
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
          Buckets &amp; categories
        </NavLink>
      </div>
      <button className="signout" onClick={logout}>
        Sign out
      </button>
    </div>
  )
}
