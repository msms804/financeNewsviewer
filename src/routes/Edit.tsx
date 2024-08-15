import React, { useEffect, useState } from 'react'
import { EditModal } from '../components/EditModal';
import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Stock } from '../components/Stock';
import dayjs from 'dayjs';
import { Unsubscribe } from 'firebase/auth';
import { useStockInfoFetcher } from '../lib/useStockInfoFetcher';
export interface IStock {
    name: string;
    userId: string;
    id: string;
    englishName: string;
    symbol: string;
}

export const Edit = () => {
    const [showModal, setShowModal] = useState(false);
    const [stocks, setStocks] = useState<IStock[]>([])
    const [myStock, setMyStock] = useState<string>("");
    const user = auth.currentUser;

    const now = dayjs().toDate();

    const handleOpenModal = () => {
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMyStock(e.target.value)
    }

    const onSubmitStock = async () => {
        if (!user || !myStock) {
            console.log("입력하세요")
            return;
        }
        try {
            const data = await useStockInfoFetcher(myStock);
            console.log(data.englishName, data.stockSymbol);

            await addDoc(collection(db, "myStocks"), {
                name: myStock,
                createdAt: now,
                userId: user.uid,
                englishName: data.englishName,
                symbol: data.stockSymbol,
            })
            console.log("입력테스트", myStock)

            setMyStock('');
        } catch (error) {
            console.log("db저장 실패", error)
        }
    }


    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchStocks = async () => {

            const stocksQuery = query(
                collection(db, "myStocks"),
                where("userId", "==", user?.uid),
                orderBy("createdAt", "desc"),
                limit(25)
            )

            unsubscribe = await onSnapshot(stocksQuery, (snapshot) => {//쿼리에 리스너 추가
                const newStocks = snapshot.docs.map(doc => {
                    const { name, userId, englishName, symbol } = doc.data();
                    return {
                        name,
                        userId,
                        id: doc.id,
                        englishName,
                        symbol,
                    }
                })
                setStocks(newStocks);

            })

        }
        fetchStocks();
        //useEffect 는 유저가 화면을 보지 않을때 값을 반환하면서 cleanup 실시
        //Edit 컴포넌트가 마운트될때 구독, 언마운트될때 구독취소
        return () => { //이 컴포넌트가 사용되지 않을때 이함수 호출
            unsubscribe && unsubscribe();
        }
    }, [])

    return (
        <div>
            {/* <div className='flex flex-row items-center gap-1 mb-4' onClick={handleOpenModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="blue"
                    className="size-6 text-blue-400 bg-gray-100 p-1 rounded-full ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className='font-semibold text-gray-500 text-sm'> 추가하기</span>
            </div> */}
            <div className='flex flex-row gap-2'>
                <input placeholder='애플, 테슬라..'
                    className='rounded-full border border-gray-200 px-2 '
                    value={myStock}
                    onChange={handleInputChange}
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="blue"
                    className="size-6 text-blue-400 bg-gray-100 p-1 rounded-full "
                    onClick={onSubmitStock}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>

            </div>
            {/* {[0, 1, 2, 3].map(item => <div className='flex flex-row justify-between items-center  mb-3 text-sm'>
                <div className='flex flex-row gap-1'>
                    <img src='/vite.svg' className='w-6 h-6' />
                    <span>QQQ</span>
                </div>
                <span className='text-red-400 bg-red-100 rounded-md px-2 py-1'>삭제</span>
            </div>)} */}
            {/* {JSON.stringify(stocks)} */}
            {/* {stocks.slice(0, 30).map((stock) => <Stock key={stock.id} {...stock} />)} */}
            {stocks.map((stock) => <Stock key={stock.id} {...stock} />)}

            <EditModal showModal={showModal} onClose={handleCloseModal} />
        </div>
    )
}
