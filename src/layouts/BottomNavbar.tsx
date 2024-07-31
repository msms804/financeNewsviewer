import React from 'react'

export const BottomNavbar = () => {
    return (
        <div className='fixed bottom-0 w-full flex flex-row justify-around bg-blue-400 py-2 shadow-inner text-white '>
            <div>홈</div>
            <div>뉴스</div>
            <div>마이페이지</div>
        </div>
    )
}
