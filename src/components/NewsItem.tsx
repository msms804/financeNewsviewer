import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useCallGPT } from '../lib/useCallGPT';
import 'dayjs/locale/ko';
import { useTranslateWithGPT } from '../lib/useTranslateWithGPT';

export const NewsItem = ({ article }: any) => {//article로 바꾸고싶음
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [newHeadline, setNewHeadline] = useState('');
    const [newSnippet, setNewSnippet] = useState('');
    const translatedHeadline = useTranslateWithGPT(article._id);
    const translatedSnippet = useTranslateWithGPT(article._id);

    //번역
    useEffect(() => {
        const translatedArticle = async () => {
            const headline = await translatedHeadline(article.headline.main);
            const snippet = await translatedSnippet(article.snippet);
            console.log(">> 헤드라인", headline);
            console.log(">> 요약", snippet);
            setNewHeadline(headline);
            setNewSnippet(snippet);
        }
        if (article) {
            translatedArticle();
        }
    }, [article])

    useEffect(() => {
        dayjs.locale("ko");
        const datetime = dayjs(article.pub_date);
        const datePart = datetime.format('YYYY년 MM월 DD일 dddd');
        const timePart = datetime.format('HH:mm');
        setDate(datePart);
        setTime(timePart);
    }, [article])

    return (
        <div className='flex flex-col mb-6'>

            <div className='flex flex-row items-center gap-2 mb-1'>
                <span className='flex text-xs bg-slate-200 rounded-md p-1'>
                    {time}
                </span>
                <div className='text-xs text-gray-500'>{date}</div>

            </div>

            <div className='flex flex-row'>
                <div className=''>
                    {/* <div className='font-semibold text-sm mb-1'>{article.headline.main}</div> */}
                    <div className='font-semibold text-sm mb-1'>{newHeadline}</div>
                    {/* <div className='text-xs font-light'>{article.snippet}</div> */}
                    <div className='text-xs font-light'>{newSnippet}</div>
                </div>

            </div>

        </div>
    )
}
