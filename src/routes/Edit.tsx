import React from 'react'

export const Edit = () => {
    return (
        <div>
            <div className='flex flex-row items-center gap-1 mb-4'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="blue"
                    className="size-6 text-blue-400 bg-gray-100 p-1 rounded-full ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className='font-semibold text-gray-500 text-sm'> 추가하기</span>
            </div>
            {[0, 1, 2, 3].map(item => <div className='flex flex-row justify-between items-center  mb-3 text-sm'>
                <div className='flex flex-row gap-1'>
                    <img src='/vite.svg' className='w-6 h-6' />
                    <span>QQQ</span>
                </div>
                <span className='text-red-400 bg-red-100 rounded-md px-2 py-1'>삭제</span>
            </div>)}
        </div>
    )
}
