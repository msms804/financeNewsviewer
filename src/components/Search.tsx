import React, { useRef } from 'react'

export const Search = () => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    return (
        <div>
            <div ref={modalRef}></div>
        </div>

    )
}
