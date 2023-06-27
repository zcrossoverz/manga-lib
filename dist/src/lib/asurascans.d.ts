import { Browser } from 'puppeteer';
import { AbstractMangaFactory, chapter, genre, responseChapter, responseDetailManga, responseListManga } from '../types/type';
import { NETTRUYEN_SORT_FILTER, NETTRUYEN_STATUS_FILTER } from '../constants/filter';
export declare class AsuraScans implements AbstractMangaFactory {
    baseUrl: string;
    all_genres: genre[];
    browser: Promise<Browser>;
    constructor(baseUrl: string);
    search(keyword: string, page?: number): Promise<responseListManga>;
    getListByGenre(genre: genre, page?: number, status?: NETTRUYEN_STATUS_FILTER, sort?: NETTRUYEN_SORT_FILTER): Promise<responseListManga>;
    getDataChapter(url_chapter: string, url?: string, path?: string, prev_chapter?: chapter, next_chapter?: chapter): Promise<responseChapter>;
    getDetailManga(url: string): Promise<responseDetailManga>;
    getListLatestUpdate(page?: number): Promise<responseListManga>;
}
