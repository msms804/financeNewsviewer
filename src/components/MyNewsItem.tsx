import React, { useEffect, useState } from 'react'
import { INews } from './NewsList'
import { useCallGPT } from '../lib/useCallGPT';

export const MyNewsItem = ({ abstract, source, relatedStock }: INews) => {
    const [newAbstract, setNewAbstract] = useState('');

    useEffect(() => {
        if (!abstract) return;
        const convertToKorean = async () => {
            const gptAbstract = await useCallGPT(abstract);
            setNewAbstract(gptAbstract)
        }
        convertToKorean();
    }, [abstract])
    return (
        <div>
            <div className='flex flex-col gap-1 mb-6'>
                <div>
                    <span className='flex flex-row text-xs text-blue-500 font-bold gap-1'>{relatedStock.map((stock: string) => <div key={stock} className='text-xs'>{stock}</div>)}</span>
                </div>
                <span className='font-thin text-sm'>{newAbstract}</span>
                <div className='text-xs text-gray-500'>
                    <span>{source}</span>
                    <span> - 3시간 전</span>
                </div>
            </div>
        </div>
    )
}
