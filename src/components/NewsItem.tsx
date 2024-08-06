import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'

export const NewsItem = ({ news }: any) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        const datetime = dayjs(news.pub_date);
        const datePart = datetime.format('YYYY-MM-DD');
        const timePart = datetime.format('HH:mm');
        setDate(datePart);
        setTime(timePart);
    }, [news])

    return (
        <div className='flex flex-row gap-2'>
            {/* <div>
                <span className='flex text-xs bg-slate-200 rounded-md p-1'>
                    {time}
                </span>
            </div>
            <div className='flex flex-row space-x-2 mb-6'>
                <div className='space-y-2'>
                    <div className='text-sm'>{article.title}</div>
                    <div className='flex flex-row space-x-2'>
                        <div className='text-xs text-gray-500'>{article.author}</div>
                        <div className='text-xs text-gray-500'>{date}</div>
                    </div>
                </div>
                <div className='flex items-center'>
                    {article.urlToImage && <img src={article.urlToImage} alt="Thumbnail_Image" className='w-12 h-8' loading="lazy" />}
                </div>
            </div> */}

            <div>
                <span className='flex text-xs bg-slate-200 rounded-md p-1'>
                    {time}
                </span>
            </div>
            <div className='flex flex-row space-x-2 mb-6'>
                <div className='space-y-2'>
                    <div className='text-sm'>{news.headline.main}</div>
                    <div className='text-sm'>{news.snippet}</div>
                    <div className='flex flex-row space-x-2'>
                        <div className='text-xs text-gray-500'>저자</div>
                        <div className='text-xs text-gray-500'>{date}</div>
                    </div>
                </div>
                {/* <div className='flex items-center'>
                    {article.urlToImage && <img src={article.urlToImage} alt="Thumbnail_Image" className='w-12 h-8' loading="lazy" />}
                </div> */}
            </div>

        </div>
    )
}
