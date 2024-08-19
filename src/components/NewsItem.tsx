import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useCallGPT } from '../lib/useCallGPT';
import 'dayjs/locale/ko';

export const NewsItem = ({ news }: any) => {//article로 바꾸고싶음
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [newHeadline, setNewHeadline] = useState('');
    const [newSnippet, setNewSnippet] = useState('');

    const convertToKorean = async () => {
        const headline = await useCallGPT(news.headline.main)
        const snippet = await useCallGPT(news.snippet)
        setNewHeadline(headline);
        setNewSnippet(snippet);
    }

    useEffect(() => {
        dayjs.locale("ko");
        const datetime = dayjs(news.pub_date);
        const datePart = datetime.format('YYYY년 MM월 DD일 dddd');
        const timePart = datetime.format('HH:mm');
        setDate(datePart);
        setTime(timePart);

        if (news) {
            convertToKorean();
        }
    }, [news])

    return (
        <div className='flex flex-col mb-6'>
            <div className='flex justify-between'>

                <div className='flex flex-row items-center gap-2 mb-1'>
                    <span className='flex text-xs bg-slate-200 rounded-md p-1'>
                        {time}
                    </span>
                    <div className='text-xs text-gray-500'>{date}</div>

                </div>
                <div className='flex flex-row items-center text-xs text-blue-600'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                    </svg>
                    <div>자세히 보기</div>
                </div>
            </div>
            <div className='flex flex-row'>
                <div className=''>
                    {/* <div className='font-semibold text-sm mb-1'>{news.headline.main}</div> */}
                    <div className='font-semibold text-sm mb-1'>{newHeadline}</div>
                    {/* <div className='text-xs font-light'>{news.snippet}</div> */}
                    <div className='text-xs font-light'>{newSnippet}</div>
                </div>

            </div>

        </div>
    )
}
