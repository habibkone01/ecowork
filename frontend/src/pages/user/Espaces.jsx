import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Maximize2, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEspaces } from '../../api/espaces'
import SidebarUser from '../../components/SidebarUser'

export default function Espaces() {
    const { token } = useAuth()
    const [espaces, setEspaces] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        type: '',
        date_debut: '',
        date_fin: ''
    })
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        fetchEspaces({}, 1)
    }, [])

    const fetchEspaces = async (params = {}, page = 1) => {
        setLoading(true)
        try {
            const data = await getEspaces(token, { ...params, page, sort: 'desc' })
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
        fetchEspaces(filters, 1)
    }

    const handlePage = (page) => {
        fetchEspaces(filters, page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const getImageUrl = (espace) => {
        if (espace.images && espace.images.length > 0) {
            return espace.images[0].url
        }
        return null
    }

    return (
        <div className="flex">
            <SidebarUser />
            <main className="ml-65 flex-1 min-h-screen bg-gray-50 p-8">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Les espaces</h1>
                    <p className="text-gray-500 text-sm">Trouvez et réservez votre espace de travail idéal</p>
                </div>

                <form onSubmit={handleFilter} className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-1 min-w-45">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Type</label>
                            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#7bdff2]">
                                <option value="">Tous les types</option>
                                <option value="bureau">Bureau</option>
                                <option value="salle de réunion">Salle de réunion</option>
                                <option value="conférence">Conférence</option>
                            </select>
                        </div>
                        <div className="flex-1 min-w-45">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Date début</label>
                            <input type="date" value={filters.date_debut} onChange={(e) => setFilters({ ...filters, date_debut: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#7bdff2]" />
                        </div>
                        <div className="flex-1 min-w-45">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Date fin</label>
                            <input type="date" value={filters.date_fin} onChange={(e) => setFilters({ ...filters, date_fin: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#7bdff2]" />
                        </div>
                        <button type="submit"
                            className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all flex items-center gap-2">
                            <Search size={16} />
                            Rechercher
                        </button>
                    </div>
                </form>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-400">Chargement...</div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                            {espaces.map((espace) => (
                                <div key={espace.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all">
                                    <div className="relative h-48 overflow-hidden">
                                        <img src={getImageUrl(espace)} alt={espace.nom}
                                            className="w-full h-full object-cover" />
                                        <div className="absolute top-3 left-3">
                                            <span className="text-xs font-medium px-3 py-1 rounded-full text-white bg-[#1a1a2e99]">{espace.type}</span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-base text-[#1a1a2e]">{espace.nom}</h3>
                                            <span className="font-bold text-base text-[#7bdff2]">{espace.tarif_journalier}€<span className="text-xs font-normal text-gray-400">/jour</span></span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                                            <span className="flex items-center gap-1"><Maximize2 size={12} />{espace.surface}m²</span>
                                            <span className="flex items-center gap-1"><Users size={12} />{espace.capacite} pers.</span>
                                        </div>
                                        <div className="flex gap-1 mb-4 flex-wrap">
                                            {espace.equipements?.slice(0, 3).map((eq) => (
                                                <span key={eq.id} className="text-xs px-2 py-1 rounded-lg bg-[#eff7f6] text-[#0d9488]">{eq.nom}</span>
                                            ))}
                                        </div>
                                        <Link to={`/espaces/${espace.id}`}
                                            className="w-full py-2.5 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all flex items-center justify-center gap-2 no-underline">
                                            Voir l'espace
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {lastPage > 1 && (
                            <div className="flex items-center justify-between">
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
                    </>
                )}
            </main>
        </div>
    )
}