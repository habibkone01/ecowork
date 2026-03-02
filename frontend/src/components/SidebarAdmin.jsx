import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Building2, Monitor, Calendar, Users, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

export default function SidebarAdmin() {
    const location = useLocation()
    const { logout } = useAuth()

    const isActive = (path) => location.pathname === path

    return (
        <aside className="fixed left-0 top-0 bottom-0 z-50 flex flex-col w-65 min-h-screen bg-[#1a1a2e]">

            {/* Logo */}
            <div className="p-6 border-b border-[#ffffff14]">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="EcoWork" className="h-8" />
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#7bdff233] text-[#7bdff2]">ADMIN</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                <Link to="/admin/dashboard"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all no-underline ${isActive('/admin/dashboard') ? 'bg-[#7bdff226] text-[#7bdff2] font-semibold' : 'text-[#ffffff8c]'}`}>
                    <LayoutDashboard size={16} />
                    Dashboard
                </Link>
                <div className="text-xs font-semibold uppercase tracking-wider mt-4 mb-2 px-4 text-[#ffffff40]">Gestion</div>
                <Link to="/admin/espaces"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all no-underline ${isActive('/admin/espaces') ? 'bg-[#7bdff226] text-[#7bdff2] font-semibold' : 'text-[#ffffff8c]'}`}>
                    <Building2 size={16} />
                    Espaces
                </Link>
                <Link to="/admin/equipements"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all no-underline ${isActive('/admin/equipements') ? 'bg-[#7bdff226] text-[#7bdff2] font-semibold' : 'text-[#ffffff8c]'}`}>
                    <Monitor size={16} />
                    Équipements
                </Link>
                <Link to="/admin/reservations"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all no-underline ${isActive('/admin/reservations') ? 'bg-[#7bdff226] text-[#7bdff2] font-semibold' : 'text-[#ffffff8c]'}`}>
                    <Calendar size={16} />
                    Réservations
                </Link>
                <Link to="/admin/utilisateurs"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all no-underline ${isActive('/admin/utilisateurs') ? 'bg-[#7bdff226] text-[#7bdff2] font-semibold' : 'text-[#ffffff8c]'}`}>
                    <Users size={16} />
                    Utilisateurs
                </Link>
            </nav>

            {/* Admin + logout */}
            <div className="p-4 border-t border-[#ffffff14]">
                <div className="flex items-center gap-3 p-3 rounded-xl mb-3 bg-[#ffffff0d]">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[#7bdff233]">
                        <Shield size={16} className="text-[#7bdff2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">Admin GreenSpace</div>
                        <div className="text-xs truncate text-[#7bdff2]">Administrateur</div>
                    </div>
                </div>
                <button onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all bg-transparent border-none cursor-pointer text-[#ef444499]">
                    <LogOut size={16} />
                    Se déconnecter
                </button>
            </div>
        </aside>
    )
}