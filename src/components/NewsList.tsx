import React, { useEffect, useState } from 'react'
import { NewsItem } from './NewsItem'
import axios from 'axios';
import usePromise from '../lib/usePromise';

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
interface INews {
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
}
interface ICategoryProps {
    category: string;
}
export const NewsList: React.FC<ICategoryProps> = ({ category }) => {
    //const [articles, setArticles] = useState<IArticle[] | null>(null);
    const [isLoading, setLoading] = useState(false);

    const [news, setNews] = useState<INews[] | null>(null);
    const [loading, response, error] = usePromise(() => {
        const query = category === 'all' ? '' : `&category=${category}`;
        return axios.get(`https://newsapi.org/v2/top-headlines?country=kr${query}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`)
    }, category)
    // const fetchData = async () => {
    //     setLoading(true);
    //     try {
    //         const query = category === 'all' ? '' : `&category=${category}`
    //         const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=kr${query}&apiKey=`)
    //         setArticles(response.data.articles);
    //         console.log(response.data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    //     setLoading(false);
    // }
    const fetchNews = async () => {
        setLoading(true);
        const apiKey = import.meta.env.VITE_NYTIMES_API_KEY;
        const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=stock&fq=news_desk:("Business")&api-key=${apiKey}`;

        try {
            const response = await axios.get(url);
            //console.log(response.data);//이거 없으니까 에러남;;
            setNews(response.data.response.docs);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }
    useEffect(() => {
        //fetchData();
        fetchNews();
    }, [category])
    if (loading) return <div>대기 중...</div>
    if (error) return <div>에러 발생!</div>
    if (!response) return null;
    if (isLoading) return <div>nyt 로딩중 ...</div>
    const { articles } = response.data;

    return (
        <div>
            {/* {articles.map((article: IArticle) => <NewsItem key={article.url} article={article} />)} */}
            {news && news.map((item: INews) => <NewsItem key={item._id} news={item} />)}
        </div>
    )
}
