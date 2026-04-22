import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getCategories, createCategorie, updateCategorie } from '../../api/categories'
import SidebarAdmin from '../../components/SidebarAdmin'
import usePageTitle from '../../hooks/usePageTitle'

export default function CategorieForm() {
    const { id } = useParams()
    const { token } = useAuth()
    const navigate = useNavigate()
    const isEdit = !!id
    const [libelle, setLibelle] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    usePageTitle(isEdit ? 'Modifier une catégorie' : 'Ajouter une catégorie')

    useEffect(() => {
        if (isEdit) {
            const fetchCategorie = async () => {
                const data = await getCategories(token)
                const cat = data.data?.find(c => c.id === parseInt(id))
                if (cat) setLibelle(cat.libelle)
            }
            fetchCategorie()
        }
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            if (isEdit) {
                await updateCategorie(token, id, { libelle })
            } else {
                await createCategorie(token, { libelle })
            }
            navigate('/admin/categories')
        } catch (err) {
            setError('Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex bg-gray-100">
            <SidebarAdmin />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-100 p-4 lg:p-8">
                <div className="max-w-lg mx-auto">

                    <div className="flex items-center gap-3 my-6 lg:mb-8">
                        <Link to="/admin/categories" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 no-underline shrink-0">
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a2e]">{isEdit ? 'Modifier' : 'Ajouter'} une catégorie</h1>
                            <p className="text-gray-700 text-sm">{isEdit ? 'Modifiez le libellé de la catégorie' : 'Ajoutez une nouvelle catégorie'}</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-sm mb-5">
                            <h3 className="font-bold text-[#1a1a2e] mb-4">Informations</h3>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Libellé de la catégorie</label>
                                <input
                                    type="text"
                                    value={libelle}
                                    onChange={(e) => setLibelle(e.target.value)}
                                    required
                                    placeholder="Ex: Bureau, Salle de réunion..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" disabled={loading}
                                className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                <Save size={16} />
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                            <Link to="/admin/categories"
                                className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all no-underline flex items-center justify-center">
                                Annuler
                            </Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}