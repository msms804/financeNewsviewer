import React, { useEffect } from 'react'

interface IFavicon {
    domain: string;
}
export const Favicon: React.FC<IFavicon> = ({ domain }) => {
    const svgFaviconUrl = `https://logo.clearbit.com/${domain}`;
    useEffect(() => {
        console.log("도메인", domain);
    }, [domain])

    return (
        <img src={svgFaviconUrl} alt={`${domain} favicon`} className='w-6 h-6' />
    )
}
