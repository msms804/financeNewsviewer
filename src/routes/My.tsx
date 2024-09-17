import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { IStock } from './Edit';
import axios from 'axios';
import { INews } from '../components/NewsList';
import { Favicon } from '../components/Favicon';
import { MyNewsItem } from '../components/MyNewsItem';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useDate } from '../lib/useDate';

const fetchNews = async (symbols: string[], myStocks: any, beginDate: string, endDate: string) => {
    const apiKey = import.meta.env.VITE_NYTIMES_API_KEY;
    const query = symbols.join(',');
    console.log(">> 쿼리", query)

    const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=news_desk:("Business")&sort=newest&begin_date=${beginDate}&end_date=${endDate}&q=${query}&api-key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log(">>", response.data);

        // relatedStock, article을 새로운 배열로 만들기
        const newsWithStocks = response.data.response.docs.map((article: any) => {

            const relatedStocks = myStocks.filter((stock: any) => {
                return article.keywords.some((keyword: any) =>
                    (keyword.name === "organizations" || keyword.name === "subject") &&
                    keyword.value.includes(stock.englishName.split(' ')[0].replace(',', ''))
                    //여기서 replace에서 .도 공백으로 바꿔야할듯..? ex) amazon.com
                )
            })
            console.log("관련주식 ", relatedStocks);
            return {
                ...article,
                relatedStock: relatedStocks.map((stock: any) => stock.symbol),
            }
        })
        console.log(">> 확인", newsWithStocks)
        return newsWithStocks;
    } catch (error) {
        console.error(error);
    }
    // setLoading(false);
}
// 배치처리
const fetchNewsForStock = async (myStocks: any, beginDate: string, endDate: string) => {
    if (!myStocks || myStocks.length === 0) return;

    const symbols = myStocks.map((stock: any) => stock.englishName.split(' ')[0].replace(',', ''))
    const batchSize = 5;
    let allNews: INews[] = [];

    for (let i = 0; i < symbols.length; i += batchSize) {
        const batchSymbols = symbols.slice(i, i + batchSize);
        const stockNews: INews[] = await fetchNews(batchSymbols, myStocks, beginDate, endDate);
        allNews = [...allNews, ...stockNews];
    }
    console.log(">>", allNews);
    return allNews;
}
export const My = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;
    const [myStocks, setMyStocks] = useState<IStock[]>([]);
    const { beginDate, endDate } = useDate(14);  //이거 없애ㅎ야 할듯
    const { data: news, isLoading, error } = useQuery({
        queryKey: ["myNews", myStocks, beginDate, endDate],
        queryFn: () => fetchNewsForStock(myStocks, beginDate as string, endDate as string),
        enabled: !!myStocks && myStocks.length > 0,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 6,
        gcTime: 1000 * 60 * 60 * 12,

    })

    useEffect(() => {
        const fetchMyStocks = async () => {
            try {
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
            } catch (error) {
                console.error("firestore 쿼리 에러", error);
            }
        }
        fetchMyStocks();
    }, [])

    if (isLoading) return <div>리액트쿼리 로딩중...</div>
    if (error) return <div>리액트쿼리 에러! {error.message}</div>
    return (
        <div>

            <div className='flex flex-row justify-between items-center border-b border-gray-200 mb-2'>
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
                news && news.map((article) => (
                    <MyNewsItem
                        key={article._id}
                        {...article}
                    />))
            }

        </div>
    )
}
