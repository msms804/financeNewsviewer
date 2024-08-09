import React, { useEffect, useRef } from 'react'

interface SearchModalProps {
    showModal: boolean;
    onClose: () => void;
}
export const Search: React.FC<SearchModalProps> = ({ showModal, onClose }) => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                console.log("바깥누름", onClose)
                onClose();
            }
        }

        //모달이 열려있을 때만 이벤트 리스너 추가
        if (showModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showModal, onClose])

    if (!showModal) return null;
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-opacity-50'>
            <div ref={modalRef} className='w-48 h-32 border border-gray-200'>
                <input className='border border-gray-400 rounded-full text-xs px-2 py-1' placeholder='주식 검색' />
            </div>
        </div>

    )
}
