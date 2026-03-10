import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Building2, CalendarCheck, Leaf, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { login as loginApi } from '../../api/auth'
import logo from '../../assets/logo.png'
import imgLogin from '../../assets/imglogin.jpeg'
import usePageTitle from '../../hooks/usePageTitle'

export default function Login() {
    usePageTitle('Connexion')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const data = await loginApi(email, password)

            if (!data.token) {
                setError(data.message || 'Email ou mot de passe incorrect')
                return
            }

            login(data.user, data.token)

            if (data.user.role === 'admin') {
                navigate('/admin/dashboard')
            } else {
                navigate('/espaces')
            }

        } catch (err) {
            setError('Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">

            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1a1a2e]">
                
                <img src={imgLogin} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
                <div className="absolute inset-0 bg-linear-to-br from-[#7bdff226] via-transparent to-transparent"></div>

                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <img src={logo} alt="EcoWork" className="h-8 object-contain object-left" />
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                            Des espaces pensés pour votre <span className="text-[#7bdff2]">productivité</span>
                        </h1>
                        <p className="text-gray-400 text-lg mb-10">
                            Réservez des espaces de coworking éco-responsables au cœur du 11ème arrondissement de Paris.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#7bdff214] border border-[#7bdff226]">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[#7bdff226]">
                                    <Building2 size={20} className="text-[#7bdff2]" />
                                </div>
                                <div>
                                    <div className="text-white font-medium text-sm">Espaces modernes</div>
                                    <div className="text-gray-500 text-xs">Bureaux, salles de réunion et conférences</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#7bdff214] border border-[#7bdff226]">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[#7bdff226]">
                                    <CalendarCheck size={20} className="text-[#7bdff2]" />
                                </div>
                                <div>
                                    <div className="text-white font-medium text-sm">Réservation simple</div>
                                    <div className="text-gray-500 text-xs">Réservez en quelques clics, disponibilité en temps réel</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-[#7bdff214] border border-[#7bdff226]">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[#7bdff226]">
                                    <Leaf size={20} className="text-[#7bdff2]" />
                                </div>
                                <div>
                                    <div className="text-white font-medium text-sm">Éco-responsable</div>
                                    <div className="text-gray-500 text-xs">Plateforme conçue selon les principes de sobriété numérique</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="text-gray-600 text-sm">© 2026 GreenSpace — 11ème arrondissement, Paris</div>
                </div>
            </div>

            
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-3 mb-8">
                        <img src={logo} alt="EcoWork" className="h-7 object-contain" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-[#1a1a2e]">Bon retour !</h2>
                    <p className="text-gray-500 mb-8">Connectez-vous pour accéder à votre espace</p>

                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-sm font-medium mb-2 text-[#1a1a2e]">Adresse email</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <Mail size={16} className="text-gray-400" />
                                </div>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Entrez votre email" required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2 text-[#1a1a2e]">Mot de passe</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    <Lock size={16} className="text-gray-400" />
                                </div>
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Entrez votre mot de passe" required
                                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full py-3 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all disabled:opacity-50">
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-gray-600 text-sm">ou</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>
                    <p className="text-center text-sm text-gray-500">
                        Pas encore de compte ?{' '}
                        <Link to="/register" className="font-semibold text-[#7bdff2] hover:underline">S'inscrire</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}