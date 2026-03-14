import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Maximize2, Users, ChevronLeft, ChevronRight, LayoutGrid, Calendar } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEspaces } from '../../api/espaces'
import SidebarUser from '../../components/SidebarUser'
import usePageTitle from '../../hooks/usePageTitle'

export default function Espaces() {
    usePageTitle('Les espaces')
    const { token } = useAuth()
    const [espaces, setEspaces] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({ type: '', date_debut: '', date_fin: '' })
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
        if (espace.images && espace.images.length > 0) return espace.images[0].url
        return null
    }

    return (
        <div className="flex">
            <SidebarUser />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-50 p-4 lg:p-8">

                <div className="my-6 lg:mb-8">
                    <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a2e] mb-1">Les espaces</h1>
                    <p className="text-gray-500 text-sm">Trouvez et réservez votre espace de travail idéal</p>
                </div>

                <div className="flex justify-center mb-6">
                    <form onSubmit={handleFilter} className="w-full max-w-2xl bg-white overflow-hidden flex flex-col sm:flex-row" style={{ border: '0.5px solid #e0e0d8', borderRadius: '14px' }}>
                        <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:h-12 border-b sm:border-b-0 sm:border-r border-gray-100">
                            <LayoutGrid size={14} className="text-gray-400 shrink-0" />
                            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="border-none bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full">
                                <option value="">Tous les types</option>
                                <option value="bureau">Bureau</option>
                                <option value="salle de réunion">Salle de réunion</option>
                                <option value="conférence">Conférence</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:h-12 border-b sm:border-b-0 sm:border-r border-gray-100">
                            <span className="text-gray-600 shrink-0">Du</span>
                            <input type="date" min={new Date().toISOString().split('T')[0]} value={filters.date_debut} onChange={(e) => setFilters({ ...filters, date_debut: e.target.value })} className="border-none bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full" />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:h-12 flex-1 border-b sm:border-b-0 border-gray-100">
                            <span className="text-gray-600 shrink-0">au</span>
                            <input type="date" min={new Date().toISOString().split('T')[0]} value={filters.date_fin} onChange={(e) => setFilters({ ...filters, date_fin: e.target.value })} className="border-none bg-transparent text-sm text-gray-700 outline-none cursor-pointer w-full" />
                        </div>
                        <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 sm:py-0 sm:h-12 text-sm font-medium text-[#1A1A2E] hover:opacity-90 transition-opacity shrink-0" style={{ backgroundColor: '#7BDFF2' }}>
                            <Search size={13} />
                            Rechercher
                        </button>
                    </form>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-400">Chargement...</div>
                    </div>
                ) : (
                    <>
                        {espaces.length === 0 ? (
                            <div className="flex items-center justify-center h-64 text-gray-400">Aucun espace trouvé</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mb-8">
                                    {espaces.map((espace) => (
                                        <div key={espace.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col" style={{ border: '1px solid #f0f0f0' }}>
                                            <div className="relative h-64 overflow-hidden rounded-2xl m-3">
                                                <img src={getImageUrl(espace)} alt={espace.nom} className="w-full h-full object-cover" loading="lazy" />
                                            </div>
                                            <div className="px-4 pb-4 flex flex-col flex-1">
                                                <div className="flex items-start justify-between gap-2 mb-3">
                                                    <h3 className="font-extrabold text-lg text-[#1a1a2e] leading-tight">{espace.nom}</h3>
                                                    <span className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-full text-[#1A1A2E] whitespace-nowrap" style={{ backgroundColor: '#7BDFF2' }}>{espace.tarif_journalier}€/j</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    <span className="text-xs font-medium px-3 py-1 rounded-full border border-gray-200 text-gray-600">{espace.type}</span>
                                                    <span className="text-xs font-medium px-3 py-1 rounded-full border border-gray-200 text-gray-600 flex items-center gap-1"><Maximize2 size={10} /> {espace.surface}m²</span>
                                                    <span className="text-xs font-medium px-3 py-1 rounded-full border border-gray-200 text-gray-600 flex items-center gap-1"><Users size={10} /> {espace.capacite} pers.</span>
                                                </div>
                                                <Link to={`/espaces/${espace.id}`} className="mt-auto w-full py-3 rounded-2xl font-bold text-sm text-[#1A1A2E] text-center no-underline flex items-center justify-center transition-opacity hover:opacity-90" style={{ backgroundColor: '#7BDFF2' }}>
                                                    Voir l'espace
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {lastPage > 1 && (
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                        <p className="text-sm text-gray-600">{total} espace(s) au total</p>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handlePage(currentPage - 1)} disabled={currentPage === 1} aria-label="Page précédente" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                                <ChevronLeft size={16} />
                                            </button>
                                            {Array.from({ length: lastPage }, (_, i) => i + 1).map(page => (
                                                <button key={page} onClick={() => handlePage(page)} aria-label={`Page ${page}`} className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${currentPage === page ? 'bg-[#7bdff2] text-[#1a1a2e]' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                                    {page}
                                                </button>
                                            ))}
                                            <button onClick={() => handlePage(currentPage + 1)} disabled={currentPage === lastPage} aria-label="Page suivante" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}