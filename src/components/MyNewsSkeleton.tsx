import React from 'react'

export const MyNewsSkeleton = () => {
    return (
        <div className='flex flex-col gap-1 mb-6 animate-pulse'>
            <div className='flex flex-row items-center gap-2'>
                <div className='bg-slate-200 dark:bg-gray-600 rounded-md p-1 w-16 h-4'></div>
                <div className='bg-slate-200 dark:bg-gray-600 rounded-md w-24 h-4'></div>
            </div>

            <div className='flex justify-between bg-slate-200 dark:bg-gray-600 p-2 font-thin text-xs rounded-md'>
                <div className='bg-slate-200 dark:bg-gray-600 h-4 w-32'></div>
                <div className='bg-slate-200 dark:bg-gray-600 h-4 w-16'></div>
            </div>

            <div className='bg-slate-200 dark:bg-gray-600 h-6 w-full mt-2 rounded-md'></div>

            <div className='bg-slate-200 dark:bg-gray-600 h-4 w-full mt-2 rounded-md'></div>

            <div className='flex flex-row gap-1 mt-2'>
                {[0, 1, 2].map((_, index) => (
                    <div key={index} className='bg-slate-200 dark:bg-gray-600 h-6 w-12 rounded-full'></div>
                ))}
            </div>
        </div>

    )
}
