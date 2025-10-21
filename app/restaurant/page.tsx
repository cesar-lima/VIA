import './style.css'

import Comment from '../components/Comment/Comment'
import CommentButton from '../components/CommentButton/CommentButton'

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
