import React, { useState } from 'react'
const categories = [
    {// 경제, 산업, 기업 등의 일반 비즈니스 뉴스를 다룸
        name: 'Business',
        text: '전체보기',
    },
    {//미국주식과 관련된 뉴스 다룸
        name: 'Nasdaq',
        text: '나스닥',
    },
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
                    className={`text-xs cursor-pointer bg-gray-100 px-2 py-1 rounded-md ${category === c.name ? 'border-b border-blue-400' : ''}`}
                    onClick={() => onSelect(c.name)}
                >{c.text}</div>)}
        </div>
    )
}
