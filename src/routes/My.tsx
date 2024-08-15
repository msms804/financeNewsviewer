import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { IStock } from './Edit';

export const My = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [myStocks, setMyStocks] = useState<IStock[]>([]);

    //1. db에서 fetch 한다. 여기서는 실시간 할 필요 없을듯
    //2. 일단 렌더링한다.
    //3. 
    useEffect(() => {
        const fetchMyStocks = async () => {
            //내가 저장한것만 가져와야
            const myStocksQuery = query(
                collection(db, "myStocks"),
                where("userId", "==", user?.uid),
                orderBy("createdAt", "desc"),
                limit(25),
            )
            const querySnapshot = await getDocs(myStocksQuery)
            const stocks = querySnapshot.docs.map((doc) => {
                const { createdAt, englishName, name, symbol, userId } = doc.data();
                return {
                    id: doc.id,
                    createdAt: createdAt,
                    englishName: englishName,
                    name: name,
                    symbol: symbol,
                    userId: userId,
                }
            })
            setMyStocks(stocks);
        }
        fetchMyStocks();
    }, [])

    return (
        <div className=''>
            {/* <div onClick={() => navigate('/login')}>
                로그인하세요 굳이? 어차피 로그인안하면 이화면 안뜸 / 사용자 정보로 바꾸셈
            </div> */}
            <div className='flex flex-row justify-between items-center border-b border-gray-200 m-2 p-2'>
                <div className='flex flex-row items-center justify-center'>
                    {/* {Boolean(avatar) ? <img src={avatar} /> : <svg
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className='w-8 h-8'
                    >
                        <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                    </svg>} */}
                    <span className='text-lg font-semibold'>{user?.displayName ?? "Anonymous"} 님이 찜한 주식뉴스</span>
                </div>


                <div onClick={() => { navigate('/edit') }} className='bg-gray-100 p-1'>
                    <div className='flex flex-row items-center gap-1 '>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="line-icon"><path fill="#B0B8C1" d="M12.335 5.454l-9.062 9.062-1.236 4.61-.813 3.037a.501.501 0 00.613.613l3.035-.814 4.611-1.236h.001l9.062-9.062-6.21-6.21zm9.958 1.05l-4.796-4.797a.999.999 0 00-1.414 0l-2.475 2.474 6.211 6.211 2.474-2.475a.999.999 0 000-1.414" fillRule="evenodd" >
                        </path>
                        </svg>
                        <h1 className='text-sm font-semibold text-gray-500'>편집</h1>
                    </div>
                    {/* <div>나머지는 1. 토스, 2. 뉴스탭 3. ~님이 찜한 주식뉴스</div> */}
                </div>
            </div>

            {/* 종목별 뉴스 */}
            <div className='flex flex-col gap-1 mb-4'>
                <div>
                    <span className='text-xs text-red-600 font-bold '>테슬라 1.2%</span>
                </div>
                <span>테슬라, 태국 전기차 공장 설립 계획 철회</span>
                <div className='text-xs text-gray-500'>
                    <span>연합인포맥스</span>
                    <span> - 1시간 전</span>
                </div>
            </div>
            <div className='flex flex-col gap-1 mb-4'>
                <div>
                    <span className='text-xs text-blue-500 font-bold '>쿠팡 1.2%</span>
                </div>
                <span>이커머스 기업 쿠팡, 2분기 순손실 전환</span>
                <div className='text-xs text-gray-500'>
                    <span>로이터</span>
                    <span> - 3시간 전</span>
                </div>
            </div>

        </div>
    )
}
