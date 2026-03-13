import { useState, useEffect } from 'react'
import { CalendarCheck, CalendarX, Euro } from 'lucide-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getReservations, deleteReservation } from '../../api/reservations'
import SidebarUser from '../../components/SidebarUser'
import Modal from '../../components/Modal'
import usePageTitle from '../../hooks/usePageTitle'

export default function Reservations() {
    usePageTitle('Mes réservations')
    const { token } = useAuth()
    const [reservations, setReservations] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState({ isOpen: false, id: null })
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        fetchReservations(1)
    }, [])

    const fetchReservations = async (page = 1) => {
        setLoading(true)
        try {
            const data = await getReservations(token, page)
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

    const handleAnnuler = async () => {
        await deleteReservation(token, modal.id)
        setModal({ isOpen: false, id: null })
        fetchReservations(currentPage)
    }

    const handlePage = (page) => {
        fetchReservations(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const getNbJours = (debut, fin) => {
        const d1 = new Date(debut)
        const d2 = new Date(fin)
        return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) + 1
    }

    const confirmees = reservations.filter(r => r.statut === 'confirmée')
    const annulees = reservations.filter(r => r.statut === 'annulée')
    const totalDepense = reservations
        .filter(r => r.statut === 'confirmée')
        .reduce((acc, r) => acc + parseFloat(r.prix_total || 0), 0)
        .toFixed(2)

    return (
        <div className="flex">
            <SidebarUser />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-50 p-4 lg:p-8">

                <Modal
                    isOpen={modal.isOpen}
                    title="Annuler la réservation"
                    message="Voulez-vous vraiment annuler cette réservation ? Cette action est irréversible."
                    confirmText="Annuler la réservation"
                    confirmColor="bg-red-500 text-white"
                    onConfirm={handleAnnuler}
                    onCancel={() => setModal({ isOpen: false, id: null })}
                />

                <div className="my-6 lg:mb-8">
                    <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a2e] mb-1">Mes réservations</h1>
                    <p className="text-gray-500 text-sm">Historique de toutes vos réservations</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6">
                    <div className="bg-white rounded-2xl p-3 lg:p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center bg-[#eff7f6] shrink-0">
                                <CalendarCheck size={16} className="text-[#0a7a70] lg:hidden" />
                                <CalendarCheck size={20} className="text-[#0a7a70] hidden lg:block" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-lg lg:text-xl font-bold text-[#1a1a2e]">{confirmees.length}</div>
                                <div className="text-xs text-gray-600 truncate">Confirmées</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-3 lg:p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center bg-red-50 shrink-0">
                                <CalendarX size={16} className="text-red-500 lg:hidden" />
                                <CalendarX size={20} className="text-red-500 hidden lg:block" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-lg lg:text-xl font-bold text-[#1a1a2e]">{annulees.length}</div>
                                <div className="text-xs text-gray-600 truncate">Annulées</div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block bg-white rounded-2xl p-3 lg:p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 lg:gap-3">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl flex items-center justify-center bg-[#eff7f6] shrink-0">
                                <Euro size={20} className="text-[#7bdff2]" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-lg lg:text-xl font-bold text-[#1a1a2e]">{totalDepense}€</div>
                                <div className="text-xs text-gray-600">Total dépensé</div>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-32 text-gray-400">Chargement...</div>
                ) : reservations.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-400">Aucune réservation</div>
                ) : (
                    <>
                        <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-5 border-b border-gray-100">
                                <h2 className="font-bold text-[#1a1a2e]">Historique</h2>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Espace</th>
                                        <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Date début</th>
                                        <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Date fin</th>
                                        <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Durée</th>
                                        <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Total</th>
                                        <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Statut</th>
                                        <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {reservations.map((r) => (
                                        <tr key={r.id} className="hover:bg-gray-50 transition-all">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                                                        {r.espace?.images?.length > 0 ? (
                                                            <img src={r.espace.images[0].url} alt="" className="w-full h-full object-cover" loading="lazy" />
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
                                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#eff7f6] text-[#0a7a70]">Confirmée</span>
                                                ) : (
                                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-50 text-red-600 ">Annulée</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {r.statut === 'confirmée' ? (
                                                    <button onClick={() => setModal({ isOpen: true, id: r.id })}
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

                            {lastPage > 1 && (
                                <div className="flex items-center justify-between gap-3 p-5 border-t border-gray-100">
                                    <p className="text-sm text-gray-600">{total} réservation(s) au total</p>
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
                        </div>

                        <div className="lg:hidden flex flex-col gap-3">
                            {reservations.map((r) => (
                                <div key={r.id} className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
                                    <div className="flex items-center gap-3 p-4 pb-3">
                                        <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                                            {r.espace?.images?.length > 0 ? (
                                                <img src={r.espace.images[0].url} alt="" className="w-full h-full object-cover" loading="lazy" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm text-[#1a1a2e] truncate">{r.espace?.nom}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{getNbJours(r.date_debut, r.date_fin)} jour(s)</div>
                                        </div>
                                        {r.statut === 'confirmée' ? (
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#eff7f6] text-[#0a7a70] border border-[#b2f7ef] shrink-0">Confirmée</span>
                                        ) : (
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 shrink-0">Annulée</span>
                                        )}
                                    </div>

                                    <div className="flex items-center divide-x divide-gray-100 border-t border-b border-gray-100 mx-3 sm:mx-4">
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
                                        <div className="p-4 pt-3">
                                            <button onClick={() => setModal({ isOpen: true, id: r.id })} className="w-full py-2.5 rounded-xl text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-all">
                                                Annuler la réservation
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {lastPage > 1 && (
                                <div className="flex flex-col items-center gap-3 pt-2">
                                    <p className="text-sm text-gray-600">{total} réservation(s) au total</p>
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
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}