'use client';

import '../../global.css'
import './style.css'

import { MapPinPlus, X, Edit } from 'lucide-react'
import { useState } from 'react'
import EditModal from './EditModal'

interface ApprovalRequestProps {
    id: string
    name: string
    address: string
    cep: string
    onApprove: (id: string, name: string, address: string, cep: string) => void
    onReject: (id: string) => void
}

export default function ApprovalRequest({ 
    id, 
    name, 
    address, 
    cep, 
    onApprove, 
    onReject 
}: ApprovalRequestProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="approval-request">
                <div className="approval-gradient">
                    <MapPinPlus size={20} color="#f0e7d5" />
                </div>

                <div className="approval-content">
                    <div className="approval-data">
                        <div className="approval-name">
                            {name}
                        </div>

                        <div className="approval-address">
                            {address}
                        </div>

                        <div className="approval-cep">
                            CEP: {cep}
                        </div>
                    </div>

                    <div className="approval-actions">
                        <button onClick={() => setIsModalOpen(true)}>
                            <Edit color="#212842" />
                        </button>

                        <button onClick={() => onReject(id)}>
                            <X color="#212842" />
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <EditModal
                    id={id}
                    name={name}
                    address={address}
                    cep={cep}
                    onApprove={onApprove}
                    onReject={onReject}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    )
}