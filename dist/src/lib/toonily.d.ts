import { AbstractMangaFactory, chapter, genre, responseChapter, responseDetailManga, responseListManga } from '../types/type';
import { Browser } from 'puppeteer';
export declare class Toonily implements AbstractMangaFactory {
    baseUrl: string;
    all_genres: genre[];
    constructor(baseUrl: string);
    browser?: Promise<Browser> | undefined;
    getListByGenre(genre: genre, page?: number | undefined, status?: any, sort?: any): Promise<responseListManga>;
    getListLatestUpdate(page?: number | undefined): Promise<responseListManga>;
    getDetailManga(url: string): Promise<responseDetailManga>;
    getDataChapter(url_chapter: string, url?: string | undefined, path?: string | undefined, prev_chapter?: chapter | undefined, next_chapter?: chapter | undefined): Promise<responseChapter>;
    search(keyword: string, page?: number | undefined): Promise<responseListManga>;
}
