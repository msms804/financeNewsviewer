import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
//이건 토스 따라할거임 ㅋㅋ
export const NewsDetail = () => {
    const { newsId } = useParams();

    return (
        <div>
            <div className='flex justify-between items-center text-xs text-gray-500 mb-2 p-2 bg-gray-100'>
                <div>GPT가 번역했어요.</div>
                <div className='flex'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                    </svg>
                    원문보기

                </div>
            </div>
            <h1 className='flex flex-col justify-center mb-4 gap-2'>
                <span className='text-lg font-semibold'>애플은 인공지능(A.I.)에 대해 다르게 생각할 수 있을까?</span>
                <span className='text-xs text-gray-600'>2024년 08월 17일 09:24 ・ NYT</span>
            </h1>
            <div className='flex items-center mb-4'>
                <div className='border border-gray-400 rounded-full py-1 px-2 text-xs text-gray-500 '>AAPL</div>
            </div>
            {/* <p>News ID: {newsId}</p> */}
            <div className='  bg-gray-100 rounded-md p-2 mb-4'>
                <div className='text-xs text-gray-500 '>ChatGPT</div>
                <span className='font-medium text-sm'>이 기사를 <span className='text-red-500'>호재</span>로 분석했어요</span>
            </div>

            <div>
                <div className='text-sm'>
                    <div className='font-semibold'>요약</div>
                    <div>
                        메타, 엔비디아, 애플을 포함한 7개의 기술 주식이 지난 12개월 동안 S&P의 상승폭의 약 90%를 차지했습니다.
                    </div>
                </div>
            </div>
        </div>
    )
}
