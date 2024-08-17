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

            const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=NVIDIA,Microsoft&api-key=${apiKey}`;

            try {
                const response = await axios.get(url);

                // relatedStock, article을 새로운 배열로 만들기
                const newsWithStocks = response.data.response.docs.map((article: any) => {
                    //관련주식 찾기 
                    //hint: find, some, includes
                    const relatedStock = myStocks.find(stock =>
                        article.keywords.some((keyword: any) =>
                            (keyword.name == "subject" || keyword.name == "organizations") &&
                            (keyword.value.includes(stock.englishName.split(' ')[0].replace(',', '')) || keyword.value.includes(stock.symbol))
                            //이거걍 db에 변환해서 넣어야겠음 ;;
                        )

                    )
                    return {
                        ...article,
                        relatedStock: relatedStock?.symbol,
                    }
                })
                console.log(">> 확인", newsWithStocks)
                //setNews(response.data.response.docs);
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
            {/* <div onClick={() => navigate('/login')}>
                로그인하세요 굳이? 어차피 로그인안하면 이화면 안뜸 / 사용자 정보로 바꾸셈
            </div> */}
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
            {/* <div className='flex flex-col gap-1'>
                {myStocks && myStocks.map((stock) =>
                    <div key={stock.id}
                        className='flex flex-row items-center gap-1 text-xs text-gray-500 border border-gray-500 py-1 px-2 rounded-full'>
                        <img src='https://logo.clearbit.com/tesla.com' className='w-3 h-3 rounded-full' />
                        <div className=''>
                            {stock.symbol}
                        </div>
                    </div>)}
            </div> */}

            {/* 종목별 뉴스 */}
            {/* <div className='flex flex-col gap-1 mb-4'>
                <div>
                    <span className='text-xs text-red-600 font-bold '>테슬라 1.2%</span>
                </div>
                <span>테슬라, 태국 전기차 공장 설립 계획 철회</span>
                <div className='text-xs text-gray-500'>
                    <span>연합인포맥스</span>
                    <span> - 1시간 전</span>
                </div>
            </div> */}

            {
                news && news.map((article) => <div key={article._id} className='flex flex-col gap-1 mb-4'>
                    <div>
                        <span className='text-xs text-blue-500 font-bold '>{article?.relatedStock}</span>
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
