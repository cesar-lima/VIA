'use client'
import './card.css'

import Link from 'next/link'

import { CheckCircle, Copy, MessageCircleMore, Utensils } from 'lucide-react'
import { MapPinned } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function Card() {
    const restaurantName = "Sukiya - Liberdade";
    const restaurantAddress = "Av. liberdade, 123, Liberdade";

    const handleCopy = () => {
        navigator.clipboard.writeText(`${restaurantName}, ${restaurantAddress}`);
        toast.info('Endereço copiado!', {
            icon: <CheckCircle color="#f0e7d5" size={20} />,
        });
    };

    return (
        <>
            <ToastContainer
                position="top-right" // Posição do Toast (top-right, top-center, etc.)
                autoClose={2000} // Tempo em milissegundos para o Toast desaparecer (2 segundos neste caso)
                newestOnTop={false} // Exibe os Toasts mais novos por cima dos mais antigos
                closeOnClick // Permite fechar o Toast clicando nele
                theme="light" // Define o tema do Toast (light ou dark)
            />

            <div className="card-container">
                <div className="card-header">
                    <div className="header-top">
                        <Utensils color="#212842" />
                    </div>
                    <div className="restaurant-name">{restaurantName}</div>
                    <div className="handle">
                        <div>
                            {restaurantAddress}
                        </div>

                        <div className="handle-buttons">
                            <Link href="../../restaurant">
                                <MessageCircleMore />
                            </Link>

                            <button onClick={handleCopy} className="icon-button">
                                <Copy />
                            </button>

                            <Link href={`https://maps.google.com/?q=${restaurantName}, ${restaurantAddress}`} target="_blank" rel="noopener noreferrer">
                                <MapPinned />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="card-stats">
                    <div className="stat">
                        <div className="stat-number">755</div>
                        <div className="stat-label">Avaliações</div>
                    </div>
                    <div className="stat">
                        <div className="stat-number">3/5.0</div>
                        <div className="stat-label">Nota</div>
                    </div>
                </div>
            </div>
        </>
    )
}
