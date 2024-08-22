import React, { useEffect, useState } from 'react'
import { EditModal } from '../components/EditModal';
import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Stock } from '../components/Stock';
import dayjs from 'dayjs';
import { Unsubscribe } from 'firebase/auth';
import { useStockInfoFetcher } from '../lib/useStockInfoFetcher';
import { useNasdaq } from '../lib/useNasdaq';
export interface IStock {
    name: string;
    userId: string;
    id: string;
    englishName: string;
    symbol: string;
}
export interface INasdaq {
    symbol: string;
    name: string;
    exchange: string;
}
export const Edit = () => {
    const [showModal, setShowModal] = useState(false);
    const [stocks, setStocks] = useState<IStock[]>([])
    const [myStock, setMyStock] = useState<string>("");
    const { data, loading, error } = useNasdaq();
    const user = auth.currentUser;
    const [filteredStocks, setFilteredStocks] = useState<INasdaq[] | null>(null);
    const [search, setSearch] = useState<string>("");

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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        console.log("검색", value);
        // if (value === "") {
        //     setFilteredStocks([])
        //     return; //return 을 해야함. 왜? 그리고 이게 제일빠름
        // };
        // const filtered = data.filter((stock: INasdaq) =>
        //     stock.name.toLowerCase().includes(value) || stock.symbol.toLowerCase().includes(value)
        // )
        const filtered = (value === "")
            ? []
            : data.filter((stock: INasdaq) =>
                stock.name.toLowerCase().includes(value) || stock.symbol.toLowerCase().includes(value)
            )

        setFilteredStocks(filtered);
    }
    // useEffect(() => {
    //     if (!search) {
    //         setFilteredStocks(null);
    //     }
    // }, [search])
    const onAddStock = async (englishName: string, symbol: string) => {
        const ok = confirm("추가하시겠습니까?");
        if (!ok || !user) return;
        try {
            console.log(">> 추가 : ", englishName, symbol)
            await addDoc(collection(db, "myStocks"), {
                createdAt: now,
                userId: user.uid,
                englishName: englishName,
                symbol: symbol,
            })
            setSearch("");
            setFilteredStocks([]);
        } catch (error) {
            console.log(error);
        }

    }
    const handleCloseSearch = () => {
        setFilteredStocks([]);
        setSearch("");
    }
    if (loading) return <div>nasdaq fetch loading...</div>
    if (error) return <div>error : {error.message}</div>
    return (
        <div className='relative'>
            {/* 오버레이: 검색 결과가 나타날 때 화면을 어둡게 처리 */}
            {search && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-15 z-10'
                    onClick={handleCloseSearch} // 오버레이를 클릭하면 검색창이 닫히도록
                />
            )}
            <div className='relative z-20'>
                <div className='relative flex mb-3'>
                    <input
                        type='text'
                        placeholder='영어명 or 심볼 입력해주세요'
                        value={search}
                        onChange={handleSearch}//onChange가 머임?
                        className='w-full border border-gray-300 rounded-full px-8 py-2 text-xs'
                    />
                    <div className='absolute left-2 top-1/2 transform -translate-y-1/2'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="gray" className="size-4">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>

                    </div>
                </div>

            </div>
            {(filteredStocks && filteredStocks?.length > 0)
                && <ul className='absolute w-full max-h-80 overflow-y-auto space-y-1 shadow-lg rounded-md p-1 bg-white z-30'>
                    {filteredStocks.map((stock: INasdaq) => (
                        <li
                            key={stock.symbol}
                            className='flex  justify-between p-2'
                        >
                            <div className='flex flex-col'>
                                <span className='text-xs font-semibold'>{stock.name}</span>
                                <span className='text-xs text-gray-500'>{stock.symbol}</span>
                            </div>
                            <div>
                                <button
                                    onClick={() => { onAddStock(stock.name, stock.symbol) }}
                                    className='bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs cursor-pointer'
                                >
                                    추가
                                </button>
                            </div>

                        </li>))}
                </ul>}

            <ul className='overflow-y-auto'>
                {stocks.map((stock) => <li><Stock key={stock.id} {...stock} /></li>)}
            </ul>


            {/* <EditModal showModal={showModal} onClose={handleCloseModal} /> */}
        </div>
    )
}
