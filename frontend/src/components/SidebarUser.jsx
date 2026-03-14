import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Building2, Calendar, Settings, LogOut, Menu, X, Leaf } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import logo from '../assets/logo.png'

export default function SidebarUser() {
    const location = useLocation()
    const { user, logout } = useAuth()
    const { lowCarbon, toggleLowCarbon } = useTheme()
    const [open, setOpen] = useState(false)

    const isActive = (path) => location.pathname === path

    const navLinks = [
        { to: '/espaces', icon: Building2, label: 'Les espaces' },
        { to: '/reservations', icon: Calendar, label: 'Mes réservations' },
        { to: '/profil', icon: Settings, label: 'Mon profil' },
    ]

    return (
        <>
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 pt-4">

                <div className="flex items-center justify-between px-5 py-3 rounded-full bg-[#1a1a2e] shadow-lg shadow-black/30">
                    <img src={logo} alt="EcoWork" className="h-6" />

                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#7bdff2]">
                            <span className="text-xs font-bold text-[#1a1a2e]">
                                {user?.prenom?.[0]}{user?.nom?.[0]}
                            </span>
                        </div>

                        <button onClick={() => setOpen(!open)} className="text-[#7bdff2] p-1" aria-label="Ouvrir le menu" >
                            {open ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {open && (
                    <>
                        <div className="mt-3 rounded-2xl bg-[#1a1a2e] shadow-xl shadow-black/40 overflow-hidden border border-[#ffffff14]">

                            <div className="px-7 py-4 border-b border-[#ffffff14]">
                                <div className="text-white text-sm font-medium">
                                    {user?.prenom} {user?.nom}
                                </div>
                                <div className="text-xs text-[#ffffffa0]">
                                    Collaborateur
                                </div>
                            </div>

                            <div className="px-3 py-3 space-y-1">
                                {navLinks.map(({ to, icon: Icon, label }) => (
                                    <Link  key={to} to={to}  onClick={() => setOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all no-underline ${isActive(to)  ? 'bg-[#7bdff24d] text-white font-semibold'   : 'text-[#ffffff8c] hover:bg-[#ffffff0d] hover:text-white' }`} >
                                        <Icon size={16} />
                                        {label}
                                    </Link>
                                ))}
                            </div>

                            <div className="border-t border-[#ffffff14] px-3 py-2">
                                <button  onClick={toggleLowCarbon} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-[#ffffff8c] bg-transparent border-none cursor-pointer hover:bg-[#ffffff0d]" >
                                    <span className="flex items-center gap-3">
                                        <Leaf size={16} />
                                        Mode Low Carbon
                                    </span>

                                    <div className={`w-10 h-5 rounded-full transition-colors relative ${lowCarbon ? 'bg-green-400' : 'bg-[#ffffff30]'}`}>
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${lowCarbon ? 'left-5' : 'left-0.5'}`} />
                                    </div>
                                </button>
                            </div>

                            <div className="border-t border-[#ffffff14] px-3 py-2">
                                <button onClick={() => { logout(); setOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#dc2626] bg-transparent border-none cursor-pointer hover:bg-[#ef444411]" >
                                    <LogOut size={16} />
                                    Se déconnecter
                                </button>
                            </div>
                        </div>

                        <div className="fixed inset-0 -z-10 bg-black/40" onClick={() => setOpen(false)} />
                    </>
                )}
            </div>

            <aside className="hidden lg:flex fixed left-2 top-3 bottom-3 z-50 flex-col w-64 rounded-xl bg-[#1a1a2e] shadow-xl shadow-black/30 border border-[#ffffff14]">

                <div className="p-6 border-b border-[#ffffff14]">
                    <img src={logo} alt="EcoWork" className="h-8" />
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <div className="text-xs font-semibold uppercase tracking-wider mb-3 px-4 text-[#ffffff80]">
                        Navigation
                    </div>

                    <Link to="/espaces"  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all no-underline ${isActive('/espaces')  ? 'bg-[#7bdff24d] text-white font-semibold'  : 'text-[#ffffff8c]'   }`} >
                        <Building2 size={16} />
                        Les espaces
                    </Link>

                    <Link to="/reservations" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all no-underline ${isActive('/reservations') ? 'bg-[#7bdff24d] text-white font-semibold' : 'text-[#ffffff8c]'}`} >
                        <Calendar size={16} />
                        Mes réservations
                    </Link>
                </nav>

                <div className="p-4 border-t border-[#ffffff14]">

                    <div className="flex items-center gap-3 p-3 rounded-xl mb-3 bg-[#ffffff0d]">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[#7bdff2]">
                            <span className="text-sm font-bold text-[#1a1a2e]">
                                {user?.prenom?.[0]}{user?.nom?.[0]}
                            </span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="text-white text-sm font-medium truncate">
                                {user?.prenom} {user?.nom}
                            </div>
                            <div className="text-xs truncate text-[#ffffffa0]">
                                Collaborateur
                            </div>
                        </div>
                    </div>

                    <Link  to="/profil" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all no-underline mb-1 text-[#ffffff8c]">
                        <Settings size={16} />
                        Mon profil
                    </Link>

                    <button onClick={toggleLowCarbon} className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all bg-transparent border-none cursor-pointer text-[#ffffff8c] mb-1">
                        <span className="flex items-center gap-3">
                            <Leaf size={16} />
                            Low Carbon
                        </span>

                        <div className={`w-10 h-5 rounded-full transition-colors relative ${lowCarbon ? 'bg-green-400' : 'bg-[#ffffff30]'}`}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${lowCarbon ? 'left-5' : 'left-0.5'}`} />
                        </div>
                    </button>

                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all bg-transparent border-none cursor-pointer text-[#dc2626]">
                        <LogOut size={16} />
                        Se déconnecter
                    </button>

                </div>
            </aside>
        </>
    )
}