import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEquipements, deleteEquipement } from '../../api/equipements'
import SidebarAdmin from '../../components/SidebarAdmin'

export default function Equipements() {
    const { token } = useAuth()
    const [equipements, setEquipements] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchEquipements()
    }, [])

    const fetchEquipements = async () => {
        try {
            const data = await getEquipements(token)
            setEquipements(data.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Voulez-vous vraiment supprimer cet équipement ?')) return
        await deleteEquipement(token, id)
        fetchEquipements()
    }

    return (
        <div className="flex">
            <SidebarAdmin />
            <main className="ml-65 flex-1 min-h-screen bg-gray-50 p-8">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">Équipements</h1>
                        <p className="text-gray-500 text-sm">Gérez les équipements disponibles</p>
                    </div>
                    <Link to="/admin/equipements/creer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all no-underline">
                        <Plus size={16} />
                        Ajouter un équipement
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Chargement...</div>
                    ) : equipements.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Aucun équipement</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Nom</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Créé le</th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {equipements.map((eq) => (
                                    <tr key={eq.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 font-medium text-sm text-[#1a1a2e]">{eq.nom}</td>
                                        <td className="px-5 py-4 text-sm text-gray-500">{eq.created_at}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Link to={`/admin/equipements/${eq.id}/modifier`}
                                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors no-underline">
                                                    <Pencil size={14} />
                                                </Link>
                                                <button onClick={() => handleDelete(eq.id)}
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