import './style.css'

import { CircleUserRound } from 'lucide-react'

interface CommentProps {
    authorName: string
    date: string
    content: string
    rating?: number
    accessibilityItems?: Array<{
        checklist_review: {
            id_cr: string
            item_review: string
            item_classify: string
        }
    }>
}

export default function Comment({ authorName, date, content, rating, accessibilityItems }: CommentProps) {
    const formattedDate = new Date(date).toLocaleDateString('pt-BR')

    return (
        <div className="comment-container">
            <div className="comment-infos">
                <div className="comment-author">
                    <CircleUserRound />

                    <div className="author-name">
                        {authorName}
                    </div>
                </div>

                <div className="comment-date">
                    {formattedDate}
                </div>
            </div>

            <div className="comment-content">
                {content}
                {rating && (
                    <div className="comment-rating">
                        ⭐ {rating}/5
                    </div>
                )}
            </div>

            {accessibilityItems && accessibilityItems.length > 0 && (
                <div className="comment-accessibility-tags">
                    <div className="tags-container">
                        {accessibilityItems.map((item) => (
                            <div key={item.checklist_review.id_cr} className="tag">
                                {item.checklist_review.item_review}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}