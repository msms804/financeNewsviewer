import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'

export const useDate = (subtractDate: number) => {
    const [beginDate, setBeginDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    useEffect(() => {
        const today = dayjs();
        const lastDate = today.subtract(subtractDate, "day").format("YYYYMMDD")
        setBeginDate(lastDate);
        setEndDate(today.format("YYYYMMDD"));
    }, [subtractDate])

    return { beginDate, endDate }
}
