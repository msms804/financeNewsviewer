import React, { useEffect, useState } from 'react'
import { NewsItem } from './NewsItem'
import axios from 'axios';
import usePromise from '../lib/usePromise';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { useDate } from '../lib/useDate';

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

//전체보기, 해외증시, 암호화폐, 환율/금리
const fetchTranslationWithBackOff = async ({ pageParam = 0, category, beginDate, endDate }: { pageParam?: number, category: string, beginDate: string, endDate: string }) => {
    const apiKey = import.meta.env.VITE_NYTIMES_API_KEY;



    let url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?sort=newest&begin_date=${beginDate}&end_date=${endDate}&page=${pageParam}&api-key=${apiKey}`;

    switch (category) {
        case 'Business':
            url += '&fq=news_desk:("Business")';
            break;
        case 'Nasdaq':
            url += '&q="nasdaq"';
            break;
        default:
            url += '&fq=news_desk:("Business")';
            break;
    }
    let retries = 3;
    let delay = 1000;
    while (retries > 0) {
        try {
            const response = await axios.get(url);
            const articles = response.data.response.docs;
            console.log(">> page : ", pageParam, ">>", articles);
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
    const { ref, inView } = useInView();
    const { beginDate, endDate } = useDate(14);
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status
    } = useInfiniteQuery({
        queryKey: ['news', category, beginDate, endDate],
        queryFn: ({ pageParam = 0 }) => {
            //null이 아닌경우에만 실행
            if (beginDate && endDate) {
                return fetchTranslationThrottled({ pageParam, category, beginDate, endDate })
            }
            else {
                return Promise.reject(new Error("날짜가 유효하지 않습니다."));
            }
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length ? pages.length : undefined;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
    const [news, setNews] = useState<INews[] | null>(null);

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage])


    if (error) return <div>에러 발생! {error.message}</div>

    return (
        <div>
            <div>
                {data?.pages.map((page, pageIndex) => (
                    <React.Fragment key={pageIndex}>
                        {page.map((article: any) => (
                            <NewsItem key={article._id} article={article} />
                        ))}
                    </React.Fragment>
                ))}
                <div className='bg-red-300'>
                    {isFetchingNextPage && hasNextPage ? <div>로딩중...</div> : <div ref={ref}>옵저버</div>}
                </div>
            </div>
        </div>
    )
}
