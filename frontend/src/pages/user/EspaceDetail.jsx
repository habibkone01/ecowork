import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronRight, Maximize2, Users, Tag, CheckCircle, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getEspace } from '../../api/espaces'
import SidebarUser from '../../components/SidebarUser'

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

    if (loading) return (
        <div className="flex">
            <SidebarUser />
            <main className="ml-65 flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-400">Chargement...</div>
            </main>
        </div>
    )

    if (!espace) return (
        <div className="flex">
            <SidebarUser />
            <main className="ml-65 flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-400">Espace introuvable</div>
            </main>
        </div>
    )

    return (
        <div className="flex">
            <SidebarUser />
            <main className="ml-65 flex-1 min-h-screen bg-gray-50 p-8">
                <div className="max-w-4xl mx-auto">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                        <Link to="/espaces" className="hover:text-gray-600 flex items-center gap-1 no-underline">
                            <ArrowLeft size={16} />
                            Les espaces
                        </Link>
                        <ChevronRight size={16} />
                        <span className="text-[#1a1a2e] font-medium">{espace.nom}</span>
                    </div>

                    {/* Image principale */}
                    <div className="relative rounded-2xl overflow-hidden mb-4 h-80">
                        {espace.images?.length > 0 ? (
                            <img src={getImageUrl(espace.images[0].url)} alt={espace.nom}
                                className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">Pas d'image</span>
                            </div>
                        )}
                        <div className="absolute top-4 left-4">
                            <span className="text-xs font-medium px-3 py-1.5 rounded-full text-white bg-[#1a1a2e99]">{espace.type}</span>
                        </div>
                    </div>

                    {/* Galerie */}
                    {espace.images?.length > 1 && (
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {espace.images.slice(1, 4).map((img) => (
                                <div key={img.id} className="rounded-xl overflow-hidden h-24 hover:scale-105 transition-all cursor-pointer">
                                    <img src={getImageUrl(img.url)} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Fiche espace */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-5">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">{espace.nom}</h1>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5"><Maximize2 size={16} />{espace.surface}m²</span>
                                    <span className="flex items-center gap-1.5"><Users size={16} />{espace.capacite} personnes max.</span>
                                    <span className="flex items-center gap-1.5"><Tag size={16} />{espace.type}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-[#7bdff2]">{espace.tarif_journalier}€</div>
                                <div className="text-xs text-gray-400">par jour</div>
                            </div>
                        </div>

                        <hr className="border-gray-100 my-4" />

                        {/* Description */}
                        <div className="mb-5">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-2">Description</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">{espace.description}</p>
                        </div>

                        <hr className="border-gray-100 my-4" />

                        {/* Équipements */}
                        <div>
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-3">Équipements</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {espace.equipements?.map((eq) => (
                                    <div key={eq.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-[#eff7f6]">
                                        <CheckCircle size={16} className="text-[#0d9488] shrink-0" />
                                        <span className="text-sm text-[#1a1a2e]">{eq.nom}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bouton réserver */}
                    <Link to={`/espaces/${espace.id}/reserver`}
                        className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#7bdff2] text-[#1a1a2e] hover:bg-[#5dd4e8] transition-all flex items-center justify-center gap-2 no-underline">
                        Réserver cet espace
                    </Link>
                    <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
                        <ShieldCheck size={12} />
                        <span>Annulation gratuite jusqu'à 24h avant</span>
                    </div>
                </div>
            </main>
        </div>
    )
}