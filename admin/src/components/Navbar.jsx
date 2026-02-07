import { Link, NavLink } from 'react-router-dom'
import { Bars3Icon, XMarkIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const navItem = (to, label) => (
    <NavLink
      to={to}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `px-3 py-2 font-medium hover:text-brandAccent ${isActive ? 'text-brandBlue' : 'text-brandDark'}`
      }
    >
      {label}
    </NavLink>
  )

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
      <nav className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="AK Enterprises" className="h-14 md:h-16 object-contain" />
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {navItem('/', 'Dashboard')}
          {navItem('/products', 'Products')}
          {navItem('/orders', 'Orders')}
          
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t border-gray-100">
          <div className="container py-2 flex flex-col">
            {navItem('/', 'Dashboard')}
            {navItem('/products', 'Products')}
            {navItem('/orders', 'Orders')}
          </div>
        </div>
      )}
    </header>
  )
}

