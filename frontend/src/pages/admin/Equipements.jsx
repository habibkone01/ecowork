import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEquipements, deleteEquipement } from '../../api/equipements'
import SidebarAdmin from '../../components/SidebarAdmin'
import Modal from '../../components/Modal'
import usePageTitle from '../../hooks/usePageTitle'

export default function Equipements() {
    usePageTitle('Équipements')
    const { token } = useAuth()
    const [equipements, setEquipements] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState({ isOpen: false, id: null })
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        fetchEquipements(1)
    }, [])

    const fetchEquipements = async (page = 1) => {
        setLoading(true)
        try {
            const data = await getEquipements(token, { page })
            setEquipements(data.data || [])
            setCurrentPage(data.meta?.current_page || 1)
            setLastPage(data.meta?.last_page || 1)
            setTotal(data.meta?.total || 0)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        await deleteEquipement(token, modal.id)
        setModal({ isOpen: false, id: null })
        fetchEquipements(currentPage)
    }

    const handlePage = (page) => {
        fetchEquipements(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('fr-FR')
    }

    return (
        <div className="flex">
            <SidebarAdmin />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-50 p-4 lg:p-8">

                <Modal
                    isOpen={modal.isOpen}
                    title="Supprimer l'équipement"
                    message="Voulez-vous vraiment supprimer cet équipement ? Cette action est irréversible."
                    confirmText="Supprimer"
                    confirmColor="bg-red-500 text-white"
                    onConfirm={handleDelete}
                    onCancel={() => setModal({ isOpen: false, id: null })}
                />

                <div className="flex items-center justify-between my-6 lg:mb-8 gap-3">
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a2e] mb-1">Équipements</h1>
                        <p className="text-gray-500 text-sm">Gérez les équipements disponibles</p>
                    </div>
                    <Link to="/admin/equipements/creer"
                        className="flex items-center gap-2 px-3 lg:px-4 py-2.5 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all no-underline shrink-0">
                        <Plus size={16} />
                        <span className="hidden sm:inline">Ajouter un équipement</span>
                        <span className="sm:hidden">Ajouter</span>
                    </Link>
                </div>

                <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Chargement...</div>
                    ) : equipements.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Aucun équipement</div>
                    ) : (
                        <>
                            <div className="hidden sm:block">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-[#F7D6E0] border-b border-gray-100">
                                            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-black">Nom</th>
                                            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-black">Créé le</th>
                                            <th className="px-5 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {equipements.map((eq) => (
                                            <tr key={eq.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-4 font-medium text-sm text-[#1a1a2e]">{eq.nom}</td>
                                                <td className="px-5 py-4 text-sm text-gray-500">{formatDate(eq.created_at)}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <Link to={`/admin/equipements/${eq.id}/modifier`}
                                                            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline">
                                                            <Pencil size={14} />
                                                        </Link>
                                                        <button onClick={() => setModal({ isOpen: true, id: eq.id })}
                                                            className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="sm:hidden divide-y divide-gray-100">
                                {equipements.map((eq) => (
                                    <div key={eq.id} className="flex items-center justify-between px-4 py-3">
                                        <div>
                                            <div className="font-medium text-sm text-[#1a1a2e]">{eq.nom}</div>
                                            <div className="text-xs text-gray-600 mt-0.5">{formatDate(eq.created_at)}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link to={`/admin/equipements/${eq.id}/modifier`}
                                                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline">
                                                <Pencil size={14} />
                                            </Link>
                                            <button onClick={() => setModal({ isOpen: true, id: eq.id })}
                                                className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {lastPage > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 lg:px-5 py-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-600">{total} équipement(s) au total</p>
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