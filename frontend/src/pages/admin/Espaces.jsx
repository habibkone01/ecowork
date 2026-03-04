import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Maximize2, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEspaces, deleteEspace } from '../../api/espaces'
import SidebarAdmin from '../../components/SidebarAdmin'

export default function EspacesAdmin() {
    const { token } = useAuth()
    const [espaces, setEspaces] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchEspaces()
    }, [])

    const fetchEspaces = async () => {
        try {
            const data = await getEspaces(token)
            setEspaces(data.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer cet espace ?')) return
        await deleteEspace(token, id)
        fetchEspaces()
    }

    return (
        <div className="flex">
            <SidebarAdmin />
            <main className="ml-65 flex-1 min-h-screen bg-gray-50 p-8">

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

                {loading ? (
                    <div className="flex items-center justify-center h-64 text-gray-400">Chargement...</div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Espace</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Type</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Surface</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Capacité</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Tarif/jour</th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {espaces.map((espace) => (
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
                                        <td className="px-5 py-4 text-sm text-gray-500"><span className="flex items-center gap-1"><Users size={14} />{espace.capacite}</span></td>
                                        <td className="px-5 py-4 text-sm font-semibold text-[#7bdff2]">{espace.tarif_journalier}€</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Link to={`/admin/espaces/${espace.id}/modifier`}
                                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline">
                                                    <Pencil size={14} />
                                                </Link>
                                                <button onClick={() => handleDelete(espace.id)}
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
                )}
            </main>
        </div>
    )
}