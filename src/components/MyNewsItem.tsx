import React, { useEffect, useState } from 'react'
import { INews } from './NewsList'
import { useCallGPT } from '../lib/useCallGPT';
import { useTestGPT } from '../lib/useTestGPT';
import { useNavigate } from 'react-router-dom';

export const MyNewsItem = ({ abstract, source, relatedStock, _id, headline }: INews) => {
    const [newAbstract, setNewAbstract] = useState('');
    const [isGood, setIsGood] = useState('');
    const navigate = useNavigate();


    const handleClick = () => {
        const encodedId = encodeURIComponent(_id);
        console.log("", encodedId);
        navigate(`/mypage/news/${encodedId}`, {
            state: {
                abstract,
                source,
                relatedStock,
                headline,
            }
        })
    }
    useEffect(() => {
        if (!abstract || !relatedStock) return;
        const convertToKorean = async () => {
            const gptAbstract = await useCallGPT(headline.main);
            setNewAbstract(gptAbstract)
        }
        const analyzeNews = async () => {
            const analyzed = await useTestGPT(abstract, relatedStock);
            setIsGood(analyzed)
        }
        // convertToKorean();
        // analyzeNews();

    }, [abstract, relatedStock, headline])
    return (
        <div>
            <div onClick={handleClick} className='flex flex-col gap-1 mb-6 cursor-pointer'>
                <div className='flex flex-row items-center gap-2'>
                    {/* <span className={`text-xs p-1 rounded-md 
                        ${isGood === "호재" ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-500'
                        } `}>{isGood}</span> */}
                    <div className='flex text-xs bg-slate-200 rounded-md p-1'>13:29</div>
                    <div className='text-xs text-gray-500'>2024년 08월 19일 월요일</div>
                </div>
                <span className='font-semibold text-sm'>{headline.main}</span>
                <div className='text-xs text-gray-500'>
                    {/* <span>{source}</span> */}

                    <span className='flex flex-row text-xs  gap-1'>
                        {relatedStock.map((stock: string) =>
                            <div key={stock} className='text-xs  border border-gray-300 rounded-full py-1 px-2'>
                                {stock}
                            </div>)}
                    </span>
                </div>
            </div>
        </div>
    )
}
