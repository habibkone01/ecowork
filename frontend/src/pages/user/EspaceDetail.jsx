import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Maximize2, Users, Tag, CheckCircle, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEspace } from '../../api/espaces'
import SidebarUser from '../../components/SidebarUser'
import usePageTitle from '../../hooks/usePageTitle'

export default function EspaceDetail() {
    const { id } = useParams()
    const { token } = useAuth()
    const [espace, setEspace] = useState(null)
    const [loading, setLoading] = useState(true)

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

    const getImageUrl = (url) => url
    usePageTitle(espace?.nom)

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
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-100 p-4 lg:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-600 my-6">
                        <Link to="/espaces" className="hover:text-gray-600 flex items-center gap-1 no-underline transition-colors">
                            <ArrowLeft size={15} />
                            Les espaces
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-[#1a1a2e] font-medium truncate">{espace.nom}</span>
                    </div>

                    <div className="bg-white rounded-3xl overflow-hidden p-3 mb-6 shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
                        <div className="flex gap-3 h-56 lg:h-80">
                            <div className="relative flex-1 rounded-2xl overflow-hidden">
                                {espace.images?.length > 0 ? (
                                    <img src={getImageUrl(espace.images[0].url)} alt={espace.nom} className="w-full h-full object-cover" loading="lazy" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-gray-400 text-sm">Pas d'image</span>
                                    </div>
                                )}
                                <div className="absolute top-3 left-3">
                                    <span className="text-xs font-medium px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: '#1a1a2e99' }}>{espace.type}</span>
                                </div>
                            </div>
                            {espace.images?.length > 1 && (
                                <div className="flex flex-col gap-3 w-1/3">
                                    {espace.images.slice(1, 3).map((img) => (
                                        <div key={img.id} className="flex-1 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all">
                                            <img src={getImageUrl(img.url)} alt="" className="w-full h-full object-cover object-center" loading="lazy" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white rounded-3xl p-5 lg:p-6 shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
                                <h1 className="text-xl lg:text-2xl font-extrabold text-[#1a1a2e] mb-4">{espace.nom}</h1>
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 flex items-center gap-1.5"><Maximize2 size={11} /> {espace.surface}m²</span>
                                    <span className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 flex items-center gap-1.5"><Users size={11} /> {espace.capacite} pers. max.</span>
                                    <span className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 flex items-center gap-1.5"><Tag size={11} /> {espace.type}</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-5 lg:p-6 shadow-sm" style={{ border: '1px solid #f0f0f0' }}>
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-600 mb-3">Description</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{espace.description}</p>
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

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl p-5 lg:p-6 shadow-sm lg:sticky lg:top-8" style={{ border: '1px solid #f0f0f0' }}>
                                <div className="text-center mb-5">
                                    <div className="text-4xl font-extrabold text-[#7bdff2]">{espace.tarif_journalier}€</div>
                                    <div className="text-xs text-gray-600 mt-1">par jour</div>
                                </div>
                                <hr className="border-gray-100 mb-5" />
                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                        <span className="text-sm text-gray-500">Surface</span>
                                        <span className="text-sm font-semibold text-[#1a1a2e]">{espace.surface}m²</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                        <span className="text-sm text-gray-500">Capacité</span>
                                        <span className="text-sm font-semibold text-[#1a1a2e]">{espace.capacite} pers.</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-gray-500">Type</span>
                                        <span className="text-sm font-semibold text-[#1a1a2e]">{espace.type}</span>
                                    </div>
                                </div>
                                <Link to={`/espaces/${espace.id}/reserver`} className="w-full py-3.5 rounded-2xl font-bold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all flex items-center justify-center no-underline mb-3">
                                    Réserver cet espace
                                </Link>
                                <div className="flex items-center justify-center gap-1.5 text-xs text-gray-600">
                                    <ShieldCheck size={12} />
                                    <span>Annulation possible jusqu'à 24h avant</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}