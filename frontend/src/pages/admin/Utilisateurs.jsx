import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getUsers, deleteUser } from '../../api/user'
import SidebarAdmin from '../../components/SidebarAdmin'
import Modal from '../../components/Modal'

export default function Utilisateurs() {
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
        <div className="flex">
            <SidebarAdmin />
            <main className="ml-65 flex-1 min-h-screen bg-gray-50 p-8">

                <Modal
                    isOpen={modal.isOpen}
                    title="Supprimer l'utilisateur"
                    message="Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible."
                    confirmText="Supprimer"
                    confirmColor="bg-red-500 text-white"
                    onConfirm={handleDelete}
                    onCancel={() => setModal({ isOpen: false, id: null })}
                />

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Utilisateurs</h1>
                        <p className="text-gray-500 text-sm">Gérez les comptes utilisateurs</p>
                    </div>
                    <Link to="/admin/utilisateurs/creer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all no-underline">
                        <Plus size={16} />
                        Ajouter un utilisateur
                    </Link>
                </div>

                <form onSubmit={handleFilter} className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Rechercher</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2"><Search size={16} className="text-gray-400" /></div>
                                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Nom, prénom ou email..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#7bdff2]" />
                            </div>
                        </div>
                        <button type="submit"
                            className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all flex items-center gap-2">
                            <Search size={16} />
                            Rechercher
                        </button>
                        <button type="button" onClick={handleReset}
                            className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                            Réinitialiser
                        </button>
                    </div>
                </form>

                <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Chargement...</div>
                    ) : utilisateurs.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Aucun utilisateur trouvé</div>
                    ) : (
                        <>
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-200 border-b border-gray-100">
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
                                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#eff7f6] text-[#0d9488] text-xs font-bold shrink-0">
                                                        {u.prenom?.[0]}{u.nom?.[0]}
                                                    </div>
                                                    <span className="font-medium text-sm text-[#1a1a2e]">{u.prenom} {u.nom}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-gray-500">{u.email}</td>
                                            <td className="px-5 py-4 text-sm text-gray-500">{u.telephone || '—'}</td>
                                            <td className="px-5 py-4">
                                                {u.role === 'admin' ? (
                                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#1a1a2e] text-[#7bdff2]">Admin</span>
                                                ) : (
                                                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">Utilisateur</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Link to={`/admin/utilisateurs/${u.id}/modifier`}
                                                        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline">
                                                        <Pencil size={14} />
                                                    </Link>
                                                    <button onClick={() => setModal({ isOpen: true, id: u.id })}
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
                                    <p className="text-sm text-gray-400">{total} utilisateur(s) au total</p>
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