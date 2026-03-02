import { Link, useLocation } from 'react-router-dom'
import { Building2, Calendar, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

export default function SidebarUser() {
    const location = useLocation()
    const { user, logout } = useAuth()

    const isActive = (path) => location.pathname === path

    return (
        <aside className="fixed left-0 top-0 bottom-0 z-50 flex flex-col w-65 min-h-screen bg-[#1a1a2e]">

            {/* Logo */}
            <div className="p-6 border-b border-[#ffffff14]">
                <img src={logo} alt="EcoWork" className="h-8" />
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider mb-3 px-4 text-[#ffffff40]">Navigation</div>
                <Link to="/espaces"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all no-underline ${isActive('/espaces') ? 'bg-[#7bdff226] text-[#7bdff2] font-semibold' : 'text-[#ffffff8c]'}`}>
                    <Building2 size={16} />
                    Les espaces
                </Link>
                <Link to="/reservations"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all no-underline ${isActive('/reservations') ? 'bg-[#7bdff226] text-[#7bdff2] font-semibold' : 'text-[#ffffff8c]'}`}>
                    <Calendar size={16} />
                    Mes réservations
                </Link>
            </nav>

            {/* User + actions */}
            <div className="p-4 border-t border-[#ffffff14]">
                <div className="flex items-center gap-3 p-3 rounded-xl mb-3 bg-[#ffffff0d]">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[#7bdff233]">
                        <span className="text-sm font-bold text-[#7bdff2]">
                            {user?.prenom?.[0]}{user?.nom?.[0]}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{user?.prenom} {user?.nom}</div>
                        <div className="text-xs truncate text-[#ffffff59]">Collaborateur</div>
                    </div>
                </div>
                <Link to="/profil"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all no-underline mb-1 text-[#ffffff8c]">
                    <Settings size={16} />
                    Mon profil
                </Link>
                <button onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all bg-transparent border-none cursor-pointer text-[#ef444499]">
                    <LogOut size={16} />
                    Se déconnecter
                </button>
            </div>
        </aside>
    )
}