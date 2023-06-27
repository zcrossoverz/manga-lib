import { CheerioAPI } from 'cheerio';
import { Page } from 'puppeteer';
interface MangaDataParams {
    cheerioApi?: CheerioAPI;
    puppeteer?: Page;
    wrapSelector: string;
    titleSelector: string;
    thumbnailSelector: string;
    thumbnailAttr: string;
    hrefSelector: string;
}
export declare const useGetDataItemsManga: (params: MangaDataParams) => Promise<{
    _id: number;
    title: string;
    image_thumbnail: string;
    href: string;
}[]>;
export {};
