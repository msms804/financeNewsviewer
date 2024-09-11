import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/ko';

export const useFormattedDateTime = (pubDate: string) => {
    const [date, setDate] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        if (pubDate) {
            dayjs.locale("ko");
            const datetime = dayjs(pubDate);
            const datePart = datetime.format('YYYY년 MM월 DD일 dddd');
            const timePart = datetime.format('HH:mm');
            setDate(datePart);
            setTime(timePart);
        }
    }, [pubDate])

    return { date, time }
}
