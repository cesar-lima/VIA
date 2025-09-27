import Link from 'next/link'
import './card.css'

import { Copy, MessageCircleMore, Utensils } from 'lucide-react'
import { MapPinned } from 'lucide-react'

export default function Card() {
    return (
        <div className="card-container">
            <div className="card-header">
                <div className="header-top">
                    <Utensils color="#212842" />
                </div>
                <div className="restaurant-name">Sukiya - Liberdade</div>
                <div className="handle">
                    <div>
                        Av. liberdade, 123, Liberdade
                    </div>

                    <div className="handle-buttons">
                        <Link href="../../restaurant">
                            <MessageCircleMore />
                        </Link>

                        <div>
                            <Copy />
                        </div>

                        <Link href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
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
    )
}
