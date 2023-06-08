"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manga = void 0;
const manga_1 = require("../constants/manga");
const nettruyen_1 = require("../lib/nettruyen");
const toonily_1 = require("./toonily");
class Manga {
    constructor() { }
    build(type, params) {
        switch (type) {
            case manga_1.MangaType.NETTRUYEN: {
                return new nettruyen_1.Nettruyen(params !== undefined && params.baseUrl !== undefined
                    ? params.baseUrl
                    : "https://www.nettruyenplus.com");
            }
            case manga_1.MangaType.TOONILY: {
                return new toonily_1.Toonily(params !== undefined && params.baseUrl !== undefined
                    ? params.baseUrl
                    : "https://toonily.com");
            }
            default: {
                return new nettruyen_1.Nettruyen("https://www.nettruyenplus.com");
            }
        }
    }
}
exports.Manga = Manga;
