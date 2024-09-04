import React, { useEffect, useState } from 'react'
import { NewsItem } from './NewsItem'
import axios from 'axios';
import usePromise from '../lib/usePromise';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import _ from 'lodash';
//import { fetchTranslation } from '../lib/fetchTranslation';
interface IArticle {
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}
interface IKeyword {
    name: string;
    value: string;
    rank: number;
    major: string;
}
export interface INews {
    abstract: string;
    headline: {
        main: string;

    };
    keywords: IKeyword[];
    pub_date: string;
    section_name: string;
    snippet: string;
    web_url: string;
    _id: string;
    source: string;
    relatedStock: string[];
}
interface ICategoryProps {
    category: string;
}
interface INewsPage {
    articles: INews[];
    isLastPage: boolean;
    nextPage?: number;
}
const fetchTranslationWithBackOff = async ({ pageParam = 0 }: { pageParam?: number }) => {
    const apiKey = import.meta.env.VITE_NYTIMES_API_KEY;
    const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=stock&sort=newest&fq=news_desk:("Business")&page=${pageParam}&api-key=${apiKey}`;

    let retries = 3;
    let delay = 1000;

    while (retries > 0) {
        try {
            const response = await axios.get(url);
            const articles = response.data.response.docs;
            console.log(">>", articles);
            return articles;

        } catch (error: any) {
            if (error.response.status === 429) {
                await new Promise(res => setTimeout(res, delay));
                retries -= 1;
                delay *= 2;
            } else {
                throw error;
            }
        }
    }
    throw new Error("잠시후 다시 실행해 주세요");



};
const fetchTranslationThrottled = _.throttle(fetchTranslationWithBackOff, 5000, { trailing: false });
export const NewsList: React.FC<ICategoryProps> = ({ category }) => {
    //const [articles, setArticles] = useState<IArticle[] | null>(null);
    const { ref, inView } = useInView();

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: ['news', category],
        queryFn: fetchTranslationThrottled,
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length ? pages.length : undefined;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const [isLoading, setLoading] = useState(false);

    const [news, setNews] = useState<INews[] | null>(null);
    // const [loading, response, error] = usePromise(() => {
    //     const query = category === 'all' ? '' : `&category=${category}`;
    //     return axios.get(`https://newsapi.org/v2/top-headlines?country=kr${query}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`)
    // }, category)

    // useEffect(() => {
    //     if (inView && hasNextPage) {
    //         console.log("다음페이지!")
    //         fetchNextPage();

    //         console.log("페이지", data);
    //     }
    // }, [inView, hasNextPage, fetchNextPage])
    // const fetchNews = async () => {
    //     setLoading(true);
    //     const apiKey = import.meta.env.VITE_NYTIMES_API_KEY;
    //     const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=stock&sort=newest&fq=news_desk:("Business")&page=2&api-key=${apiKey}`;

    //     try {
    //         const response = await axios.get(url);
    //         setNews(response.data.response.docs);
    //     } catch (error) {
    //         console.error(error);
    //     }
    //     setLoading(false);
    // }
    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage])
    useEffect(() => {
        //fetchData();
        // fetchNews();
    }, [category])
    // if (loading) return <div>대기 중...</div>
    if (error) return <div>에러 발생! {error.message}</div>
    // if (!response) return null;
    //if (isFetching) return <div>nyt 로딩중 ...</div>
    // const { articles } = response.data;

    return (
        <div>
            {/* {articles.map((article: IArticle) => <NewsItem key={article.url} article={article} />)} */}
            {/* {news && news.map((item: INews) => <NewsItem key={item._id} news={item} />)} */}
            {/* <div ref={ref} className='bg-blue-200'>옵저버</div> */}
            <div>
                {data?.pages.map((page, pageIndex) => (
                    <React.Fragment key={pageIndex}>
                        {page.map((article: any) => (
                            // <div key={article._id}>
                            //     <h2>{article.headline.main}</h2>
                            //     <p>{article.snippet}</p>
                            // </div>
                            <NewsItem key={article._id} article={article} />
                        ))}
                    </React.Fragment>
                ))}

                {/* <div>
                    {isFetchingNextPage ? (
                        <p>Loading more...</p>
                    ) : (
                        <button
                            className='cursor-pointer'
                            onClick={() => { fetchNextPage() }}
                            disabled={!hasNextPage || isFetchingNextPage}
                        >
                            Load More
                        </button>
                    )}
                </div> */}
                <div className='bg-red-300'>
                    {isFetchingNextPage ? <div>로딩중...</div> : <div ref={ref}>옵저버</div>}
                </div>
            </div>
        </div>
    )
}
