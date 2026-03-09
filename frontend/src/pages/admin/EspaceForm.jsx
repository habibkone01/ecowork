import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEspace, createEspace, updateEspace } from '../../api/espaces'
import { getEquipements } from '../../api/equipements'
import SidebarAdmin from '../../components/SidebarAdmin'

export default function EspaceForm() {
    const { id } = useParams()
    const { token } = useAuth()
    const navigate = useNavigate()
    const isEdit = !!id

    const [form, setForm] = useState({
        nom: '',
        type: '',
        surface: '',
        capacite: '',
        description: '',
        tarif_journalier: '',
        equipements: []
    })
    const [listeEquipements, setListeEquipements] = useState([])
    const [images, setImages] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const equipementsData = await getEquipements(token)
            setListeEquipements(equipementsData.data || [])

            if (isEdit) {
                const data = await getEspace(token, id)
                const e = data.data
                setForm({
                    nom: e.nom || '',
                    type: e.type || '',
                    surface: e.surface || '',
                    capacite: e.capacite || '',
                    description: e.description || '',
                    tarif_journalier: e.tarif_journalier || '',
                    equipements: e.equipements?.map(eq => eq.id) || []
                })
            }
        }
        fetchData()
    }, [id])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const toggleEquipement = (eqId) => {
        setForm(prev => ({
            ...prev,
            equipements: prev.equipements.includes(eqId)
                ? prev.equipements.filter(e => e !== eqId)
                : [...prev.equipements, eqId]
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const formData = new FormData()
            Object.entries(form).forEach(([key, value]) => {
                if (key === 'equipements') {
                    value.forEach(id => formData.append('equipements[]', id))
                } else {
                    formData.append(key, value)
                }
            })
            images.forEach(img => formData.append('images[]', img))

            if (isEdit) {
                formData.append('_method', 'PUT')
                await updateEspace(token, id, formData)
            } else {
                await createEspace(token, formData)
            }

            navigate('/admin/espaces')

        } catch (err) {
            setError('Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex">
            <SidebarAdmin />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-50 p-4 lg:p-8">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 my-6 lg:mb-8">
                        <Link to="/admin/espaces" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 no-underline shrink-0">
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a2e]">{isEdit ? 'Modifier' : 'Ajouter'} un espace</h1>
                            <p className="text-gray-500 text-sm">{isEdit ? "Modifiez les informations de l'espace" : 'Remplissez les informations du nouvel espace'}</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-[#1a1a2e]">Informations générales</h3>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Nom</label>
                                <input type="text" name="nom" value={form.nom} onChange={handleChange} required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Type</label>
                                    <select name="type" value={form.type} onChange={handleChange} required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2]">
                                        <option value="">Choisir un type</option>
                                        <option value="bureau">Bureau</option>
                                        <option value="salle de réunion">Salle de réunion</option>
                                        <option value="conférence">Conférence</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Tarif/jour (€)</label>
                                    <input type="number" name="tarif_journalier" value={form.tarif_journalier} onChange={handleChange} required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Surface (m²)</label>
                                    <input type="number" name="surface" value={form.surface} onChange={handleChange} required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Capacité (personnes)</label>
                                    <input type="number" name="capacite" value={form.capacite} onChange={handleChange} required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Description</label>
                                <textarea name="description" value={form.description} onChange={handleChange} rows={4} required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226] resize-none" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#1a1a2e] mb-4">Équipements</h3>
                            {listeEquipements.length === 0 ? (
                                <p className="text-sm text-gray-600">Aucun équipement disponible</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {listeEquipements.map((eq) => (
                                        <label key={eq.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                                            <input type="checkbox"
                                                checked={form.equipements.includes(eq.id)}
                                                onChange={() => toggleEquipement(eq.id)}
                                                className="accent-[#7bdff2] w-4 h-4 shrink-0" />
                                            <span className="text-sm text-[#1a1a2e]">{eq.nom}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-sm">
                            <h3 className="font-bold text-[#1a1a2e] mb-4">Images</h3>
                            <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files))}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#eff7f6] file:text-[#0a7a70] hover:file:bg-[#b2f7ef]" />
                            {images.length > 0 && (
                                <p className="text-xs text-gray-600 mt-2">{images.length} image(s) sélectionnée(s)</p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" disabled={loading}
                                className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                <Save size={16} />
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                            <Link to="/admin/espaces"
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