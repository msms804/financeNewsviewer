import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

// fetchTranslation 함수는 이미 제공된 상태입니다.

export const fetchTranslation = async ({ pageParam = 0 }: { pageParam?: number }) => {
    const apiKey = import.meta.env.VITE_NYTIMES_API_KEY;
    const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=stock&sort=newest&fq=news_desk:("Business")&page=${pageParam}&api-key=${apiKey}`;

    const response = await axios.get(url);
    const articles = response.data.response.docs;

    console.log(">>", articles);
    return articles;
};

export const ForTest: React.FC = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
    } = useInfiniteQuery({
        queryKey: ["articles"],
        queryFn: fetchTranslation,
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length ? pages.length : undefined;
        },
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 120,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    if (status === "error") return <p>Error: {error.message}</p>;
    /**
     * 할일
     * 1. too many request 고치고
     * 2. 무한스크롤로 고치고(지금은 버튼 눌러야)
     * 3. promise all 로 했을때랑 성능차 없는지?
     * 4. useInfiniteQuery  공식문서 보고 공부..
     * 5. 
     */
    return (
        <div>
            {data?.pages.map((page, pageIndex) => (
                <React.Fragment key={pageIndex}>
                    {page.map((article: any) => (
                        <div key={article._id}
                            className="m-4">
                            <h2 className="font-semibold text-sm">{article.headline.main}</h2>
                            <p className="text-xs">{article.snippet}</p>
                        </div>
                    ))}
                </React.Fragment>
            ))}
            <div>
                {isFetchingNextPage ? (
                    <p>더 불러오는중..</p>
                ) : (
                    <button
                        onClick={() => fetchNextPage()}
                        disabled={!hasNextPage || isFetchingNextPage}
                    >
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
};

