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
exports.AsuraScans = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const validate_1 = require("../utils/validate");
const getListLatest_1 = require("../hooks/getListLatest");
const getDataChapter_1 = require("../hooks/getDataChapter");
class AsuraScans {
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
            yield _page.setRequestInterception(true);
            _page.on('request', (req) => {
                if (req.resourceType() !== 'document')
                    req.abort();
                else
                    req.continue();
            });
            yield _page.goto(`${this.baseUrl}${page > 1 ? `/page/${page}` : ``}/?s=${keyword}`);
            const paramsSelector = {
                puppeteer: _page,
                wrapSelector: 'div.listupd > div.bs > div.bsx',
                titleSelector: 'a > div.bigor > div.tt',
                thumbnailSelector: 'a > div.limit > img',
                thumbnailAttr: 'src',
                hrefSelector: 'a',
            };
            const data = yield (0, getListLatest_1.useGetDataItemsManga)(paramsSelector);
            const canNext = yield _page
                .$eval('div.pagination > a.next.page-numbers', () => true)
                .catch(() => false);
            const canPrev = yield _page
                .$eval('div.pagination > a.prev.page-numbers', () => true)
                .catch(() => false);
            const totalPages = yield _page.$$('div.pagination > a.page-numbers:not(.prev):not(.next)');
            const totalPage = totalPages !== undefined
                ? Number(yield totalPages[totalPages.length - 1].evaluate((el) => el.textContent))
                : 0;
            return {
                totalData: data.length,
                totalPage,
                currentPage: page !== undefined ? page : 1,
                canNext,
                canPrev,
                data,
            };
        });
    }
    getListByGenre(genre, page, status, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            const _page = yield (yield this.browser).newPage();
            const url = `${this.baseUrl}${genre.path}${page !== undefined && page > 1 ? `/page/${page}` : ``}`;
            yield _page.setRequestInterception(true);
            _page.on('request', (req) => {
                if (req.resourceType() !== 'document')
                    req.abort();
                else
                    req.continue();
            });
            yield _page.goto(url);
            const paramsSelector = {
                puppeteer: _page,
                wrapSelector: 'div.listupd > div.bs > div.bsx',
                titleSelector: 'a > div.bigor > div.tt',
                thumbnailSelector: 'a > div.limit > img',
                thumbnailAttr: 'src',
                hrefSelector: 'a',
            };
            const data = yield (0, getListLatest_1.useGetDataItemsManga)(paramsSelector);
            const canNext = yield _page
                .$eval('div.pagination > a.next.page-numbers', () => true)
                .catch(() => false);
            const canPrev = yield _page
                .$eval('div.pagination > a.prev.page-numbers', () => true)
                .catch(() => false);
            const totalPages = yield _page.$$('div.pagination > a.page-numbers:not(.prev):not(.next)');
            const totalPage = totalPages !== undefined
                ? Number(yield totalPages[totalPages.length - 1].evaluate((el) => el.textContent))
                : 0;
            return {
                totalData: data.length,
                totalPage,
                currentPage: page !== undefined ? page : 1,
                canNext,
                canPrev,
                data,
            };
        });
    }
    getDataChapter(url_chapter, url, path, prev_chapter, next_chapter) {
        return __awaiter(this, void 0, void 0, function* () {
            const _page = yield (yield this.browser).newPage();
            yield _page.setRequestInterception(true);
            _page.on('request', (req) => {
                if (req.resourceType() !== 'document')
                    req.abort();
                else
                    req.continue();
            });
            yield _page.goto(url_chapter);
            const paramsSelector = {
                puppeteer: _page,
                mainContentSelector: 'div.chapterbody > div.postarea > article',
                titleSelector: 'div.headpost > h1',
                imageSelectorAll: 'div#readerarea > p > img',
                originImageAttr: 'src',
                prevChapterSelector: '.navlef > .npv.r > div.nextprev > a.ch-prev-btn',
                nextChapterSelector: '.navlef > .npv.r > div.nextprev > a.ch-next-btn',
                baseUrl: this.baseUrl,
                url: url_chapter,
            };
            const data = yield (0, getDataChapter_1.useGetDataChapter)(paramsSelector);
            const scripts = yield _page.$$('script');
            const script = yield scripts[18].evaluate((e) => {
                return JSON.parse(e.textContent.split('ts_reader.run(')[1].split(');')[0]);
            });
            return Object.assign(Object.assign(Object.assign(Object.assign({}, (url !== undefined ? { url } : {})), (path !== undefined ? { path } : {})), data), { next_chapter: script.nextUrl !== ''
                    ? {
                        url: script.nextUrl,
                        parent_href: url !== undefined ? url : '',
                        path: script.nextUrl.substring(`${this.baseUrl}`.length),
                    }
                    : null, prev_chapter: script.prevUrl !== ''
                    ? {
                        url: script.prevUrl,
                        parent_href: url !== undefined ? url : '',
                        path: script.prevUrl.substring(`${this.baseUrl}`.length),
                    }
                    : null });
        });
    }
    getDetailManga(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const _page = yield (yield this.browser).newPage();
            yield _page.setRequestInterception(true);
            _page.on('request', (req) => {
                if (req.resourceType() !== 'document')
                    req.abort();
                else
                    req.continue();
            });
            yield _page.goto(url);
            const content = yield _page.$('div.postbody');
            const title = yield content.$eval('article > div.bixbox.animefull > div.bigcontent.nobigcover > div.infox > h1', (el) => el.textContent);
            const path = url.substring(`${this.baseUrl}`.length);
            const author = yield content.$eval('article > div.bixbox.animefull > div.bigcontent.nobigcover > div.infox > div.flex-wrap > div:nth-child(2) > span', (el) => el.textContent);
            const status = yield content.$eval('article > div.bixbox.animefull > div.bigcontent.nobigcover > div.thumbook > div.rt > div.tsinfo > div:nth-child(1) > i', (el) => el.textContent);
            const genres = yield Promise.all((yield content.$$('article > div.bixbox.animefull > div.bigcontent.nobigcover > div.infox > div.wd-full > span > a')).map((e) => __awaiter(this, void 0, void 0, function* () {
                const data = yield e.evaluate((el) => {
                    return {
                        url: el.getAttribute('href'),
                        path: el.getAttribute('href'),
                        name: el.textContent,
                    };
                });
                return {
                    url: (0, validate_1.not_null)(data.url),
                    path: (0, validate_1.not_null)(data.path).substring(`${this.baseUrl}`.length),
                    name: (0, validate_1.not_null)(data.name),
                };
            })));
            const chapters = yield Promise.all((yield content.$$('#chapterlist > ul > li')).map((e) => __awaiter(this, void 0, void 0, function* () {
                const chapter_anchor = yield e.$eval('a', (el) => {
                    const data = {
                        title: el.children[0].textContent,
                        url: el.getAttribute('href'),
                    };
                    return {
                        title: data.title,
                        url: data.url,
                    };
                });
                const last_update = yield e.$eval('a > span.chapterdate', (el) => el.textContent);
                return {
                    title: (0, validate_1.not_null)(chapter_anchor.title),
                    url: (0, validate_1.not_null)(chapter_anchor.url),
                    path: (0, validate_1.not_null)(chapter_anchor.url).substring(`${this.baseUrl}`.length),
                    parent_href: url,
                    last_update: (0, validate_1.not_null)(last_update),
                };
            })));
            const rate = (0, validate_1.not_null)(yield content.$eval('article > div.bixbox.animefull > div.bigcontent.nobigcover > div.thumbook > div.rt > div.rating > div > div.num', (el) => el.textContent));
            const follows = (0, validate_1.not_null)(yield content.$eval('article > div.bixbox.animefull > div.bigcontent.nobigcover > div.thumbook > div.rt > div.bmc', (el) => el.textContent));
            return {
                title: (0, validate_1.not_null)(title),
                path,
                author: (0, validate_1.not_null)(author).replace(/\n/g, ''),
                url,
                status: (0, validate_1.not_null)(status),
                genres,
                rate,
                follows: follows.replace(/\D/g, ''),
                chapters,
            };
        });
    }
    getListLatestUpdate(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const _page = yield (yield this.browser).newPage();
            yield _page.setRequestInterception(true);
            _page.on('request', (req) => {
                if (req.resourceType() !== 'document')
                    req.abort();
                else
                    req.continue();
            });
            yield _page.goto(`${this.baseUrl}${page !== undefined && page > 1 ? `/page/${page}` : ``}`);
            const paramsSelector = {
                puppeteer: _page,
                wrapSelector: 'div.listupd > div.utao.styletwo',
                titleSelector: 'div.uta > div.luf > a > h4',
                thumbnailSelector: 'div.uta > div.imgu > a > img',
                thumbnailAttr: 'src',
                hrefSelector: 'div.uta > div.luf > a',
            };
            const data = yield (0, getListLatest_1.useGetDataItemsManga)(paramsSelector);
            const canNext = yield _page
                .$eval('div.hpage > a.r', () => true)
                .catch(() => false);
            const canPrev = yield _page
                .$eval('div.hpage > a.l', () => true)
                .catch(() => false);
            return {
                data,
                totalData: data.length,
                currentPage: page,
                canNext,
                canPrev,
            };
        });
    }
}
exports.AsuraScans = AsuraScans;
