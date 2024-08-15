import React, { useEffect } from 'react'

interface IFavicon {
    domain: string;
}
export const Favicon: React.FC<IFavicon> = ({ domain }) => {
    const url = `https://www.google.com/s2/favicons?domain=${domain}`;
    useEffect(() => {
        console.log("도메인", domain);
    }, [domain])

    return (
        <img src={url} alt={`${domain} favicon`} />
    )
}
