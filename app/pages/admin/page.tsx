import './style.css'

import Navbar from '../../components/Navbar/Navbar'
import ApprovalRequest from '../../components/ApprovalRequest/ApprovalRequest'

export default function Admin() {
    return(
        <div id="admin-page">
            <Navbar />

            <div className="approval-requests">
                <h3>Aprovações Pendentes</h3>

                <ApprovalRequest />
                <ApprovalRequest />
                <ApprovalRequest />
                <ApprovalRequest />
                <ApprovalRequest />
                <ApprovalRequest />
                <ApprovalRequest />
                <ApprovalRequest />
            </div>
        </div>
    )
}