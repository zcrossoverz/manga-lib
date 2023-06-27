import { CheerioAPI } from 'cheerio';
import { Page } from 'puppeteer';
import { responseChapter } from '../types/type';
interface paramsSelector {
    puppeteer?: Page;
    cheerioApi?: CheerioAPI;
    mainContentSelector: string;
    baseUrl: string;
    url: string;
    prev_chapter?: string;
    next_chapter?: string;
    titleSelector: string;
    imageSelectorAll: string;
    originImageAttr: string;
    cdnImageAttr?: string;
    prevChapterSelector: string;
    nextChapterSelector: string;
}
export declare const useGetDataChapter: (params: paramsSelector) => Promise<responseChapter>;
export {};
