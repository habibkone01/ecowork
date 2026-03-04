import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getUsers, deleteUser } from '../../api/user'
import SidebarAdmin from '../../components/SidebarAdmin'

export default function Utilisateurs() {
    const { token } = useAuth()
    const [utilisateurs, setUtilisateurs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchUtilisateurs()
    }, [])

    const fetchUtilisateurs = async () => {
        try {
            const data = await getUsers(token)
            setUtilisateurs(data.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return
        await deleteUser(token, id)
        fetchUtilisateurs()
    }

    return (
        <div className="flex">
            <SidebarAdmin />
            <main className="ml-65 flex-1 min-h-screen bg-gray-50 p-8">

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

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Chargement...</div>
                    ) : utilisateurs.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Aucun utilisateur</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Nom</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Email</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Téléphone</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Rôle</th>
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
                                                <button onClick={() => handleDelete(u.id)}
                                                    className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    )
}