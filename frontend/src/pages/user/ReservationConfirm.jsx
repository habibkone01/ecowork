import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Calendar, Clock, Check, CheckCircle, Building2 } from 'lucide-react'
import { useEffect } from 'react'
import SidebarUser from '../../components/SidebarUser'
import usePageTitle from '../../hooks/usePageTitle'

export default function ReservationConfirm() {
    usePageTitle('Confirmation de réservation')
    const { state } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!state?.reservation) navigate('/espaces')
    }, [])

    if (!state?.reservation) return null

    const { reservation, espace } = state

    const getNbJours = () => {
        const d1 = new Date(reservation.date_debut)
        const d2 = new Date(reservation.date_fin)
        return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)) 
    }

    return (
        <div className="flex bg-gray-100">
            <SidebarUser />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-100 flex items-center justify-center p-4 lg:p-8">
                <div className="max-w-lg w-full text-center">

                    <div className="w-20 h-20 mt-4 lg:w-24 lg:h-24 rounded-full flex items-center justify-center mx-auto mb-5 lg:mb-6 bg-[#eff7f6] border-4 border-[#7bdff2]">
                        <Check size={36} className="text-[#7bdff2]" />
                    </div>

                    <h1 className="text-2xl lg:text-3xl font-bold text-[#1a1a2e] mb-2">Réservation confirmée !</h1>
                    <p className="text-gray-700 text-sm lg:text-base mb-6 lg:mb-8">Votre réservation a été enregistrée avec succès. Un récapitulatif est disponible ci-dessous.</p>

                    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 text-left mb-5 lg:mb-6">
                        <div className="flex items-center gap-3 lg:gap-4 mb-5 pb-5 border-b border-gray-100">
                            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl overflow-hidden shrink-0">
                                {espace?.images?.length > 0 ? (
                                    <img src={espace.images[0].url} alt={espace.nom} className="w-full h-full object-cover" loading="lazy" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <Building2 size={24} className="text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-[#1a1a2e]">{espace?.nom}</h3>
                                <span className="text-xs px-2 py-1 rounded-lg bg-[#eff7f6] text-[#0a7a70]">{espace?.type}</span>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500 flex items-center gap-2"><Calendar size={16} />Date début</span>
                                <span className="font-medium text-[#1a1a2e]">{reservation.date_debut}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 flex items-center gap-2"><Calendar size={16} />Date fin</span>
                                <span className="font-medium text-[#1a1a2e]">{reservation.date_fin}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 flex items-center gap-2"><Clock size={16} />Durée</span>
                                <span className="font-medium text-[#1a1a2e]">{getNbJours()} jours</span>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex justify-between font-bold text-base">
                                <span className="text-[#1a1a2e]">Total payé</span>
                                <span className="text-[#7bdff2]">{reservation.prix_total}€</span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-[#eff7f6]">
                            <CheckCircle size={16} className="text-[#0a7a70]" />
                            <span className="text-xs font-medium text-[#0a7a70]">Statut : Confirmée</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link to="/reservations"
                            className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all flex items-center justify-center gap-2 no-underline">
                            <Calendar size={16} />
                            Mes réservations
                        </Link>
                        <Link to="/espaces"
                            className="flex-1 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 no-underline">
                            <Building2 size={16} />
                            Retour aux espaces
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}