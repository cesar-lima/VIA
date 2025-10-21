import './CommentButton.css'

import { MessageCircleMore } from "lucide-react";

export default function CommentButton() {
    return (
        <button className="comment-button">
            <MessageCircleMore />
            <span className="tooltip">Avaliar</span>
        </button>

    )
}