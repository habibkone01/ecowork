import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Maximize2, Users, ChevronLeft, ChevronRight, Search, LayoutGrid } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEspaces, deleteEspace } from '../../api/espaces'
import { getCategories } from '../../api/categories'
import SidebarAdmin from '../../components/SidebarAdmin'
import Modal from '../../components/Modal'
import usePageTitle from '../../hooks/usePageTitle'

export default function EspacesAdmin() {
    usePageTitle('Espaces')
    const { token } = useAuth()
    const [espaces, setEspaces] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState({ isOpen: false, id: null })
    const [modalError, setModalError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [filters, setFilters] = useState({ categorie_id: '', date_debut: '', date_fin: '' })

    useEffect(() => {
        fetchCategories()
        fetchEspaces(1)
    }, [])

    const fetchCategories = async () => {
        try {
            const data = await getCategories(token)
            setCategories(data.data || [])
        } catch (err) {
            console.error(err)
        }
    }

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
        setFilters({ categorie_id: '', date_debut: '', date_fin: '' })
        fetchEspaces(1)
    }

    const handleDelete = async () => {
        const data = await deleteEspace(token, modal.id)
        if (!data.success) {
            setModalError(data.message)
            return
        }
        setModalError(null)
        setModal({ isOpen: false, id: null })
        fetchEspaces(currentPage, filters)
    }

    const handlePage = (page) => {
        fetchEspaces(page, filters)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const categorieBadge = (categorie) => {
        if (!categorie) return 'bg-gray-100 text-gray-600'
        const libelle = categorie.libelle
        if (libelle === 'bureau') return 'bg-[#e0f2fe] text-[#0369a1]'
        if (libelle === 'salle de réunion') return 'bg-[#f3e8ff] text-[#7c3aed]'
        if (libelle === 'conférence') return 'bg-[#fef3c7] text-[#d97706]'
        return 'bg-gray-100 text-gray-600'
    }

    return (
        <div className="flex bg-gray-100">
            <SidebarAdmin />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-100 p-4 lg:p-8 overflow-x-hidden">

                <Modal
                    isOpen={modal.isOpen}
                    title="Supprimer l'espace"
                    message="Voulez-vous vraiment supprimer cet espace ? Cette action est irréversible."
                    confirmText="Supprimer"
                    confirmColor="bg-red-500 text-white"
                    onConfirm={handleDelete}
                    onCancel={() => { setModal({ isOpen: false, id: null }); setModalError(null) }}
                    error={modalError}
                />

                <div className="flex items-center justify-between my-6 lg:mb-8 gap-3">
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a2e] mb-1">Espaces</h1>
                        <p className="text-gray-700 text-sm">Gérez les espaces de coworking</p>
                    </div>
                    <Link to="/admin/espaces/creer" className="flex items-center gap-2 px-3 lg:px-4 py-2.5 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all no-underline shrink-0">
                        <Plus size={16} />
                        <span className="hidden sm:inline">Ajouter un espace</span>
                        <span className="sm:hidden">Ajouter</span>
                    </Link>
                </div>

                <div className="flex justify-center mb-6">
                    <form onSubmit={handleFilter} className="w-full max-w-3xl bg-white overflow-hidden flex flex-col sm:flex-row" style={{ border: '0.5px solid #e0e0d8', borderRadius: '14px' }}>
                        <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:h-12 border-b sm:border-b-0 sm:border-r border-gray-100 sm:min-w-45">
                            <LayoutGrid size={14} className="text-gray-500 shrink-0" />
                            <select
                                aria-label="Catégorie d'espace"
                                value={filters.categorie_id}
                                onChange={(e) => setFilters({ ...filters, categorie_id: e.target.value })}
                                className="border-none bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full min-w-0"
                            >
                                <option value="">Toutes les catégories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.libelle}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:h-12 border-b sm:border-b-0 sm:border-r border-gray-100">
                            <span className="text-gray-500 shrink-0">Du</span>
                            <input type="date" min={new Date().toISOString().split('T')[0]} aria-label="Date de début" value={filters.date_debut} onChange={(e) => setFilters({ ...filters, date_debut: e.target.value })} className="border-none bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full min-w-0" />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:h-12 sm:min-w-40 sm:max-w-45 border-b sm:border-b-0 sm:border-r border-gray-100">
                            <span className="text-gray-500 shrink-0">Au</span>
                            <input type="date" min={new Date().toISOString().split('T')[0]} aria-label="Date de fin" value={filters.date_fin} onChange={(e) => setFilters({ ...filters, date_fin: e.target.value })} className="border-none bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full min-w-0" />
                        </div>
                        <button type="button" onClick={handleReset} className="flex items-center justify-center gap-2 px-5 py-3 sm:py-0 sm:h-12 text-sm text-gray-500 border-b sm:border-b-0 sm:border-r border-gray-100 shrink-0 transition-colors">
                            Réinitialiser
                        </button>
                        <button type="submit" className="flex items-center justify-center gap-2 px-7 py-3 sm:py-0 sm:h-12 text-sm xl:px-8 font-medium text-[#1A1A2E] hover:opacity-90 transition-opacity shrink-0" style={{ backgroundColor: '#7BDFF2' }}>
                            <Search size={13} />
                            Filtrer
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64 text-gray-400">Chargement...</div>
                ) : (
                    <>
                        {/* Vue desktop */}
                        <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-700">Espace</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-700">Catégorie</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-700">Surface</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-700">Capacité</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-700">Tarif/jour</th>
                                        <th className="px-5 py-3.5"></th>
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
                                                            <img src={espace.images[0].url} alt="" className="w-full h-full object-cover" loading="lazy" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-100"></div>
                                                        )}
                                                    </div>
                                                    <span className="font-semibold text-sm text-[#1a1a2e]">{espace.nom}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap capitalize ${categorieBadge(espace.categorie)}`}>
                                                    {espace.categorie?.libelle || '-'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                <span className="flex items-center gap-1.5"><Maximize2 size={13} className="shrink-0" />{espace.surface}m²</span>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                <span className="flex items-center gap-1.5"><Users size={13} className="shrink-0" />{espace.capacite} pers.</span>
                                            </td>
                                            <td className="px-5 py-4 whitespace-nowrap">
                                                <span className="text-sm font-bold text-[#7bdff2]">{espace.tarif_journalier}€</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Link to={`/admin/espaces/${espace.id}/modifier`} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline">
                                                        <Pencil size={14} />
                                                    </Link>
                                                    <button onClick={() => setModal({ isOpen: true, id: espace.id })} className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {lastPage > 1 && (
                                <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-600">{total} espace(s) au total</p>
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
                            {espaces.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">Aucun espace trouvé</div>
                            ) : espaces.map((espace) => (
                                <div key={espace.id} className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #f0f0f0' }}>
                                    <div className="flex items-center gap-3 p-4 pb-3">
                                        <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
                                            {espace.images?.length > 0 ? (
                                                <img src={espace.images[0].url} alt="" className="w-full h-full object-cover" loading="lazy" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm text-[#1a1a2e] truncate">{espace.nom}</div>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 inline-block capitalize ${categorieBadge(espace.categorie)}`}>
                                                {espace.categorie?.libelle || '-'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Link to={`/admin/espaces/${espace.id}/modifier`} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline">
                                                <Pencil size={14} />
                                            </Link>
                                            <button onClick={() => setModal({ isOpen: true, id: espace.id })} className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center divide-x divide-gray-100 border-t border-gray-100 mx-4 mb-3">
                                        <div className="flex-1 py-2.5 pr-3">
                                            <div className="text-xs text-gray-400 mb-0.5">Surface</div>
                                            <div className="text-xs font-semibold text-[#1a1a2e] flex items-center gap-1"><Maximize2 size={11} />{espace.surface}m²</div>
                                        </div>
                                        <div className="flex-1 py-2.5 px-3">
                                            <div className="text-xs text-gray-400 mb-0.5">Capacité</div>
                                            <div className="text-xs font-semibold text-[#1a1a2e] flex items-center gap-1"><Users size={11} />{espace.capacite} pers.</div>
                                        </div>
                                        <div className="flex-1 py-2.5 pl-3">
                                            <div className="text-xs text-gray-400 mb-0.5">Tarif/jour</div>
                                            <div className="text-sm font-bold text-[#7bdff2]">{espace.tarif_journalier}€</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {lastPage > 1 && (
                                <div className="flex flex-col items-center gap-3 pt-2">
                                    <p className="text-sm text-gray-600">{total} espace(s) au total</p>
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