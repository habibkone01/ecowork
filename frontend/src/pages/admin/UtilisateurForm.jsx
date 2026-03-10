import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getUsers, updateUser, createUser } from '../../api/user'
import SidebarAdmin from '../../components/SidebarAdmin'
import usePageTitle from '../../hooks/usePageTitle'

export default function UtilisateurForm() {
    const { id } = useParams()
    const { token } = useAuth()
    const navigate = useNavigate()
    const isEdit = !!id
    usePageTitle(isEdit ? 'Modifier un utilisateur' : 'Ajouter un utilisateur')
    
    const [form, setForm] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
        role: 'utilisateur',
        password: '',
        password_confirmation: ''
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isEdit) {
            const fetchUser = async () => {
                const data = await getUsers(token)
                const u = data.data?.find(u => u.id === parseInt(id))
                if (u) setForm({
                    nom: u.nom || '',
                    prenom: u.prenom || '',
                    email: u.email || '',
                    telephone: u.telephone || '',
                    adresse: u.adresse || '',
                    role: u.role || 'utilisateur',
                    password: '',
                    password_confirmation: ''
                })
            }
            fetchUser()
        }
    }, [id])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const payload = {
                nom: form.nom,
                prenom: form.prenom,
                email: form.email,
                telephone: form.telephone,
                adresse: form.adresse,
                role: form.role,
            }

            if (form.password) {
                payload.password = form.password
                payload.password_confirmation = form.password_confirmation
            }

            if (isEdit) {
                await updateUser(token, id, payload)
            } else {
                if (!form.password) {
                    setError('Le mot de passe est obligatoire pour créer un compte')
                    setLoading(false)
                    return
                }
                await createUser(token, payload)
            }

            navigate('/admin/utilisateurs')

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
                <div className="max-w-2xl mx-auto">

                    <div className="flex items-center gap-3 my-6 lg:mb-8">
                        <Link to="/admin/utilisateurs" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 no-underline shrink-0">
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a2e]">{isEdit ? "Modifier l'utilisateur" : 'Ajouter un utilisateur'}</h1>
                            <p className="text-gray-500 text-sm">{isEdit ? 'Modifiez les informations du compte' : 'Créez un nouveau compte utilisateur'}</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-[#1a1a2e]">Informations personnelles</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Nom</label>
                                    <input type="text" name="nom" value={form.nom} onChange={handleChange} required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Prénom</label>
                                    <input type="text" name="prenom" value={form.prenom} onChange={handleChange} required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Email</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Téléphone</label>
                                    <input type="tel" name="telephone" value={form.telephone} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Rôle</label>
                                    <select name="role" value={form.role} onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2]">
                                        <option value="utilisateur">Utilisateur</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Adresse</label>
                                <input type="text" name="adresse" value={form.adresse} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-[#1a1a2e]">{isEdit ? 'Changer le mot de passe' : 'Mot de passe'}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">{isEdit ? 'Nouveau mot de passe' : 'Mot de passe'}</label>
                                    <input type="password" name="password" value={form.password} onChange={handleChange}
                                        placeholder="••••••••" required={!isEdit}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Confirmation</label>
                                    <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange}
                                        placeholder="••••••••" required={!isEdit}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button type="submit" disabled={loading}
                                className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                <Save size={16} />
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                            <Link to="/admin/utilisateurs"
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