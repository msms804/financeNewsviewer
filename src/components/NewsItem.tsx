import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useCallGPT } from '../lib/useCallGPT';

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
        const datetime = dayjs(news.pub_date);
        const datePart = datetime.format('YYYY-MM-DD');
        const timePart = datetime.format('HH:mm');
        setDate(datePart);
        setTime(timePart);

        if (news) {
            //convertToKorean();
        }
    }, [news])

    return (
        <div className='flex flex-row gap-2'>

            <div>
                <span className='flex text-xs bg-slate-200 rounded-md p-1'>
                    {time}
                </span>
            </div>
            <div className='flex flex-row space-x-2 mb-6'>
                <div className='space-y-2'>
                    <div className='text-sm'>{news.headline.main}</div>
                    {/* <div className='text-sm'>{newHeadline}</div> */}
                    <div className='text-sm'>{news.snippet}</div>
                    {/* <div className='text-sm'>{newSnippet}</div> */}
                    <div className='flex flex-row space-x-2'>
                        <div className='text-xs text-gray-500'>저자</div>
                        <div className='text-xs text-gray-500'>{date}</div>
                    </div>
                </div>

            </div>

        </div>
    )
}
