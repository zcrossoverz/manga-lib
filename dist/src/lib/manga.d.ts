import { MangaType } from '../constants/manga';
import { AbstractMangaFactory, constructorParams } from '../types/type';
export declare class Manga {
    constructor();
    build(type: MangaType, params?: constructorParams): AbstractMangaFactory;
}
