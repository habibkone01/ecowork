import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getUsers, deleteUser } from '../../api/user'
import SidebarAdmin from '../../components/SidebarAdmin'
import Modal from '../../components/Modal'
import usePageTitle from '../../hooks/usePageTitle'

export default function Utilisateurs() {
    usePageTitle('Utilisateurs')
    const { token } = useAuth()
    const [utilisateurs, setUtilisateurs] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState({ isOpen: false, id: null })
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchUtilisateurs(1)
    }, [])

    const fetchUtilisateurs = async (page = 1, params = {}) => {
        setLoading(true)
        try {
            const data = await getUsers(token, page, params)
            setUtilisateurs(data.data || [])
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
        fetchUtilisateurs(1, { search })
    }

    const handleReset = () => {
        setSearch('')
        fetchUtilisateurs(1)
    }

    const handleDelete = async () => {
        await deleteUser(token, modal.id)
        setModal({ isOpen: false, id: null })
        fetchUtilisateurs(currentPage, { search })
    }

    const handlePage = (page) => {
        fetchUtilisateurs(page, { search })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="flex bg-gray-100">
            <SidebarAdmin />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-100 p-4 lg:p-8 overflow-x-hidden">

                <Modal
                    isOpen={modal.isOpen}
                    title="Supprimer l'utilisateur"
                    message="Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible."
                    confirmText="Supprimer"
                    confirmColor="bg-red-500 text-white"
                    onConfirm={handleDelete}
                    onCancel={() => setModal({ isOpen: false, id: null })}
                />

                <div className="flex items-center justify-between my-6 lg:mb-8 gap-3">
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a2e] mb-1">Utilisateurs</h1>
                        <p className="text-gray-700 text-sm">Gérez les comptes utilisateurs</p>
                    </div>
                    <Link to="/admin/utilisateurs/creer" className="flex items-center gap-2 px-3 lg:px-4 py-2.5 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all no-underline shrink-0">
                        <Plus size={16} />
                        <span className="hidden sm:inline">Ajouter un utilisateur</span>
                        <span className="sm:hidden">Ajouter</span>
                    </Link>
                </div>

                <div className="flex justify-center mb-6">
                    <form onSubmit={handleFilter} className="w-full max-w-3xl bg-white overflow-hidden flex flex-col sm:flex-row" style={{ border: '0.5px solid #e0e0d8', borderRadius: '14px' }}>
                        <div className="flex items-center gap-2 px-4 py-3 sm:py-0 sm:h-12 flex-1 border-b sm:border-b-0 sm:border-r border-gray-100">
                            <Search size={14} className="text-gray-400 shrink-0" />
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nom, prénom ou email..." className="border-none bg-transparent text-sm text-gray-700 outline-none w-full min-w-0" />
                        </div>
                        <button type="button" onClick={handleReset} className="flex items-center justify-center px-5 py-3 sm:py-0 sm:h-12 text-sm text-gray-500 border-b sm:border-b-0 sm:border-r border-gray-100 shrink-0 transition-colors">
                            Réinitialiser
                        </button>
                        <button type="submit" className="flex items-center justify-center gap-2 px-7 py-3 sm:py-0 sm:h-12 text-sm font-medium text-[#1A1A2E] hover:opacity-90 transition-opacity shrink-0" style={{ backgroundColor: '#7BDFF2' }}>
                            <Search size={13} />
                            Rechercher
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Chargement...</div>
                    ) : utilisateurs.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Aucun utilisateur trouvé</div>
                    ) : (
                        <>
                            <div className="hidden lg:block">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-900">Nom</th>
                                            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-900">Email</th>
                                            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-900">Téléphone</th>
                                            <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-900">Rôle</th>
                                            <th className="px-5 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {utilisateurs.map((u) => (
                                            <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#eff7f6] text-[#0a7a70] text-xs font-bold shrink-0">
                                                            {u.prenom?.[0]}{u.nom?.[0]}
                                                        </div>
                                                        <span className="font-medium text-sm text-[#1a1a2e]">{u.prenom} {u.nom}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{u.email}</td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{u.telephone || '—'}</td>
                                                <td className="px-5 py-4">
                                                    {u.role === 'admin' ? (
                                                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#1a1a2e] text-[#7bdff2]">Admin</span>
                                                    ) : (
                                                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">Utilisateur</span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <Link to={`/admin/utilisateurs/${u.id}/modifier`} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline">
                                                            <Pencil size={14} />
                                                        </Link>
                                                        <button onClick={() => setModal({ isOpen: true, id: u.id })} className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="lg:hidden divide-y divide-gray-100">
                                {utilisateurs.map((u) => (
                                    <div key={u.id} className="flex items-center gap-3 p-4">
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-[#eff7f6] text-[#0a7a70] text-xs font-bold shrink-0">
                                            {u.prenom?.[0]}{u.nom?.[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm text-[#1a1a2e] truncate">{u.prenom} {u.nom}</span>
                                                {u.role === 'admin' ? (
                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#1a1a2e] text-[#7bdff2] shrink-0">Admin</span>
                                                ) : (
                                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">Utilisateur</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-600 truncate mt-0.5">{u.email}</div>
                                            {u.telephone && <div className="text-xs text-gray-600 mt-0.5">{u.telephone}</div>}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Link to={`/admin/utilisateurs/${u.id}/modifier`} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline">
                                                <Pencil size={14} />
                                            </Link>
                                            <button onClick={() => setModal({ isOpen: true, id: u.id })} className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {lastPage > 1 && (
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 lg:px-5 py-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-600">{total} utilisateur(s) au total</p>
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
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}