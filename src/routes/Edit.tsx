import React, { useEffect, useState } from 'react'
import { EditModal } from '../components/EditModal';
import { addDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Stock } from '../components/Stock';
import dayjs from 'dayjs';
export interface IStock {
    name: string;
    id: string;
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
            await addDoc(collection(db, "myStocks"), {
                name: myStock,
                createdAt: now,
                userId: user.uid,
            })
            console.log("입력테스트", myStock)
            setMyStock('');
        } catch (error) {
            console.log("db저장 실패", error)
        }
    }

    const fetchStocks = async () => {
        const stocksQuery = query(
            collection(db, "myStocks"),
            orderBy("createdAt", "desc")
        )
        const snapshot = await getDocs(stocksQuery)
        const newStocks = snapshot.docs.map(doc => {
            const { name } = doc.data();
            return {
                name,
                id: doc.id,
            }
        })
        setStocks(newStocks);

    }
    useEffect(() => {
        fetchStocks();
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
