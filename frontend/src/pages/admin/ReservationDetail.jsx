import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, CheckCircle, Clock, Building2, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getReservation, deleteReservation } from '../../api/reservations'
import SidebarAdmin from '../../components/SidebarAdmin'
import Modal from '../../components/Modal'
import usePageTitle from '../../hooks/usePageTitle'

export default function ReservationDetail() {
    usePageTitle('Détail réservation')
    const { id } = useParams()
    const { token } = useAuth()
    const navigate = useNavigate()
    const [reservation, setReservation] = useState(null)
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState({ isOpen: false })

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const data = await getReservation(token, id)
                setReservation(data.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchReservation()
    }, [id])

    const handleDelete = async () => {
        await deleteReservation(token, id)
        setModal({ isOpen: false })
        navigate('/admin/reservations')
    }

    const getNbJours = () => {
        if (!reservation) return 0
        const d1 = new Date(reservation.date_debut)
        const d2 = new Date(reservation.date_fin)
        return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24))
    }

    if (loading) return (
        <div className="flex">
            <SidebarAdmin />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-gray-400">Chargement...</div>
            </main>
        </div>
    )

    if (!reservation) return (
        <div className="flex">
            <SidebarAdmin />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-gray-400">Réservation introuvable</div>
            </main>
        </div>
    )

    return (
        <div className="flex bg-gray-100">
            <SidebarAdmin />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-100 p-4 lg:p-8">
                <div className="max-w-2xl mx-auto">

                    <Modal
                        isOpen={modal.isOpen}
                        title="Supprimer la réservation"
                        message="Voulez-vous vraiment supprimer cette réservation ? Elle sera archivée et ne sera plus visible."
                        confirmText="Supprimer"
                        confirmColor="bg-red-500 text-white"
                        onConfirm={handleDelete}
                        onCancel={() => setModal({ isOpen: false })}
                    />

                    {/* Header */}
                    <div className="flex items-center gap-3 my-6 lg:mb-8">
                        <Link to="/admin/reservations" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 no-underline shrink-0">
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a2e]">Détail de la réservation</h1>
                            <p className="text-gray-700 text-sm">Réservation #{reservation.id}</p>
                        </div>
                    </div>

                    {/* Statut */}
                    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-sm mb-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-[#1a1a2e]">Statut</h3>
                            {reservation.statut === 'confirmée' ? (
                                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#eff7f6] text-[#0a7a70]">Confirmée</span>
                            ) : (
                                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-red-50 text-red-500">Annulée</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                            <h3 className="font-bold text-[#1a1a2e]">Facture</h3>
                            {reservation.facture_acquittee ? (
                                <span className="flex items-center gap-1 text-xs font-medium text-[#0a7a70]">
                                    <CheckCircle size={14} /> Acquittée
                                </span>
                            ) : (
                                <span className="text-xs font-medium text-gray-400">Non acquittée</span>
                            )}
                        </div>
                    </div>

                    {/* Utilisateur */}
                    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-sm mb-4">
                        <h3 className="font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
                            <User size={16} /> Utilisateur
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Nom</span>
                                <span className="font-medium text-[#1a1a2e]">{reservation.user?.prenom} {reservation.user?.nom}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Email</span>
                                <span className="font-medium text-[#1a1a2e]">{reservation.user?.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Téléphone</span>
                                <span className="font-medium text-[#1a1a2e]">{reservation.user?.telephone || '—'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Espace */}
                    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-sm mb-4">
                        <h3 className="font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
                            <Building2 size={16} /> Espace
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Nom</span>
                                <span className="font-medium text-[#1a1a2e]">{reservation.espace?.nom}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Catégorie</span>
                                <span className="font-medium text-[#1a1a2e] capitalize">{reservation.espace?.categorie?.libelle || '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tarif/jour</span>
                                <span className="font-medium text-[#1a1a2e]">{reservation.espace?.tarif_journalier}€</span>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-gray-100 shadow-sm mb-4">
                        <h3 className="font-bold text-[#1a1a2e] mb-4 flex items-center gap-2">
                            <Calendar size={16} /> Dates
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Date début</span>
                                <span className="font-medium text-[#1a1a2e]">{reservation.date_debut}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Date fin</span>
                                <span className="font-medium text-[#1a1a2e]">{reservation.date_fin}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Durée</span>
                                <span className="font-medium text-[#1a1a2e] flex items-center gap-1">
                                    <Clock size={13} /> {getNbJours()} jour(s)
                                </span>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex justify-between font-bold">
                                <span className="text-[#1a1a2e]">Total</span>
                                <span className="text-[#7bdff2]">{reservation.prix_total}€</span>
                            </div>
                        </div>
                    </div>

                    {/* Bouton supprimer */}
                    <button
                        onClick={() => setModal({ isOpen: true })}
                        className="w-full py-3 rounded-xl font-semibold text-sm bg-red-500 text-white hover:bg-red-600 transition-all"
                    >
                        Supprimer la réservation
                    </button>
                </div>
            </main>
        </div>
    )
}