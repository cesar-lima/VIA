import './style.css'

import Comment from '../../components/Comment/Comment'
import CommentButton from '../../components/CommentButton/CommentButton'

export default function Restaurant() {
    return (
        <section id="restaurant-page">
            <div className="restaurant-title">
                <div>
                    <div className="restaurant-name">
                        Sukiya - Liberdade
                    </div>

                    <div className="restaurant-address">
                        Av. Liberdade, 164 - São Paulo, SP
                    </div>
                </div>

                <CommentButton />
            </div>

            <div className="acessibility-tags">
                <p>
                    Recursos de acessibilidade disponíveis:
                </p>

                <div className="tags-container">
                    <div className="tag">Rampa para cadeirantes</div>
                    <div className="tag">Banheiro acessível</div>
                    <div className="tag">Cardápio em braile</div>
                    <div className="tag">Atendimento para surdos</div>
                    <div className="tag">Estacionamento para deficientes</div>
                    <div className="tag">Mesas adaptadas</div>
                    <div className="tag">Elevador</div>
                    <div className="tag">Cadeira de rodas disponível</div>
                </div>
            </div>

            <Comment />
            <Comment />
            <Comment />
            <Comment />
            <Comment />
            <Comment />
            <Comment />
            <Comment />
        </section>
    )
}
