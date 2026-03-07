import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Maximize2, Users, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEspaces, deleteEspace } from '../../api/espaces'
import SidebarAdmin from '../../components/SidebarAdmin'
import Modal from '../../components/Modal'

export default function EspacesAdmin() {
    const { token } = useAuth()
    const [espaces, setEspaces] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState({ isOpen: false, id: null })
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [filters, setFilters] = useState({ type: '', capacite: '', tarif_max: '', date_debut: '', date_fin: '' })

    useEffect(() => {
        fetchEspaces(1)
    }, [])

    const fetchEspaces = async (page = 1, params = {}) => {
        setLoading(true)
        try {
            const data = await getEspaces(token, { page, ...params })
            setEspaces(data.data || [])
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
        fetchEspaces(1, filters)
    }

    const handleReset = () => {
        setFilters({ type: '', capacite: '', tarif_max: '', date_debut: '', date_fin: '' })
        fetchEspaces(1)
    }

    const handleDelete = async () => {
        await deleteEspace(token, modal.id)
        setModal({ isOpen: false, id: null })
        fetchEspaces(currentPage, filters)
    }

    const handlePage = (page) => {
        fetchEspaces(page, filters)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="flex">
            <SidebarAdmin />
            <main className="ml-65 flex-1 min-h-screen bg-gray-50 p-8">

                <Modal
                    isOpen={modal.isOpen}
                    title="Supprimer l'espace"
                    message="Voulez-vous vraiment supprimer cet espace ? Cette action est irréversible."
                    confirmText="Supprimer"
                    confirmColor="bg-red-500 text-white"
                    onConfirm={handleDelete}
                    onCancel={() => setModal({ isOpen: false, id: null })}
                />

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Espaces</h1>
                        <p className="text-gray-500 text-sm">Gérez les espaces de coworking</p>
                    </div>
                    <Link to="/admin/espaces/creer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all no-underline">
                        <Plus size={16} />
                        Ajouter un espace
                    </Link>
                </div>

                {/* Filtres */}
                <form onSubmit={handleFilter} className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-36">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Type</label>
                            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#7bdff2]">
                                <option value="">Tous les types</option>
                                <option value="bureau">Bureau</option>
                                <option value="salle de réunion">Salle de réunion</option>
                                <option value="conférence">Conférence</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-36">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Capacité min.</label>
                            <input type="number" min="1" value={filters.capacite} onChange={(e) => setFilters({ ...filters, capacite: e.target.value })}
                                placeholder="Ex: 10"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#7bdff2]" />
                        </div>
                        <div className="flex-1 min-w-36">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Tarif max. (€/jour)</label>
                            <input type="number" min="1" value={filters.tarif_max} onChange={(e) => setFilters({ ...filters, tarif_max: e.target.value })}
                                placeholder="Ex: 200"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#7bdff2]" />
                        </div>
                        <div className="flex-1 min-w-36">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Date début</label>
                            <input type="date" value={filters.date_debut} onChange={(e) => setFilters({ ...filters, date_debut: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#7bdff2]" />
                        </div>
                        <div className="flex-1 min-w-36">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Date fin</label>
                            <input type="date" value={filters.date_fin} onChange={(e) => setFilters({ ...filters, date_fin: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#7bdff2]" />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit"
                                className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all flex items-center gap-2">
                                <Search size={16} />
                                Filtrer
                            </button>
                            <button type="button" onClick={handleReset}
                                className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                                Réinitialiser
                            </button>
                        </div>
                    </div>
                </form>

                {loading ? (
                    <div className="flex items-center justify-center h-64 text-gray-400">Chargement...</div>
                ) : (
                    <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-100">
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Espace</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Type</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Surface</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Capacité</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Tarif/jour</th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {espaces.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-10 text-gray-400 text-sm">Aucun espace trouvé</td>
                                    </tr>
                                ) : espaces.map((espace) => (
                                    <tr key={espace.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                                                    {espace.images?.length > 0 ? (
                                                        <img src={espace.images[0].url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-100"></div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-sm text-[#1a1a2e]">{espace.nom}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-500">{espace.type}</td>
                                        <td className="px-5 py-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Maximize2 size={14} />{espace.surface}m²</span>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Users size={14} />{espace.capacite}</span>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-semibold text-[#7bdff2]">{espace.tarif_journalier}€</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Link to={`/admin/espaces/${espace.id}/modifier`}
                                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline">
                                                    <Pencil size={14} />
                                                </Link>
                                                <button onClick={() => setModal({ isOpen: true, id: espace.id })}
                                                    className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {lastPage > 1 && (
                            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
                                <p className="text-sm text-gray-400">{total} espace(s) au total</p>
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
                )}
            </main>
        </div>
    )
}