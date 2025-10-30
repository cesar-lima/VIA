import '../../global.css'
import './style.css'

import { MapPinPlus, Check, X } from 'lucide-react'

export default function ApprovalRequest() {
    return (
        <div className="approval-request">
            <div className="approval-gradient">
                <MapPinPlus size={20} />
            </div>

            <div className="approval-content">
                <div className="approval-data">
                    <div className="approval-name">
                        Sukiya - Liberdade
                    </div>

                    <div className="approval-address">
                        Av. Liberdade, 123, Liberdade - CEP 04045687
                    </div>
                </div>

                <div className="approval-actions">
                    <Check />

                    <X />
                </div>
            </div>
        </div>
    )
}