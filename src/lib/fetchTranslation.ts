import { useInfiniteQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { cacheTranslation } from "../features/translationSlice";

const useTranslateWithGPT = () => {
    const dispatch = useDispatch();

    const translateWithGPT = async (englishText: string) => {
        const cachedTranslation = useSelector((state: any) => state.translation[englishText]);
        // 캐시된 번역이 있는지 확인
        if (cachedTranslation) {
            return cachedTranslation;
        }

        // GPT 호출
        console.log(">>Call GPT");
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_GPT_API_KEY}`,
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{
                    "role": "user",
                    "content": `Translate the following text to Korean: ${englishText}`
                }],
                temperature: 0.7,
                max_tokens: 1000,
            })
        });

        const responseData = await response.json();
        const message = responseData.choices[0].message.content;

        // 번역 결과 캐싱
        dispatch(cacheTranslation({ englishText, koreanText: message }));
        return message;
    };

    return translateWithGPT;
};

// 뉴스 데이터와 번역된 텍스트 가져오는 함수 (query function)
export const fetchTranslation = async ({ pageParam = 0 }) => {
    const apiKey = import.meta.env.VITE_NYTIMES_API_KEY;
    const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=stock&sort=newest&fq=news_desk:("Business")&page=${pageParam}&api-key=${apiKey}`;

    const response = await axios.get(url);
    const articles = response.data.response.docs;


    return articles;

};
// export const fetchTranslation = async ({ pageParam = 0 }) => {
//     const apiKey = import.meta.env.VITE_NYTIMES_API_KEY;
//     const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=stock&sort=newest&fq=news_desk:("Business")&page=${pageParam}&api-key=${apiKey}`;

//     const response = await axios.get(url);
//     const articles = response.data.response.docs;

//     const translateWithGPT = useTranslateWithGPT();

//     // 각 기사 번역
//     const translatedArticles = await Promise.all(
//         articles.map(async (article: any) => {
//             const newHeadline = await translateWithGPT(article.headline.main);
//             return {
//                 ...article,
//                 newHeadline,
//             };
//         })
//     );

//     return {
//         articles: translatedArticles,
//         nextPage: pageParam + 1,
//         isLastPage: translatedArticles.length < 10,
//     };
// };