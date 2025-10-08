import './style.css'

import Comment from '../components/Comment/Comment'

export default function Restaurant() {
    // botão para usar no widget de avaliar
    // https://uiverse.io/vinodjangid07/funny-panther-79
    return (
        <section id="restaurant-page">
            <div className="restaurant-title">
                <div className="restaurant-name">
                    Sukiya - Liberdade
                </div>

                <div className="restaurant-address">
                    Av. Liberdade, 164 - São Paulo, SP
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
