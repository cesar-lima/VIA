import '../../global.css'
import './style.css'

import { MapPinPlus, Check, X } from 'lucide-react'

export default function ApprovalRequest() {
    return (
        <div className="approval-request">
            <div className="approval-gradient">
                <MapPinPlus size={20} color="#f0e7d5" />
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
                    <button>
                        <Check color="#212842" />
                    </button>

                    <button>
                        <X color="#212842" />
                    </button>
                </div>
            </div>
        </div>
    )
}