import React, { useEffect, useState } from 'react'
import { INews } from './NewsList'
import { useCallGPT } from '../lib/useCallGPT';
import { useTestGPT } from '../lib/useTestGPT';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslateWithGPT } from '../lib/useTranslateWithGPT';
import { useAnalyzeWithGPT } from '../lib/useAnalyzeWithGPT';
import { useFormattedDateTime } from '../lib/useFormattedDateTime';

export const MyNewsItem = ({ abstract, source, relatedStock, _id, headline, snippet, web_url, pub_date }: INews) => {
    const [newHeadline, setNewHeadline] = useState('');
    const [newSnippet, setNewSnippet] = useState('');
    const [isGood, setIsGood] = useState('');
    const navigate = useNavigate();
    const translateWithGPT = useTranslateWithGPT(_id)
    const analyzeWithGPT = useAnalyzeWithGPT(_id);
    const { date, time } = useFormattedDateTime(pub_date);

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

        // const translatedArticle = async () => {
        //     // const newHeadline = await translatedHeadline(headline.main);
        //     // const newSnippet = await translatedSnippet(snippet);
        //     const {headline, snippet} = await translateWithGPT(headline.main, snippet)
        //     setNewHeadline(headline);
        //     setNewSnippet(snippet)
        // }
        const translatedArticle = async () => {
            // headline.main과 snippet을 별도의 변수로 선언
            const headlineText = headline.main;
            const snippetText = snippet;

            // GPT 번역 호출
            const { headline: translatedHeadline, snippet: translatedSnippet } = await translateWithGPT(headlineText, snippetText);
            setNewHeadline(translatedHeadline);
            setNewSnippet(translatedSnippet);
        }
        const analyzeNews = async () => {
            const analyzed = await analyzeWithGPT(snippet)
            setIsGood(analyzed);
        }
        translatedArticle();
        analyzeNews();

    }, [abstract, relatedStock, headline])
    return (
        <div>
            <div className='flex flex-col gap-1 mb-6'>
                <div className='flex flex-row items-center gap-2'>
                    <div className='dark:text-gray-300 dark:bg-gray-600 flex text-xs bg-slate-200 rounded-md p-1'>{time}</div>
                    <div className='dark:text-gray-400 text-xs text-gray-500'>{date}</div>
                </div>
                <div className={`flex justify-between ${isGood === "악재" ? "bg-blue-100" : "bg-red-100"} p-2 font-thin text-xs rounded-md`}>
                    <div>
                        이 기사를
                        <span className={`${isGood === "악재" ? 'text-blue-600' : 'text-red-500'}`}> {isGood} </span>
                        로 분석했어요
                    </div>
                    <Link
                        to={web_url}
                        target={web_url.startsWith('http') ? '_blank' : '_self'} // 외부 링크는 새 창에서 열기 위해 target='_blank'를 사용
                        rel='noopener noreferrer'
                        className='text-blue-700 text-xs flex flex-row items-center justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                            <path fillRule="evenodd" d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                        </svg>
                        <div>본문</div>
                    </Link>
                </div>
                {/* <span className='font-semibold text-sm'>{headline.main}</span> */}
                <span className='font-semibold text-sm'>{newHeadline}</span>

                {/* <div className='text-xs font-light'>{snippet}</div> */}
                <div className='text-xs font-light'>{newSnippet}</div>
                <div className='text-xs text-gray-500'>
                    <span className='flex flex-row text-xs  gap-1'>
                        {relatedStock.map((stock: string) =>
                            <div key={stock} className='text-xs border dark:text-gray-400 dark:border-gray-600 border-gray-300 rounded-full py-1 px-2'>
                                {stock}
                            </div>)}
                    </span>
                </div>
            </div>
        </div>
    )
}
