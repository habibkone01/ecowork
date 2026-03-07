import { useState, useEffect } from 'react'
import { CheckCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getReservations, deleteReservation, acquitterFacture } from '../../api/reservations'
import SidebarAdmin from '../../components/SidebarAdmin'
import Modal from '../../components/Modal'

export default function ReservationsAdmin() {
    const { token } = useAuth()
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalAnnuler, setModalAnnuler] = useState({ isOpen: false, id: null })
    const [modalAcquitter, setModalAcquitter] = useState({ isOpen: false, id: null })
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [filters, setFilters] = useState({ date_debut: '', date_fin: '', statut: '' })

    useEffect(() => {
        fetchReservations(1)
    }, [])

    const fetchReservations = async (page = 1, params = {}) => {
        setLoading(true)
        try {
            const data = await getReservations(token, page, params)
            setReservations(data.data || [])
            setCurrentPage(data.meta?.current_page || 1)
            setLastPage(data.meta?.last_page || 1)
            setTotal(data.meta?.total || 0)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleFilter = (e) => {
        e.preventDefault()
        fetchReservations(1, filters)
    }

    const handleReset = () => {
        setFilters({ date_debut: '', date_fin: '', statut: '' })
        fetchReservations(1)
    }

    const handleAnnuler = async () => {
        await deleteReservation(token, modalAnnuler.id)
        setModalAnnuler({ isOpen: false, id: null })
        fetchReservations(currentPage, filters)
    }

    const handleAcquitter = async () => {
        await acquitterFacture(token, modalAcquitter.id)
        setModalAcquitter({ isOpen: false, id: null })
        fetchReservations(currentPage, filters)
    }

    const handlePage = (page) => {
        fetchReservations(page, filters)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="flex">
            <SidebarAdmin />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-50 p-4 lg:p-8">

                <Modal
                    isOpen={modalAnnuler.isOpen}
                    title="Annuler la réservation"
                    message="Voulez-vous vraiment annuler cette réservation ? Cette action est irréversible."
                    confirmText="Annuler la réservation"
                    confirmColor="bg-red-500 text-white"
                    onConfirm={handleAnnuler}
                    onCancel={() => setModalAnnuler({ isOpen: false, id: null })}
                />
                <Modal
                    isOpen={modalAcquitter.isOpen}
                    title="Acquitter la facture"
                    message="Voulez-vous marquer cette facture comme acquittée ?"
                    confirmText="Acquitter"
                    confirmColor="bg-[#0d9488] text-white"
                    onConfirm={handleAcquitter}
                    onCancel={() => setModalAcquitter({ isOpen: false, id: null })}
                />

                <div className="my-6 lg:mb-8">
                    <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a2e] mb-1">Réservations</h1>
                    <p className="text-gray-500 text-sm">Gérez toutes les réservations</p>
                </div>

                <form onSubmit={handleFilter} className="bg-white rounded-2xl p-4 lg:p-5 mb-6 shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Date début</label>
                            <input type="date" value={filters.date_debut} onChange={(e) => setFilters({ ...filters, date_debut: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#7bdff2]" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Date fin</label>
                            <input type="date" value={filters.date_fin} onChange={(e) => setFilters({ ...filters, date_fin: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#7bdff2]" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Statut</label>
                            <select value={filters.statut} onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#7bdff2]">
                                <option value="">Tous les statuts</option>
                                <option value="confirmée">Confirmée</option>
                                <option value="annulée">Annulée</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit"
                            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all flex items-center justify-center gap-2">
                            <Search size={16} />
                            Filtrer
                        </button>
                        <button type="button" onClick={handleReset}
                            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                            Réinitialiser
                        </button>
                    </div>
                </form>

                <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Chargement...</div>
                    ) : reservations.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Aucune réservation</div>
                    ) : (
                        <>
                            <div className="hidden lg:block">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-200 border-b border-gray-200">
                                            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-900">Utilisateur</th>
                                            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-900">Espace</th>
                                            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-900">Dates</th>
                                            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-900">Total</th>
                                            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-900">Statut</th>
                                            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-900">Facture</th>
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
                                                            <CheckCircle size={14} />Acquittée
                                                        </span>
                                                    ) : r.statut === 'confirmée' ? (
                                                        <button onClick={() => setModalAcquitter({ isOpen: true, id: r.id })}
                                                            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#b2f7ef] text-[#0d9488] hover:bg-[#eff7f6] transition-colors">
                                                            Acquitter
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-300 text-sm">—</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    {r.statut === 'confirmée' && (
                                                        <button onClick={() => setModalAnnuler({ isOpen: true, id: r.id })}
                                                            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                                                            Annuler
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="lg:hidden divide-y divide-gray-100">
                                {reservations.map((r) => (
                                    <div key={r.id} className="p-4 flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-sm text-[#1a1a2e]">{r.user?.prenom} {r.user?.nom}</span>
                                            {r.statut === 'confirmée' ? (
                                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#eff7f6] text-[#0d9488] border border-[#b2f7ef]">Confirmée</span>
                                            ) : (
                                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-100">Annulée</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">{r.espace?.nom}</div>
                                        <div className="text-xs text-gray-400">{r.date_debut} → {r.date_fin}</div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-sm font-bold text-[#7bdff2]">{r.prix_total}€</span>
                                            <div className="flex items-center gap-2">
                                                {r.facture_acquittee ? (
                                                    <span className="flex items-center gap-1 text-xs font-medium text-[#0d9488]">
                                                        <CheckCircle size={13} />Acquittée
                                                    </span>
                                                ) : r.statut === 'confirmée' && (
                                                    <button onClick={() => setModalAcquitter({ isOpen: true, id: r.id })}
                                                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#b2f7ef] text-[#0d9488] hover:bg-[#eff7f6] transition-colors">
                                                        Acquitter
                                                    </button>
                                                )}
                                                {r.statut === 'confirmée' && (
                                                    <button onClick={() => setModalAnnuler({ isOpen: true, id: r.id })}
                                                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                                                        Annuler
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {lastPage > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 lg:px-5 py-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-400">{total} réservation(s) au total</p>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1}
                                            className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                            <ChevronLeft size={16} />
                                        </button>
                                        {Array.from({ length: lastPage }, (_, i) => i + 1).map(page => (
                                            <button key={page} onClick={() => handlePage(page)}
                                                className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${currentPage === page ? 'bg-[#7bdff2] text-[#1a1a2e]' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                                {page}
                                            </button>
                                        ))}
                                        <button onClick={() => handlePage(currentPage + 1)} disabled={currentPage === lastPage}
                                            className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}