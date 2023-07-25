"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mangadex = void 0;
const axios_1 = __importDefault(require("axios"));
class Mangadex {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.all_genres = [];
    }
    getListByGenre(genre, page, status, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Method not implemented.');
        });
    }
    getListLatestUpdate(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let totalData = 0;
            let data = [];
            let offset = 0;
            if (page != undefined)
                if (page >= 0 && page <= 9983)
                    offset = page;
                else
                    throw new Error('Offset is out of bound');
            yield axios_1.default
                .get(`https://api.mangadex.org/manga?limit=16&offset=${offset}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`)
                .then(function (response) {
                const listLatestUpdate = response.data.data;
                totalData = response.data.total;
                data = listLatestUpdate.map((e, i) => {
                    return {
                        _id: offset + i,
                        title: e.attributes.title.en,
                        href: `/${e.id}`,
                        image_thumbnail: 'not implemented',
                    };
                });
            })
                .catch(function (error) {
                console.log(error);
            });
            return {
                totalData,
                canNext: offset <= 9967 ? true : false,
                canPrev: offset === 0 ? false : true,
                totalPage: 9983,
                currentPage: offset,
                data,
            };
        });
    }
    getDetailManga(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const sourceId = url;
            let author = 'null';
            let title = 'null';
            let status = 'null';
            const genres = [];
            yield axios_1.default
                .get(`https://api.mangadex.org/manga/${sourceId}?includes[]=artist&includes[]=author&includes[]=cover_art`)
                .then(function (response) {
                const infoData = response.data.data;
                author = infoData.relationships[0].attributes.name;
                title = infoData.attributes.title.en;
                status = infoData.attributes.status;
                infoData.attributes.tags.map((e) => {
                    genres.push({
                        url: `https://mangadex.org/tag/` + e.id,
                        name: e.attributes.name.en,
                        path: '/tag/' + e.id,
                    });
                });
            })
                .catch(function (error) {
                console.log(error);
            });
            const chapters = [];
            yield axios_1.default
                .get(`https://api.mangadex.org/manga/${sourceId}/feed?translatedLanguage[]=en&includes[]=scanlation_group&&includes[]=user&order[volume]=desc&order[chapter]=desc&offset=0&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`)
                .then(function (response) {
                const chapterData = response.data.data;
                chapterData.map((e) => {
                    chapters.push({
                        path: '/' + e.id,
                        url: `https://mangadex.org/chapter/${e.id}`,
                        parent_href: '/chapter/' + e.id,
                        title: e.attributes.title,
                    });
                });
            })
                .catch(function (error) {
                console.log(error);
            });
            return {
                path: this.baseUrl + `/title/${sourceId}`,
                url,
                author,
                genres,
                title,
                status,
                chapters,
            };
        });
    }
    getDataChapter(url_chapter, url, path, prev_chapter, next_chapter) {
        return __awaiter(this, void 0, void 0, function* () {
            const sourceId = url_chapter;
            const chapter_data = [];
            let title = 'null';
            yield axios_1.default
                .get(`https://api.mangadex.org/chapter/${sourceId}?includes[]=scanlation_group&includes[]=manga&includes[]=user`)
                .then(function (response) {
                const infoData = response.data.data;
                let mangaId = 0;
                for (let i = 0; i < infoData.relationships.length; i++)
                    if (infoData.relationships[i].type == 'manga') {
                        mangaId = i;
                        break;
                    }
                title = `${infoData.relationships[mangaId].attributes.title.en} chap ${infoData.attributes.chapter} [${infoData.attributes.title}]`;
            })
                .catch(function (error) {
                console.log(error);
            });
            yield axios_1.default
                .get(`https://api.mangadex.org/at-home/server/${sourceId}?forcePort443=false`)
                .then(function (response) {
                const hash = response.data.chapter.hash;
                response.data.chapter.data.map((e, i) => {
                    chapter_data.push({
                        _id: i,
                        src_origin: `https://uploads.mangadex.org/data/${hash}/${response.data.chapter.data[i]}`,
                        alt: title + ' id: ' + i,
                    });
                });
            })
                .catch(function (error) {
                console.log(error);
            });
            return {
                url: `${this.baseUrl}/chapter/${sourceId}`,
                path: `/chapter/${sourceId}`,
                title,
                chapter_data,
                prev_chapter: null,
                next_chapter: null,
            };
        });
    }
    search(keyword, page) {
        return __awaiter(this, void 0, void 0, function* () {
            let totalData = 0;
            let data = [];
            let offset = 0;
            if (page != undefined)
                if (page >= 0 && page <= 9983)
                    offset = page;
                else
                    throw new Error('Offset is out of bound');
            yield axios_1.default
                .get(`https://api.mangadex.org/manga?limit=10&offset=${offset}&includes[]=cover_art&includes[]=artist&includes[]=author&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&title=${keyword}&order[relevance]=desc`)
                .then(function (response) {
                totalData = response.data.total;
                const listLatestUpdate = response.data.data;
                totalData = response.data.total;
                data = listLatestUpdate.map((e, i) => {
                    return {
                        _id: i,
                        title: e.attributes.title.en,
                        href: e.id,
                        image_thumbnail: 'not implemented',
                    };
                });
            })
                .catch(function (error) {
                console.log(error);
            });
            return {
                totalData,
                canNext: offset <= 9967 ? true : false,
                canPrev: offset >= 16 ? true : false,
                totalPage: 9983,
                currentPage: offset,
                data,
            };
        });
    }
}
exports.Mangadex = Mangadex;
