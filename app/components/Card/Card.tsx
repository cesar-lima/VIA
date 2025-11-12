'use client'
import './card.css'

import Link from 'next/link'

import { CheckCircle, Copy, MessageCircleMore, Utensils } from 'lucide-react'
import { MapPinned } from 'lucide-react'

interface CardProps {
    id: number;
    name: string;
    address: string;
    cep: string;
}

export default function Card({ id, name, address, cep }: CardProps) {
    return (
        <>
            <div className="card-container">
                <div className="card-header">
                    <div className="header-top">
                        <Utensils color="#212842" />
                    </div>
                    <div className="restaurant-name">{name}</div>
                    <div className="handle">
                        <div>
                            {address} - CEP: {cep}
                        </div>

                        <div className="handle-buttons">
                            <Link href={`/pages/restaurant/${id}`}>
                                <MessageCircleMore /> Comentários
                            </Link>

                            <Link href={`https://maps.google.com/?q=${name}, ${address}`} target="_blank" rel="noopener noreferrer">
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
