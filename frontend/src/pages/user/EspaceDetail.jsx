import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Maximize2, Users, Tag, CheckCircle, ShieldCheck, CalendarCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEspace } from '../../api/espaces'
import { createReservation } from '../../api/reservations'
import SidebarUser from '../../components/SidebarUser'
import usePageTitle from '../../hooks/usePageTitle'

export default function EspaceDetail() {
    const { id } = useParams()
    const { token } = useAuth()
    const [espace, setEspace] = useState(null)
    const [loading, setLoading] = useState(true)
    const [dateDebut, setDateDebut] = useState('')
    const [dateFin, setDateFin] = useState('')
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [reservation, setReservation] = useState(null)

    useEffect(() => {
        const fetchEspace = async () => {
            try {
                const data = await getEspace(token, id)
                setEspace(data.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchEspace()
    }, [id])

    usePageTitle(espace?.nom)

    const getNbJours = () => {
        if (!dateDebut || !dateFin) return 0
        const d1 = new Date(dateDebut)
        const d2 = new Date(dateFin)
        const jours = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24))
        return jours > 0 ? jours : 0
    }

    const getTotal = () => {
        if (!espace) return 0
        return getNbJours() * parseFloat(espace.tarif_journalier)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        const today = new Date().toISOString().split('T')[0]
        if (!dateDebut) { setError('Veuillez sélectionner une date de début.'); return }
        if (dateDebut < today) { setError("La date de début doit être aujourd'hui ou dans le futur."); return }
        if (!dateFin) { setError('Veuillez sélectionner une date de fin.'); return }
        if (dateFin <= dateDebut) { setError("La date de fin doit être supérieure à la date de début."); return }

        setSubmitting(true)
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
            setReservation(data.reservation)
            setShowSuccess(true)
            setDateDebut('')
            setDateFin('')
        } catch (err) {
            setError('Erreur de connexion au serveur')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return (
        <div className="flex">
            <SidebarUser />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-400">Chargement...</div>
            </main>
        </div>
    )

    if (!espace) return (
        <div className="flex">
            <SidebarUser />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-400">Espace introuvable</div>
            </main>
        </div>
    )

    return (
        <div className="flex bg-gray-100">
            <SidebarUser />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-100 p-4 lg:p-8 overflow-x-hidden">
                <div className="w-full max-w-5xl mx-auto">

                    {/* Popup confirmation réservation */}
                    {showSuccess && reservation && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl text-center">
                                <CheckCircle size={48} className="text-[#7bdff2] mx-auto mb-4" />
                                <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">Réservation confirmée !</h2>
                                <p className="text-sm text-gray-600 mb-5">Votre réservation a été enregistrée avec succès.</p>
                                <div className="flex gap-3">
                                    <Link to="/reservations" className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all flex items-center justify-center no-underline">
                                        Mes réservations
                                    </Link>
                                    <button onClick={() => setShowSuccess(false)} className="flex-1 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                                        Fermer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600 my-6 overflow-hidden">
                        <Link to="/espaces" className="hover:text-gray-600 flex items-center gap-1 no-underline transition-colors shrink-0">
                            <ArrowLeft size={15} />
                            Les espaces
                        </Link>
                        <ChevronRight size={14} className="shrink-0" />
                        <span className="text-[#1a1a2e] font-medium truncate">{espace.nom}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

                        <div className="lg:col-span-2 space-y-4 min-w-0">

                            <div className="bg-white rounded-3xl overflow-hidden p-3 shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
                                <div className="flex gap-3 h-56 lg:h-72">
                                    <div className="relative flex-1 rounded-2xl overflow-hidden min-w-0">
                                        {espace.images?.length > 0 ? (
                                            <img src={espace.images[0].url} alt={espace.nom} className="w-full h-full object-cover" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <span className="text-gray-400 text-sm">Pas d'image</span>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="text-xs font-medium px-3 py-1.5 rounded-full text-white capitalize" style={{ backgroundColor: '#1a1a2e99' }}>
                                                {espace.categorie?.libelle || '-'}
                                            </span>
                                        </div>
                                    </div>
                                    {espace.images?.length > 1 && (
                                        <div className="flex flex-col gap-3 w-1/3">
                                            {espace.images.slice(1, 3).map((img) => (
                                                <div key={img.id} className="flex-1 rounded-2xl overflow-hidden">
                                                    <img src={img.url} alt="" className="w-full h-full object-cover object-center" loading="lazy" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-5 lg:p-6 shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
                                <h1 className="text-xl lg:text-2xl font-extrabold text-[#1a1a2e] mb-4 wrap-break-words">{espace.nom}</h1>
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 flex items-center gap-1.5"><Maximize2 size={11} /> {espace.surface}m²</span>
                                    <span className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 flex items-center gap-1.5"><Users size={11} /> {espace.capacite} pers. max.</span>
                                    <span className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 flex items-center gap-1.5 capitalize"><Tag size={11} /> {espace.categorie?.libelle || '-'}</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-5 lg:p-6 shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-600 mb-3">Description</h3>
                                <p className="text-sm text-gray-600 leading-relaxed wrap-break-words">{espace.description}</p>
                            </div>

                            <div className="bg-white rounded-3xl p-5 lg:p-6 shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-600 mb-4">Équipements</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {espace.equipements?.map((eq) => (
                                        <div key={eq.id} className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#eff7f6]">
                                            <CheckCircle size={15} className="text-[#0a7a70] shrink-0" />
                                            <span className="text-sm text-[#1a1a2e] font-medium">{eq.nom}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Formulaire*/}
                        <div className="lg:col-span-1 min-w-0">
                            <div className="bg-white rounded-3xl p-5 lg:p-6 shadow-sm lg:sticky lg:top-8" style={{ border: '1px solid #f0f0f0' }}>
                                <div className="text-center mb-5">
                                    <div className="text-4xl font-extrabold text-[#7bdff2]">{espace.tarif_journalier}€</div>
                                    <div className="text-xs text-gray-600 mt-1">par jour</div>
                                </div>
                                <hr className="border-gray-100 mb-5" />

                                {error && (
                                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
                                )}

                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="space-y-3 mb-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Date de début</label>
                                            <input
                                                type="date"
                                                value={dateDebut}
                                                onChange={(e) => { setDateDebut(e.target.value); setError(null) }}
                                                className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Date de fin</label>
                                            <input
                                                type="date"
                                                value={dateFin}
                                                onChange={(e) => { setDateFin(e.target.value); setError(null) }}
                                                className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#1a1a2e] focus:outline-none focus:border-[#7bdff2] focus:ring-2 focus:ring-[#7bdff226]"
                                            />
                                        </div>
                                    </div>

                                    {getNbJours() > 0 && (
                                        <div className="bg-gray-50 rounded-2xl p-3 mb-4 text-sm space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Durée</span>
                                                <span className="font-medium text-[#1a1a2e]">{getNbJours()} jour(s)</span>
                                            </div>
                                            <hr className="border-gray-100" />
                                            <div className="flex justify-between font-bold">
                                                <span className="text-[#1a1a2e]">Total</span>
                                                <span className="text-[#7bdff2]">{getTotal()}€</span>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3.5 rounded-2xl font-bold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mb-3"
                                    >
                                        <CalendarCheck size={16} />
                                        {submitting ? 'En cours...' : 'Réserver cet espace'}
                                    </button>
                                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-600">
                                        <ShieldCheck size={12} />
                                        <span>Annulation possible jusqu'à 24h avant</span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}