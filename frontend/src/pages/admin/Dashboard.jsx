import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, CalendarCheck, Users, TrendingUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEspaces } from '../../api/espaces'
import { getReservations } from '../../api/reservations'
import { getUsers } from '../../api/user'
import SidebarAdmin from '../../components/SidebarAdmin'

export default function Dashboard() {
    const { token, user } = useAuth()
    const [stats, setStats] = useState({ espaces: 0, reservations: 0, users: 0, revenus: 0 })
    const [reservationsRecentes, setReservationsRecentes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [espacesData, reservationsData, usersData] = await Promise.all([
                    getEspaces(token),
                    getReservations(token),
                    getUsers(token)
                ])

                const reservations = reservationsData.data || []
                const revenus = reservations
                    .filter(r => r.statut === 'confirmée')
                    .reduce((acc, r) => acc + parseFloat(r.prix_total || 0), 0)

                setStats({
                    espaces: espacesData.meta?.total || espacesData.data?.length || 0,
                    reservations: reservationsData.meta?.total || reservations.length,
                    users: usersData.meta?.total || usersData.data?.length || 0,
                    revenus
                })
                setReservationsRecentes(reservations.slice(0, 5))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    return (
        <div className="flex">
            <SidebarAdmin />
            <main className="ml-65 flex-1 min-h-screen bg-gray-50 p-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Bonjour, {user?.prenom} </h1>
                    <p className="text-gray-500 text-sm">Voici un aperçu de votre plateforme EcoWork</p>
                </div>

                <div className="grid grid-cols-4 gap-5 mb-8">
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#eff7f6]">
                                <Building2 size={20} className="text-[#0d9488]" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-[#1a1a2e] mb-1">{stats.espaces}</div>
                        <div className="text-sm text-gray-400">Espaces</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#eff7f6]">
                                <CalendarCheck size={20} className="text-[#7bdff2]" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-[#1a1a2e] mb-1">{stats.reservations}</div>
                        <div className="text-sm text-gray-400">Réservations</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#eff7f6]">
                                <Users size={20} className="text-[#0d9488]" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-[#1a1a2e] mb-1">{stats.users}</div>
                        <div className="text-sm text-gray-400">Utilisateurs</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#eff7f6]">
                                <TrendingUp size={20} className="text-[#7bdff2]" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-[#1a1a2e] mb-1">
                            {stats.revenus >= 1000 ? `${(stats.revenus / 1000).toFixed(1)}k€` : `${stats.revenus}€`}
                        </div>
                        <div className="text-sm text-gray-400">Revenus</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">

                    <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold text-[#1a1a2e]">Réservations récentes</h2>
                            <Link to="/admin/reservations" className="text-sm font-medium text-[#7bdff2] hover:underline no-underline">Voir tout</Link>
                        </div>
                        {loading ? (
                            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Chargement...</div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Utilisateur</th>
                                        <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Espace</th>
                                        <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Dates</th>
                                        <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Statut</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {reservationsRecentes.map((r) => (
                                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-sm font-medium text-[#1a1a2e]">{r.user?.prenom} {r.user?.nom}</td>
                                            <td className="p-4 text-sm text-gray-500">{r.espace?.nom}</td>
                                            <td className="p-4 text-sm text-gray-500">{r.date_debut} → {r.date_fin}</td>
                                            <td className="p-4">
                                                {r.statut === 'confirmée' ? (
                                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#eff7f6] text-[#0d9488] border border-[#b2f7ef]">Confirmée</span>
                                                ) : (
                                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-100">Annulée</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="p-5 border-b border-gray-100">
                            <h2 className="font-bold text-[#1a1a2e]">Accès rapide</h2>
                        </div>
                        <div className="p-5 space-y-3">
                            <Link to="/admin/espaces/creer" className="flex items-center gap-3 p-3 rounded-xl bg-[#eff7f6] hover:bg-[#b2f7ef26] transition-colors no-underline">
                                <Building2 size={18} className="text-[#0d9488]" />
                                <span className="text-sm font-medium text-[#1a1a2e]">Ajouter un espace</span>
                            </Link>
                            <Link to="/admin/equipements/creer" className="flex items-center gap-3 p-3 rounded-xl bg-[#eff7f6] hover:bg-[#b2f7ef26] transition-colors no-underline">
                                <CalendarCheck size={18} className="text-[#0d9488]" />
                                <span className="text-sm font-medium text-[#1a1a2e]">Ajouter un équipement</span>
                            </Link>
                            <Link to="/admin/utilisateurs" className="flex items-center gap-3 p-3 rounded-xl bg-[#eff7f6] hover:bg-[#b2f7ef26] transition-colors no-underline">
                                <Users size={18} className="text-[#0d9488]" />
                                <span className="text-sm font-medium text-[#1a1a2e]">Gérer les utilisateurs</span>
                            </Link>
                            <Link to="/admin/reservations" className="flex items-center gap-3 p-3 rounded-xl bg-[#eff7f6] hover:bg-[#b2f7ef26] transition-colors no-underline">
                                <TrendingUp size={18} className="text-[#7bdff2]" />
                                <span className="text-sm font-medium text-[#1a1a2e]">Voir les réservations</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}