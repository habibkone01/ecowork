import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, CheckCircle } from 'lucide-react'
import { register as registerApi } from '../../api/auth'
import logo from '../../assets/logo.png'
import imgRegister from '../../assets/imgregister.jpeg'

export default function Register() {
    const [form, setForm] = useState({
        nom: '', prenom: '', email: '', telephone: '',
        adresse: '', password: '', password_confirmation: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [rgpd, setRgpd] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const data = await registerApi(form)

            if (!data.user) {
                setError(data.message || "Erreur lors de l'inscription")
                return
            }

            navigate('/login')

        } catch (err) {
            setError('Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">

            <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-[#1a1a2e]">
                <img src={imgRegister} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
                <div className="absolute inset-0 bg-linear-to-br from-[#7bdff226] via-transparent to-transparent"></div>
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <img src={logo} alt="EcoWork" className="h-8 object-contain object-left" />
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                            Rejoignez la communauté <span className="text-[#7bdff2]">GreenSpace</span>
                        </h1>
                        <p className="text-gray-400 mb-8">Créez votre compte et commencez à réserver des espaces de travail éco-responsables.</p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <CheckCircle size={16} className="text-[#7bdff2]" />
                                <span className="text-gray-400 text-sm">Inscription gratuite</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle size={16} className="text-[#7bdff2]" />
                                <span className="text-gray-400 text-sm">Accès immédiat aux espaces</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle size={16} className="text-[#7bdff2]" />
                                <span className="text-gray-400 text-sm">Données sécurisées</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-gray-600 text-sm">© 2026 GreenSpace — Paris 11ème</div>
                </div>
            </div>

            
            <div className="w-full lg:w-3/5 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
                <div className="w-full max-w-lg py-8">
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <img src={logo} alt="EcoWork" className="h-7 object-contain" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-[#1a1a2e]">Créer un compte</h2>
                    <p className="text-gray-500 mb-8">Remplissez le formulaire pour rejoindre EcoWork</p>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#1a1a2e]">Nom</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2"><User size={16} className="text-gray-400" /></div>
                                    <input type="text" name="nom" value={form.nom} onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#1a1a2e]">Prénom</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2"><User size={16} className="text-gray-400" /></div>
                                    <input type="text" name="prenom" value={form.prenom} onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#1a1a2e]">Adresse email</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2"><Mail size={16} className="text-gray-400" /></div>
                                <input type="email" name="email" value={form.email} onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#1a1a2e]">Téléphone</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2"><Phone size={16} className="text-gray-400" /></div>
                                <input type="tel" name="telephone" value={form.telephone} onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#1a1a2e]">Adresse</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2"><MapPin size={16} className="text-gray-400" /></div>
                                <input type="text" name="adresse" value={form.adresse} onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#1a1a2e]">Mot de passe</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2"><Lock size={16} className="text-gray-400" /></div>
                                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-[#1a1a2e]">Confirmer le mot de passe</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2"><Lock size={16} className="text-gray-400" /></div>
                                <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-xl  ">
                            <input type="checkbox" id="rgpd" checked={rgpd} onChange={(e) => setRgpd(e.target.checked)} required
                                className="mt-0.5 w-4 h-4 shrink-0 cursor-pointer accent-[#7bdff2]" />
                            <label htmlFor="rgpd" className="text-xs leading-relaxed cursor-pointer text-gray-600">
                                J'accepte que mes données personnelles soient utilisées par GreenSpace dans le cadre de la plateforme EcoWork, conformément à la politique de confidentialité. Ces données ne seront jamais transmises à des tiers.
                            </label>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all disabled:opacity-50">
                            {loading ? 'Inscription...' : 'Créer mon compte'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Déjà un compte ?{' '}
                        <Link to="/login" className="font-semibold text-[#7bdff2] hover:underline">Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}