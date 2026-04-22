import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, ChevronLeft, ChevronRight, Search, Eye } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getReservations, deleteReservation, acquitterFacture } from '../../api/reservations'
import SidebarAdmin from '../../components/SidebarAdmin'
import Modal from '../../components/Modal'
import usePageTitle from '../../hooks/usePageTitle'

export default function ReservationsAdmin() {
    usePageTitle('Réservations')
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
        <div className="flex bg-gray-100">
            <SidebarAdmin />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-100 p-4 lg:p-8 overflow-x-hidden">

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
                    <p className="text-gray-700 text-sm">Gérez toutes les réservations</p>
                </div>

                <div className="flex justify-center mb-6">
                    <form onSubmit={handleFilter} className="w-full max-w-3xl bg-white overflow-hidden flex flex-col sm:flex-row" style={{ border: '0.5px solid #e0e0d8', borderRadius: '14px' }}>
                        <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:h-12 border-b sm:border-b-0 sm:border-r border-gray-100">
                            <span className="text-gray-500 shrink-0">Du</span>
                            <input type="date" aria-label="Date de début" value={filters.date_debut} onChange={(e) => setFilters({ ...filters, date_debut: e.target.value })} className="border-none bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full min-w-0" />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:h-12 sm:min-w-40 sm:max-w-45 border-b sm:border-b-0 sm:border-r border-gray-100">
                            <span className="text-gray-500 shrink-0">Au</span>
                            <input type="date" aria-label="Date de fin" value={filters.date_fin} onChange={(e) => setFilters({ ...filters, date_fin: e.target.value })} className="border-none bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full min-w-0" />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:h-12 sm:min-w-40 border-b sm:border-b-0 sm:border-r border-gray-100">
                            <select aria-label="Statut de la réservation" value={filters.statut} onChange={(e) => setFilters({ ...filters, statut: e.target.value })} className="border-none bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full min-w-0">
                                <option value="">Tous les statuts</option>
                                <option value="confirmée">Confirmée</option>
                                <option value="annulée">Annulée</option>
                            </select>
                        </div>
                        <button type="button" onClick={handleReset} className="flex items-center justify-center px-5 py-3 sm:py-0 sm:h-12 text-sm text-gray-500 border-b sm:border-b-0 sm:border-r border-gray-100 shrink-0 transition-colors">
                            Réinitialiser
                        </button>
                        <button type="submit" className="flex items-center justify-center gap-2 px-10 py-3 sm:py-0 sm:h-12 text-sm font-medium text-[#1A1A2E] hover:opacity-90 transition-opacity shrink-0" style={{ backgroundColor: '#7BDFF2' }}>
                            <Search size={13} />
                            Filtrer
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Chargement...</div>
                ) : reservations.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Aucune réservation</div>
                ) : (
                    <>
                        {/* Vue desktop */}
                        <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-700">Utilisateur</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-700">Espace</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-700">Dates</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-700">Statut</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-700">Total</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-700">Facture</th>
                                        <th className="px-5 py-3.5"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {reservations.map((r) => (
                                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4 text-sm font-semibold text-[#1a1a2e] whitespace-nowrap">{r.user?.prenom} {r.user?.nom}</td>
                                            <td className="px-5 py-4 text-sm text-gray-600">{r.espace?.nom}</td>
                                            <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{r.date_debut} → {r.date_fin}</td>
                                            <td className="px-5 py-4">
                                                {r.statut === 'confirmée' ? (
                                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#eff7f6] text-[#0a7a70]">Confirmée</span>
                                                ) : (
                                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-500">Annulée</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{r.prix_total}€</td>
                                            <td className="px-5 py-4">
                                                {r.facture_acquittee ? (
                                                    <span className="flex items-center gap-1 text-xs font-medium text-[#0a7a70]"><CheckCircle size={14} />Acquittée</span>
                                                ) : r.statut === 'confirmée' ? (
                                                    <button onClick={() => setModalAcquitter({ isOpen: true, id: r.id })} className="text-xs font-medium px-3 py-1.5 rounded-lg border text-white bg-[#0a7a70] hover:bg-[#008979] transition-colors">
                                                        Acquitter
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-300 text-sm">—</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Link to={`/admin/reservations/${r.id}`} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline">
                                                        <Eye size={14} />
                                                    </Link>
                                                    {r.statut === 'confirmée' && (
                                                        <button onClick={() => setModalAnnuler({ isOpen: true, id: r.id })} className="text-xs font-medium px-3 py-1.5 rounded-lg border bg-red-500 text-white hover:bg-red-800 transition-colors">
                                                            Annuler
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {lastPage > 1 && (
                                <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-600">{total} réservation(s) au total</p>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                            <ChevronLeft size={16} />
                                        </button>
                                        {Array.from({ length: lastPage }, (_, i) => i + 1).map(page => (
                                            <button key={page} onClick={() => handlePage(page)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${currentPage === page ? 'bg-[#7bdff2] text-[#1a1a2e]' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                                {page}
                                            </button>
                                        ))}
                                        <button onClick={() => handlePage(currentPage + 1)} disabled={currentPage === lastPage} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Vue mobile */}
                        <div className="lg:hidden flex flex-col gap-3">
                            {reservations.map((r) => (
                                <div key={r.id} className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #f0f0f0' }}>
                                    <div className="flex items-center justify-between gap-3 p-4 pb-3">
                                        <div className="min-w-0">
                                            <div className="font-semibold text-sm text-[#1a1a2e] truncate">{r.user?.prenom} {r.user?.nom}</div>
                                            <div className="text-xs text-gray-400 mt-0.5 truncate">{r.espace?.nom}</div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {r.statut === 'confirmée' ? (
                                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#eff7f6] text-[#0a7a70]">Confirmée</span>
                                            ) : (
                                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-red-50 text-red-500">Annulée</span>
                                            )}
                                            <Link to={`/admin/reservations/${r.id}`} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline">
                                                <Eye size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex items-center divide-x divide-gray-100 border-t border-gray-100 mx-4">
                                        <div className="flex-1 py-2.5 pr-3">
                                            <div className="text-xs text-gray-400 mb-0.5">Début</div>
                                            <div className="text-xs font-semibold text-[#1a1a2e]">{r.date_debut}</div>
                                        </div>
                                        <div className="flex-1 py-2.5 px-3">
                                            <div className="text-xs text-gray-400 mb-0.5">Fin</div>
                                            <div className="text-xs font-semibold text-[#1a1a2e]">{r.date_fin}</div>
                                        </div>
                                        <div className="flex-1 py-2.5 pl-3">
                                            <div className="text-xs text-gray-400 mb-0.5">Total</div>
                                            <div className="text-sm font-bold text-[#7bdff2]">{r.prix_total}€</div>
                                        </div>
                                    </div>
                                    {r.statut === 'confirmée' && (
                                        <div className="flex items-center gap-2 p-4 pt-3">
                                            {r.facture_acquittee ? (
                                                <span className="flex items-center gap-1 text-xs font-medium text-[#0a7a70]"><CheckCircle size={13} />Acquittée</span>
                                            ) : (
                                                <button onClick={() => setModalAcquitter({ isOpen: true, id: r.id })} className="flex-1 py-2 rounded-xl text-xs font-semibold border text-white bg-[#0a7a70] hover:bg-[#eff7f6] transition-colors">
                                                    Acquitter
                                                </button>
                                            )}
                                            <button onClick={() => setModalAnnuler({ isOpen: true, id: r.id })} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors">
                                                Annuler
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {lastPage > 1 && (
                                <div className="flex flex-col items-center gap-3 pt-2">
                                    <p className="text-sm text-gray-600">{total} réservation(s) au total</p>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                            <ChevronLeft size={16} />
                                        </button>
                                        {Array.from({ length: lastPage }, (_, i) => i + 1).map(page => (
                                            <button key={page} onClick={() => handlePage(page)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${currentPage === page ? 'bg-[#7bdff2] text-[#1a1a2e]' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                                {page}
                                            </button>
                                        ))}
                                        <button onClick={() => handlePage(currentPage + 1)} disabled={currentPage === lastPage} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}