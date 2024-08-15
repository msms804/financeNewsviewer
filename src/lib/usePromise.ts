import { useState, useEffect } from "react";

export default function usePromise(promiseCreator: any, deps: any) {
    //대기 중 / 완료 / 실패 에 대한 상태관리
    const [loading, setLoading] = useState(false);
    const [resolved, setResolved] = useState<any>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const process = async () => {
            setLoading(true);
            try {
                const resolved = await promiseCreator();
                setResolved(resolved);
            } catch (error) {
                setError(error as Error);
            }
            setLoading(false);
        }
        process();
    }, deps);

    return [loading, resolved, error];
}