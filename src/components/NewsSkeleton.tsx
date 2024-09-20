import React from 'react'

export const NewsSkeleton = () => {
    return (
        <div className='flex flex-col mb-6 animate-pulse'>
            {/* 시간 및 날짜 부분 */}
            <div className='flex flex-row items-center gap-2 mb-1'>
                <div className='bg-slate-300 dark:bg-gray-600 rounded-md p-1 w-16 h-4'></div>
                <div className='bg-slate-300 dark:bg-gray-600 rounded-md w-24 h-4'></div>
            </div>

            {/* 헤드라인 및 스니펫 부분 */}
            <div className='flex flex-col'>
                <div>
                    <div className='bg-slate-300 dark:bg-gray-600 rounded-md w-full h-6 mb-1'></div> {/* 헤드라인 부분 */}
                    <div className='bg-slate-300 dark:bg-gray-600 rounded-md w-full h-4'></div> {/* 스니펫 부분 */}
                </div>
            </div>
        </div>
    )
}
