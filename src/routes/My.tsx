import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { IStock } from './Edit';
import axios from 'axios';
import { INews } from '../components/NewsList';
import { Favicon } from '../components/Favicon';

export const My = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [myStocks, setMyStocks] = useState<IStock[]>([]);
    const [loading, setLoading] = useState(false);
    const [news, setNews] = useState<INews[] | null>(null);

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


    useEffect(() => {//기사를 최근 3일치만 가져오면 될듯
        const fetchNews = async () => {
            if (!myStocks) return;
            setLoading(true);
            const apiKey = import.meta.env.VITE_NYTIMES_API_KEY;
            // 이거 테마를 비즈니스로 한정할 수 있나?
            //hint : join
            const newMyStocks = myStocks.map(stock => {
                return stock.englishName.split(' ')[0].replace(',', '')
            }).join(',');
            console.log(">>newMyStocks", newMyStocks);

            const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=NVIDIA,Microsoft,apple&api-key=${apiKey}`;

            try {
                const response = await axios.get(url);

                // relatedStock, article을 새로운 배열로 만들기
                const newsWithStocks = response.data.response.docs.map((article: any) => {

                    const relatedStocks = myStocks.filter((stock: any) => {
                        return article.keywords.some((keyword: any) =>
                            (keyword.name === "organizations" || keyword.name === "subject") &&
                            keyword.value.includes(stock.englishName.split(' ')[0].replace(',', ''))
                        )
                    })
                    console.log("관련주식 ", relatedStocks);
                    return {
                        ...article,
                        relatedStock: relatedStocks.map(stock => stock.symbol),
                    }
                })
                console.log(">> 확인", newsWithStocks)
                setNews(newsWithStocks);
                console.log(">> 테슬라뉴스, 애플뉴스 : ", response.data)
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        }
        fetchNews();
    }, [myStocks])

    //gpt로 변환
    if (loading) return <div>뉴스 로딩중...</div>

    return (
        <div className=''>

            <div className='flex flex-row justify-between items-center border-b border-gray-200 m-2 p-2'>
                <div className='flex flex-row items-center justify-center'>
                    <span className='text-lg font-semibold'>{user?.displayName ?? "Anonymous"} 님이 찜한 주식뉴스</span>
                </div>


                <div onClick={() => { navigate('/edit') }} className='bg-gray-100 p-1'>
                    <div className='flex flex-row items-center gap-1 '>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="line-icon"><path fill="#B0B8C1" d="M12.335 5.454l-9.062 9.062-1.236 4.61-.813 3.037a.501.501 0 00.613.613l3.035-.814 4.611-1.236h.001l9.062-9.062-6.21-6.21zm9.958 1.05l-4.796-4.797a.999.999 0 00-1.414 0l-2.475 2.474 6.211 6.211 2.474-2.475a.999.999 0 000-1.414" fillRule="evenodd" >
                        </path>
                        </svg>
                        <h1 className='text-sm font-semibold text-gray-500'>편집</h1>
                    </div>

                </div>
            </div>

            {
                news && news.map((article) => <div key={article._id} className='flex flex-col gap-1 mb-4'>
                    <div>
                        <span className='flex flex-row text-xs text-blue-500 font-bold gap-1'>{article.relatedStock.map((stock: string) => <div key={stock} className='text-xs'>{stock}</div>)}</span>
                    </div>
                    <span className='font-thin text-sm'>{article.abstract}</span>
                    <div className='text-xs text-gray-500'>
                        <span>{article.source}</span>
                        <span> - 3시간 전</span>
                    </div>
                </div>)
            }

        </div>
    )
}
