import React, { useState } from 'react'
const categories = [
    {
        name: 'all',
        text: '전체보기',
    },
    {
        name: 'nasdaq',
        text: '나스닥',
    },
    {
        name: 'snp500',
        text: 's&p 500',
    },
    {
        name: 'crypto',
        text: '암호화폐',
    },

    // {
    //     name: 'business',
    //     text: '비즈니스',
    // },
    // {
    //     name: 'entertainment',
    //     text: '엔터테인먼트',
    // },

    // {
    //     name: 'science',
    //     text: '과학',
    // },

    // {
    //     name: 'technology',
    //     text: '기술',
    // },
]
interface ICategoriesProps {
    onSelect: (category: string) => void;
    category: string;
}
export const Categories: React.FC<ICategoriesProps> = ({ onSelect, category }) => {
    return (
        <div className='flex flex-row space-x-2'>
            {categories.map(c =>
                <div
                    key={c.name}
                    className={`text-sm ${category === c.name ? 'border-b border-blue-400' : ''}`}
                    onClick={() => onSelect(c.name)}
                >{c.text}</div>)}
        </div>
    )
}
