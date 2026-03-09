import { useState } from 'react'
import { User, Mail, Phone, MapPin, Lock, Save, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { updateUser, deleteUser } from '../../api/user'
import SidebarUser from '../../components/SidebarUser'
import Modal from '../../components/Modal'

export default function Profil() {
    const { user, token, logout, updateUserContext } = useAuth()
    const [form, setForm] = useState({
        nom: user?.nom || '',
        prenom: user?.prenom || '',
        email: user?.email || '',
        telephone: user?.telephone || '',
        adresse: user?.adresse || '',
        password: '',
        password_confirmation: ''
    })
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const payload = {
                nom: form.nom, prenom: form.prenom, email: form.email,
                telephone: form.telephone, adresse: form.adresse,
            }
            if (form.password) {
                payload.password = form.password
                payload.password_confirmation = form.password_confirmation
            }
            const data = await updateUser(token, user.id, payload)
            if (!data.user) { setError(data.message || 'Erreur lors de la mise à jour'); return }
            updateUserContext(data.user)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError('Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

    const handleSupprimer = async () => {
        await deleteUser(token, user.id)
        logout()
    }

    const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]"

    return (
        <div className="flex">
            <SidebarUser />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-50 p-4 lg:p-8">
                <div className="max-w-3xl mx-auto">

                    <Modal
                        isOpen={modal}
                        title="Supprimer mon compte"
                        message="Voulez-vous vraiment supprimer votre compte ? Cette action est définitive et irréversible."
                        confirmText="Supprimer mon compte"
                        confirmColor="bg-red-500 text-white"
                        onConfirm={handleSupprimer}
                        onCancel={() => setModal(false)}
                    />

                    <div className="my-6 lg:mb-8">
                        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a2e] mb-1">Mon profil</h1>
                        <p className="text-gray-500 text-sm">Gérez vos informations personnelles</p>
                    </div>

                    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 mb-5 flex items-center gap-4 lg:gap-6">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ background: 'linear-gradient(135deg, #7bdff2, #b2f7ef)' }}>
                            <User size={28} className="text-[#1a1a2e]" />
                        </div>
                        <div>
                            <h2 className="text-lg lg:text-xl font-bold text-[#1a1a2e]">{user?.prenom} {user?.nom}</h2>
                            <p className="text-gray-600 text-sm mb-2">{user?.email}</p>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#eff7f6] text-[#0a7a70] border border-[#b2f7ef]">
                                Collaborateur
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 mb-5">
                        <h3 className="font-bold text-[#1a1a2e] mb-5">Informations personnelles</h3>

                        {success && (
                            <div className="mb-4 p-3 rounded-xl bg-[#eff7f6] border border-[#b2f7ef] text-[#0a7a70] text-sm">
                                Profil mis à jour avec succès !
                            </div>
                        )}
                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Nom</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2"><User size={16} className="text-gray-400" /></div>
                                        <input type="text" name="nom" value={form.nom} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Prénom</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2"><User size={16} className="text-gray-400" /></div>
                                        <input type="text" name="prenom" value={form.prenom} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Email</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2"><Mail size={16} className="text-gray-400" /></div>
                                    <input type="email" name="email" value={form.email} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Téléphone</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2"><Phone size={16} className="text-gray-400" /></div>
                                        <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Adresse</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2"><MapPin size={16} className="text-gray-400" /></div>
                                        <input type="text" name="adresse" value={form.adresse} onChange={handleChange} className={inputClass} />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100 my-5" />

                            <h3 className="font-semibold text-sm text-[#1a1a2e] mb-4">Changer le mot de passe</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Nouveau mot de passe</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2"><Lock size={16} className="text-gray-400" /></div>
                                        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Confirmation</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2"><Lock size={16} className="text-gray-400" /></div>
                                        <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} placeholder="••••••••" className={inputClass} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button type="submit" disabled={loading}
                                    className="px-6 py-3 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                    <Save size={16} />
                                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                                <button type="button" onClick={() => setForm({ ...form, password: '', password_confirmation: '' })}
                                    className="px-6 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-red-100">
                        <h3 className="font-bold text-red-600 mb-2">Zone de danger</h3>
                        <p className="text-sm text-gray-500 mb-4">La suppression de votre compte est définitive et irréversible.</p>
                        <button onClick={() => setModal(true)}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm border border-red-200 text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-2">
                            <Trash2 size={16} />
                            Supprimer mon compte
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}