import { NETTRUYEN_STATUS_FILTER, NETTRUYEN_SORT_FILTER } from "../constants/filter";
import { AbstractMangaFactory, chapter, genre, responseChapter, responseDetailManga, responseListManga } from "../types/type";
export declare class Toonily implements AbstractMangaFactory {
    baseUrl: string;
    all_genres: genre[];
    constructor(baseUrl: string);
    getListLatestUpdate(page?: number | undefined): Promise<responseListManga>;
    getDetailManga(url: string): Promise<responseDetailManga>;
    getDataChapter(url_chapter: string, url?: string | undefined, path?: string | undefined, prev_chapter?: chapter | undefined, next_chapter?: chapter | undefined): Promise<responseChapter>;
    getListByGenre(genre: genre, page?: number | undefined, status?: NETTRUYEN_STATUS_FILTER | undefined, sort?: NETTRUYEN_SORT_FILTER | undefined): Promise<responseListManga>;
    search(keyword: string, page?: number | undefined): Promise<responseListManga>;
}
