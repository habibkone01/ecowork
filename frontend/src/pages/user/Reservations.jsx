import { useState, useEffect } from 'react'
import { CalendarCheck, CalendarX, Euro } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getReservations, deleteReservation } from '../../api/reservations'
import SidebarUser from '../../components/SidebarUser'

export default function Reservations() {
    const { token } = useAuth()
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchReservations()
    }, [])

    const fetchReservations = async () => {
        try {
            const data = await getReservations(token)
            setReservations(data.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleAnnuler = async (id) => {
        if (!confirm('Voulez-vous vraiment annuler cette réservation ?')) return
        await deleteReservation(token, id)
        fetchReservations()
    }

    const getNbJours = (debut, fin) => {
        const d1 = new Date(debut)
        const d2 = new Date(fin)
        return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) + 1
    }

    const confirmees = reservations.filter(r => r.statut === 'confirmée')
    const annulees = reservations.filter(r => r.statut === 'annulée')
    const total = confirmees.reduce((acc, r) => acc + parseFloat(r.prix_total || 0), 0)

    return (
        <div className="flex">
            <SidebarUser />
            <main className="ml-65 flex-1 min-h-screen bg-gray-50 p-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Mes réservations</h1>
                    <p className="text-gray-500 text-sm">Historique de toutes vos réservations</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#eff7f6]">
                                <CalendarCheck size={20} className="text-[#0d9488]" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-[#1a1a2e]">{confirmees.length}</div>
                                <div className="text-xs text-gray-400">Confirmées</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50">
                                <CalendarX size={20} className="text-red-500" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-[#1a1a2e]">{annulees.length}</div>
                                <div className="text-xs text-gray-400">Annulées</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#eff7f6]">
                                <Euro size={20} className="text-[#7bdff2]" />
                            </div>
                            <div>
                                <div className="text-xl font-bold text-[#1a1a2e]">{total}€</div>
                                <div className="text-xs text-gray-400">Total dépensé</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="font-bold text-[#1a1a2e]">Historique</h2>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-gray-400">Chargement...</div>
                    ) : reservations.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-400">Aucune réservation</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Espace</th>
                                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Date début</th>
                                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Date fin</th>
                                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Durée</th>
                                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Total</th>
                                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Statut</th>
                                    <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map((r) => (
                                    <tr key={r.id} className="border-t border-gray-50 hover:bg-gray-50 transition-all">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                                                    {r.espace?.images?.length > 0 ? (
                                                        <img src={r.espace.images[0].url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-100"></div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-sm text-[#1a1a2e]">{r.espace?.nom}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">{r.date_debut}</td>
                                        <td className="p-4 text-sm text-gray-500">{r.date_fin}</td>
                                        <td className="p-4 text-sm text-gray-500">{getNbJours(r.date_debut, r.date_fin)} jours</td>
                                        <td className="p-4 text-sm font-bold text-[#7bdff2]">{r.prix_total}€</td>
                                        <td className="p-4">
                                            {r.statut === 'confirmée' ? (
                                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#eff7f6] text-[#0d9488] border border-[#b2f7ef]">Confirmée</span>
                                            ) : (
                                                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">Annulée</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {r.statut === 'confirmée' ? (
                                                <button onClick={() => handleAnnuler(r.id)}
                                                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all">
                                                    Annuler
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-300">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    )
}