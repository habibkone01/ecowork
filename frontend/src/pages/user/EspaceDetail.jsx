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
        <div className="flex">
            <SidebarUser />
            <main className="ml-0 lg:ml-65 pt-16 lg:pt-0 flex-1 min-h-screen bg-gray-50 p-4 lg:p-8">
                <div className="max-w-5xl mx-auto">

                    <div className="flex items-center gap-2 text-sm text-gray-600 my-6">
                        <Link to="/espaces" className="hover:text-gray-600 flex items-center gap-1 no-underline">
                            <ArrowLeft size={16} />
                            Les espaces
                        </Link>
                        <ChevronRight size={16} />
                        <span className="text-[#1a1a2e] font-medium truncate">{espace.nom}</span>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden mb-4 h-48 lg:h-80">
                        {espace.images?.length > 0 ? (
                            <img src={getImageUrl(espace.images[0].url)} alt={espace.nom}
                                className="w-full h-full object-cover" loading="lazy"/>
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">Pas d'image</span>
                            </div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className="text-xs font-medium px-3 py-1.5 rounded-full text-white bg-[#1a1a2e99]">{espace.type}</span>
                        </div>
                    </div>

                    {espace.images?.length > 1 && (
                        <div className="grid grid-cols-3 gap-2 lg:gap-3 mb-6">
                            {espace.images.slice(1, 4).map((img) => (
                                <div key={img.id} className="rounded-xl overflow-hidden h-16 lg:h-24 hover:scale-105 transition-all cursor-pointer">
                                    <img src={getImageUrl(img.url)} alt="" className="w-full h-full object-cover" loading="lazy" />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2 space-y-5">
                            <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100">
                                <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a2e] mb-3">{espace.nom}</h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5"><Maximize2 size={16} />{espace.surface}m²</span>
                                    <span className="flex items-center gap-1.5"><Users size={16} />{espace.capacite} pers. max.</span>
                                    <span className="flex items-center gap-1.5"><Tag size={16} />{espace.type}</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-600 mb-3">Description</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">{espace.description}</p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-600 mb-3">Équipements</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {espace.equipements?.map((eq) => (
                                        <div key={eq.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#eff7f6]">
                                            <CheckCircle size={16} className="text-[#0a7a70] shrink-0" />
                                            <span className="text-sm text-[#1a1a2e]">{eq.nom}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100 lg:sticky lg:top-8 space-y-5">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#7bdff2]">{espace.tarif_journalier}€</div>
                                    <div className="text-xs text-gray-600">par jour</div>
                                </div>

                                <hr className="border-gray-100" />

                                <div className="space-y-3 text-sm text-gray-500">
                                    <div className="flex justify-between">
                                        <span>Surface</span>
                                        <span className="font-medium text-[#1a1a2e]">{espace.surface}m²</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Capacité</span>
                                        <span className="font-medium text-[#1a1a2e]">{espace.capacite} pers.</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Type</span>
                                        <span className="font-medium text-[#1a1a2e]">{espace.type}</span>
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                <Link to={`/espaces/${espace.id}/reserver`}
                                    className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all flex items-center justify-center gap-2 no-underline">
                                    Réserver cet espace
                                </Link>
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                                    <ShieldCheck size={12} />
                                    <span>Annulation gratuite jusqu'à 24h avant</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}