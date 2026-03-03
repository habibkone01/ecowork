import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Calendar, CalendarCheck, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEspace } from '../../api/espaces'
import { createReservation } from '../../api/reservations'
import SidebarUser from '../../components/SidebarUser'

export default function ReservationForm() {
    const { id } = useParams()
    const { token } = useAuth()
    const navigate = useNavigate()
    const [espace, setEspace] = useState(null)
    const [dateDebut, setDateDebut] = useState('')
    const [dateFin, setDateFin] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchEspace = async () => {
            const data = await getEspace(token, id)
            setEspace(data.data)
        }
        fetchEspace()
    }, [id])

    const getNbJours = () => {
        if (!dateDebut || !dateFin) return 0
        const d1 = new Date(dateDebut)
        const d2 = new Date(dateFin)
        const jours = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) + 1
        return jours > 0 ? jours : 0
    }

    const getTotal = () => {
        if (!espace) return 0
        return getNbJours() * parseFloat(espace.tarif_journalier)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const data = await createReservation(token, {
                espace_id: id,
                date_debut: dateDebut,
                date_fin: dateFin
            })

            if (!data.reservation) {
                setError(data.message || 'Erreur lors de la réservation')
                return
            }

            navigate('/reservation-confirm', { state: { reservation: data.reservation, espace } })

        } catch (err) {
            setError('Erreur de connexion au serveur')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex">
            <SidebarUser />
            <main className="ml-65 flex-1 min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                        <Link to="/espaces" className="hover:text-gray-600 flex items-center gap-1 no-underline">
                            <ArrowLeft size={16} />
                            Les espaces
                        </Link>
                        <ChevronRight size={16} />
                        <Link to={`/espaces/${id}`} className="hover:text-gray-600 no-underline text-gray-400">
                            {espace?.nom}
                        </Link>
                        <ChevronRight size={16} />
                        <span className="text-[#1a1a2e] font-medium">Réservation</span>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h1 className="text-xl font-bold text-[#1a1a2e] mb-1">Réserver {espace?.nom}</h1>
                                <p className="text-sm text-gray-400 mb-6">Choisissez vos dates de réservation</p>

                                {error && (
                                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Date de début</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                    <Calendar size={16} className="text-gray-400" />
                                                </div>
                                                <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} required
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Date de fin</label>
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                                    <Calendar size={16} className="text-gray-400" />
                                                </div>
                                                <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} required
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button type="submit" disabled={loading}
                                            className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                            <CalendarCheck size={16} />
                                            {loading ? 'En cours...' : 'Confirmer la réservation'}
                                        </button>
                                        <Link to={`/espaces/${id}`}
                                            className="px-6 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all flex items-center no-underline">
                                            Annuler
                                        </Link>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
                                        <ShieldCheck size={12} />
                                        <span>Annulation gratuite jusqu'à 24h avant</span>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div>
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 sticky top-8">
                                <h2 className="font-bold text-base text-[#1a1a2e] mb-4">Récapitulatif</h2>

                                {espace && (
                                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                                            {espace.images?.length > 0 ? (
                                                <img src={espace.images[0].url} alt={espace.nom} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100"></div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-[#1a1a2e]">{espace.nom}</div>
                                            <div className="text-xs text-gray-400">{espace.type} · {espace.surface}m² · {espace.capacite} pers.</div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-500">Tarif/jour</span>
                                    <span className="font-medium text-[#1a1a2e]">{espace?.tarif_journalier}€</span>
                                </div>

                                {getNbJours() > 0 && (
                                    <>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-500">Durée</span>
                                            <span className="font-medium text-[#1a1a2e]">{getNbJours()} jour(s)</span>
                                        </div>
                                        <hr className="border-gray-100 my-3" />
                                        <div className="flex justify-between font-bold">
                                            <span className="text-[#1a1a2e]">Total</span>
                                            <span className="text-lg text-[#7bdff2]">{getTotal()}€</span>
                                        </div>
                                    </>
                                )}

                                {getNbJours() === 0 && (
                                    <div className="mt-3 text-xs text-gray-400 text-center">
                                        Sélectionnez vos dates pour voir le total
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}