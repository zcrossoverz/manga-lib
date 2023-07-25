import { AbstractMangaFactory, chapter, genre, responseChapter, responseDetailManga, responseListManga } from '../types/type';
export declare class Mangadex implements AbstractMangaFactory {
    baseUrl: string;
    all_genres: genre[];
    constructor(baseUrl: string);
    getListByGenre(genre: genre, page?: number | undefined, status?: any, sort?: any): Promise<responseListManga>;
    getListLatestUpdate(page?: number | undefined): Promise<responseListManga>;
    getDetailManga(url: string): Promise<responseDetailManga>;
    getDataChapter(url_chapter: string, url?: string | undefined, path?: string | undefined, prev_chapter?: chapter | undefined, next_chapter?: chapter | undefined): Promise<responseChapter>;
    search(keyword: string, page?: number | undefined): Promise<responseListManga>;
}
