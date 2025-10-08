import './style.css'

import { CircleUserRound } from 'lucide-react'

export default function Comment() {
    return (
        <div className="comment-container">
            <div className="comment-infos">
                <div className="comment-author">
                    <CircleUserRound />

                    <div className="author-name">
                        Marlon Rodrigues
                    </div>
                </div>

                <div className="comment-date">
                    15/10/2025
                </div>
            </div>

            <div className="comment-content">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Error quae dicta repudiandae voluptate
                delectus amet necessitatibus animi molestias nobis dignissimos, quas repellat est officiis veniam
                beatae rerum fugit eveniet itaque!
            </div>
        </div>
    )
}