"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manga = void 0;
const manga_1 = require("../constants/manga");
const nettruyen_1 = require("../lib/nettruyen");
const asurascans_1 = require("./asurascans");
const blogtruyen_1 = require("./blogtruyen");
const toonily_1 = require("./toonily");
const mangadex_1 = require("./mangadex");
class Manga {
    constructor() { }
    build(type, params) {
        switch (type) {
            case manga_1.MangaType.NETTRUYEN: {
                return new nettruyen_1.Nettruyen(params !== undefined && params.baseUrl !== undefined
                    ? params.baseUrl
                    : 'https://www.nettruyenmax.com');
            }
            case manga_1.MangaType.TOONILY: {
                return new toonily_1.Toonily(params !== undefined && params.baseUrl !== undefined
                    ? params.baseUrl
                    : 'https://toonily.com');
            }
            case manga_1.MangaType.ASURASCANS: {
                return new asurascans_1.AsuraScans(params !== undefined && params.baseUrl !== undefined
                    ? params.baseUrl
                    : 'https://www.asurascans.com');
            }
            case manga_1.MangaType.BLOGTRUYEN: {
                return new blogtruyen_1.Blogtruyen(params !== undefined && params.baseUrl !== undefined
                    ? params.baseUrl
                    : 'https://blogtruyen.vn');
            }
            case manga_1.MangaType.MANGADEX: {
                return new mangadex_1.Mangadex(params !== undefined && params.baseUrl !== undefined
                    ? params.baseUrl
                    : 'https://mangadex.org');
            }
            default: {
                return new nettruyen_1.Nettruyen('https://www.nettruyenmax.com');
            }
        }
    }
}
exports.Manga = Manga;
