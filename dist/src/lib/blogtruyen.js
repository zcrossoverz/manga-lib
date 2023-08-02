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
exports.Blogtruyen = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const validate_1 = require("../utils/validate");
class Blogtruyen {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.browser = puppeteer_1.default.launch({
            headless: 'new',
        });
        this.all_genres = [];
    }
    search(keyword, page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const _page = yield (yield this.browser).newPage();
            _page.setDefaultNavigationTimeout(0);
            yield _page.setRequestInterception(true);
            _page.on('request', (req) => {
                if (req.resourceType() !== 'document')
                    req.abort();
                else
                    req.continue();
            });
            yield _page.goto(`${this.baseUrl}/timkiem/nangcao/1/0/-1/-1?txt=${keyword}${page > 1 ? `&page=${page}` : ``}`);
            const element = yield _page.$$('#wrapper > section.main-content > div:nth-child(1) >  div:nth-child(1) > section > article > section > div.list > p:not(.uppercase)');
            const totalPage = parseInt((0, validate_1.not_null)(yield _page.$eval('#wrapper > section.main-content > div:nth-child(1) >  div:nth-child(1) > section > article > section > div.row > div > nav > ul > li:last-child > a', (el) => el.getAttribute('href'))).split(`/timkiem/nangcao/1/0/-1/-1?txt=${keyword}&p=`)[1]);
            const data = yield Promise.all(element.map((e, i) => __awaiter(this, void 0, void 0, function* () {
                const href = (0, validate_1.not_null)(yield e.$eval('span:nth-child(1) > a', (el) => el.getAttribute('href')));
                const title = (0, validate_1.not_null)(yield e.$eval('span:nth-child(1) > a', (el) => el.textContent));
                return {
                    _id: i,
                    title,
                    image_thumbnail: '!! Not working at this time | Will be fixed soon !!',
                    href: this.baseUrl + href,
                };
            })));
            return {
                totalData: element.length,
                totalPage,
                currentPage: page !== undefined ? page : 1,
                canNext: page === totalPage ? false : true,
                canPrev: page === 1 ? false : true,
                data,
            };
        });
    }
    getListByGenre(genre, page = 1, status, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            const path = genre.path;
            const _page = yield (yield this.browser).newPage();
            _page.setDefaultNavigationTimeout(0);
            yield _page.setRequestInterception(true);
            _page.on('request', (req) => {
                if (req.resourceType() !== 'document')
                    req.abort();
                else
                    req.continue();
            });
            yield _page.goto(`${this.baseUrl}${path}`);
            const element = yield _page.$$('#wrapper > section.main-content > div:nth-child(1) >  div:nth-child(1) > article > section > div.list > p:not(.uppercase)');
            let totalPage = parseInt((0, validate_1.not_null)(yield _page.$eval('#wrapper > section.main-content > div >  div:nth-child(1) > article > section > div.paging > span:last-child > a', (el) => el.getAttribute('href')))
                .split('javascript:LoadMangaPage(')[1]
                .split(')')[0]);
            return {
                totalData: element.length,
                totalPage,
                currentPage: page !== undefined ? page : 1,
                canNext: page === totalPage ? false : true,
                canPrev: page === 1 ? false : true,
                data: yield Promise.all(element.map((e, i) => __awaiter(this, void 0, void 0, function* () {
                    const href = (0, validate_1.not_null)(yield e.$eval('span.tiptip > a', (el) => el.getAttribute('href')));
                    const title = (0, validate_1.not_null)(yield e.$eval('span.tiptip > a', (el) => el.textContent));
                    return {
                        _id: i,
                        title,
                        image_thumbnail: '!! Not working at this time | Will be fixed soon !!',
                        href: this.baseUrl + href.trim().slice(1),
                    };
                }))),
            };
        });
    }
    getDataChapter(url_chapter, url, path, prev_chapter, next_chapter) {
        return __awaiter(this, void 0, void 0, function* () {
            url = url !== undefined ? url : '';
            path = path !== undefined ? path : '';
            const _page = yield (yield this.browser).newPage();
            _page.setDefaultNavigationTimeout(0);
            yield _page.goto(url_chapter);
            const content = yield _page.$('#readonline > section');
            const title = (0, validate_1.not_null)(yield _page.$eval('#readonline > header > h1', (el) => el.textContent));
            const images = yield Promise.all((yield content.$$('#content > img')).map((e, i) => __awaiter(this, void 0, void 0, function* () {
                const _data_image = yield e.evaluate((el) => {
                    return {
                        src_origin: el.getAttribute('src'),
                        src_cdn: 'N|A',
                    };
                });
                return {
                    _id: i,
                    src_origin: (0, validate_1.not_null)(_data_image.src_origin),
                    src_cdn: (0, validate_1.not_null)(_data_image.src_cdn),
                    alt: (0, validate_1.not_null)(title + ' id : ' + i),
                };
            })));
            const next = {};
            if (next_chapter === undefined) {
                const next_chapter_get = yield _page.$eval('#readonline > section > div:first-child > a:first-child ', (el) => {
                    return {
                        url_chapter: el.getAttribute('href'),
                    };
                });
                next.url = this.baseUrl + (0, validate_1.not_null)(next_chapter_get.url_chapter).trim();
                next.parent_href = url_chapter;
                next.path = (0, validate_1.not_null)(next_chapter_get.url_chapter);
            }
            const prev = {};
            if (prev_chapter === undefined) {
                const prev_chapter_get = yield _page.$eval('#readonline > section > div:first-child > a:last-child ', (el) => {
                    return {
                        url_chapter: el.getAttribute('href'),
                    };
                });
                prev.url = this.baseUrl + (0, validate_1.not_null)(prev_chapter_get.url_chapter).trim();
                prev.parent_href = url_chapter;
                prev.path = (0, validate_1.not_null)(prev_chapter_get.url_chapter);
            }
            return {
                url,
                path,
                chapter_data: images,
                title,
                next_chapter: next_chapter === undefined ? next : next_chapter,
                prev_chapter: prev_chapter === undefined ? prev : prev_chapter,
            };
        });
    }
    getDetailManga(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const _page = yield (yield this.browser).newPage();
            _page.setDefaultNavigationTimeout(0);
            yield _page.setRequestInterception(true);
            _page.on('request', (req) => {
                if (req.resourceType() !== 'document')
                    req.abort();
                else
                    req.continue();
            });
            yield _page.goto(url);
            const content = yield _page.$('#wrapper > section.main-content > div.row > div.col-md-8 > section.manga-detail');
            const title = yield content.$eval('h1.entry-title', (el) => el.textContent);
            const path = url.substring(`${this.baseUrl}`.length);
            const author = yield content.$eval('div.description > p:nth-child(2) > a', (el) => el.textContent);
            const status = yield content.$eval('div.description > p:nth-child(5) > span', (el) => el.textContent);
            const genres = yield Promise.all((yield content.$$('div.description > p:nth-child(4) > span > a')).map((e) => __awaiter(this, void 0, void 0, function* () {
                const data = yield e.evaluate((el) => {
                    return {
                        url: el.getAttribute('href'),
                        path: el.getAttribute('href'),
                        name: el.textContent,
                    };
                });
                return {
                    url: this.baseUrl + (0, validate_1.not_null)(data.url).trim(),
                    path: (0, validate_1.not_null)(data.url).trim().slice(1),
                    name: (0, validate_1.not_null)(data.name),
                };
            })));
            const views = yield content.$eval('#PageViews', (el) => el.textContent);
            const chapters = yield Promise.all((yield content.$$('div.list-chapters > #loadChapter > #list-chapters > p')).map((e) => __awaiter(this, void 0, void 0, function* () {
                const chapter_anchor = yield e.$eval('span.title > a', (el) => {
                    const data = {
                        title: el.textContent,
                        url: el.getAttribute('href'),
                    };
                    return {
                        title: data.title,
                        url: data.url,
                    };
                });
                const last_update = yield e.$eval('span.publishedDate', (el) => el.textContent);
                return {
                    title: (0, validate_1.not_null)(chapter_anchor.title).trim(),
                    url: this.baseUrl + (0, validate_1.not_null)(chapter_anchor.url).trim(),
                    path: (0, validate_1.not_null)(chapter_anchor.url).trim(),
                    parent_href: url,
                    last_update: (0, validate_1.not_null)(last_update),
                };
            })));
            const follows = (0, validate_1.not_null)(yield content.$eval('#LikeCount', (el) => el.textContent));
            return {
                title: (0, validate_1.not_null)(title).trim(),
                path,
                author: (0, validate_1.not_null)(author).trim(),
                url,
                status: (0, validate_1.not_null)(status).trim(),
                genres,
                views: (0, validate_1.not_null)(views),
                follows,
                chapters,
            };
        });
    }
    getListLatestUpdate(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const _page = yield (yield this.browser).newPage();
            _page.setDefaultNavigationTimeout(0);
            yield _page.setRequestInterception(true);
            _page.on('request', (req) => {
                if (req.resourceType() !== 'document')
                    req.abort();
                else
                    req.continue();
            });
            yield _page.goto(`${this.baseUrl}${page > 1 ? `/page-${page}` : ``}`);
            const element = yield _page.$$('#wrapper > section.main-content > div > div:nth-child(1) > section.list-mainpage > div:nth-child(1) > div > div');
            const totalPage = parseInt((0, validate_1.not_null)(yield _page.$eval('#wrapper > section.main-content > div > div:nth-child(1) > section.list-mainpage > div:nth-child(2) > div > nav > ul > li:last-child > a', (el) => el.getAttribute('href'))).split('/page-')[1]);
            return {
                totalData: element.length,
                totalPage,
                currentPage: page,
                canNext: page === totalPage ? false : true,
                canPrev: page === 1 ? false : true,
                data: yield Promise.all(element.map((e, i) => __awaiter(this, void 0, void 0, function* () {
                    const image_thumbnail = yield e.$eval('div.fl-l > a > img', (el) => el.getAttribute('src'));
                    const link = yield e.$eval('div.fl-r > h3 > a', (el) => {
                        return {
                            title: el.textContent,
                            href: el.getAttribute('href'),
                        };
                    });
                    return {
                        _id: i,
                        title: (0, validate_1.not_null)(link.title),
                        href: this.baseUrl + (0, validate_1.not_null)(link.href),
                        image_thumbnail: image_thumbnail.startsWith('//')
                            ? `https:${image_thumbnail}`
                            : image_thumbnail,
                    };
                }))),
            };
        });
    }
}
exports.Blogtruyen = Blogtruyen;
