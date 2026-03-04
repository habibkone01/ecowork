import { useState, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getReservations, deleteReservation, acquitterFacture } from '../../api/reservations'
import SidebarAdmin from '../../components/SidebarAdmin'

export default function ReservationsAdmin() {
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

    const handleAcquitter = async (id) => {
        if (!confirm('Marquer cette facture comme acquittée ?')) return
        await acquitterFacture(token, id)
        fetchReservations()
    }

    return (
        <div className="flex">
            <SidebarAdmin />
            <main className="ml-65 flex-1 min-h-screen bg-gray-50 p-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Réservations</h1>
                    <p className="text-gray-500 text-sm">Gérez toutes les réservations</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Chargement...</div>
                    ) : reservations.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Aucune réservation</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Utilisateur</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Espace</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Dates</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Total</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Statut</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Facture</th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {reservations.map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 text-sm font-medium text-[#1a1a2e]">{r.user?.prenom} {r.user?.nom}</td>
                                        <td className="px-5 py-4 text-sm text-gray-500">{r.espace?.nom}</td>
                                        <td className="px-5 py-4 text-sm text-gray-500">{r.date_debut} → {r.date_fin}</td>
                                        <td className="px-5 py-4 text-sm font-semibold text-[#7bdff2]">{r.prix_total}€</td>
                                        <td className="px-5 py-4">
                                            {r.statut === 'confirmée' ? (
                                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#eff7f6] text-[#0d9488] border border-[#b2f7ef]">Confirmée</span>
                                            ) : (
                                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-100">Annulée</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            {r.facture_acquittee ? (
                                                <span className="flex items-center gap-1 text-xs font-medium text-[#0d9488]">
                                                    <CheckCircle size={14} />
                                                    Acquittée
                                                </span>
                                            ) : r.statut === 'confirmée' ? (
                                                <button onClick={() => handleAcquitter(r.id)}
                                                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#b2f7ef] text-[#0d9488] hover:bg-[#eff7f6] transition-colors">
                                                    Acquitter
                                                </button>
                                            ) : (
                                                <span className="text-gray-300 text-sm">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            {r.statut === 'confirmée' && (
                                                <button onClick={() => handleAnnuler(r.id)}
                                                    className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                                                    Annuler
                                                </button>
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