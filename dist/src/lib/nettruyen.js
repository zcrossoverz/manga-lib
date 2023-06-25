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
exports.Nettruyen = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const validate_1 = require("../utils/validate");
class Nettruyen {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.browser = puppeteer_1.default.launch({
            headless: "new",
        });
        this.all_genres = [];
    }
    search(keyword, page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const _page = yield (yield this.browser).newPage();
            yield _page.setRequestInterception(true);
            _page.on("request", (req) => {
                if (req.resourceType() !== "document")
                    req.abort();
                else
                    req.continue();
            });
            yield _page.goto(`${this.baseUrl}/tim-truyen?keyword=${keyword}${page > 1 ? `&page=${page}` : ``}`);
            const element = yield _page.$$("#ctl00_divCenter > div.Module.Module-170 > div > div.items > div > div.item > figure");
            const is_multipage = yield _page
                .$eval("#ctl00_mainContent_ctl01_divPager", () => true)
                .catch(() => false);
            const canNext = is_multipage
                ? yield _page
                    .$eval("#ctl00_mainContent_ctl01_divPager > ul > li > a.next-page", () => true)
                    .catch(() => false)
                : false;
            const canPrev = is_multipage
                ? yield _page
                    .$eval("#ctl00_mainContent_ctl01_divPager > ul > li > a.prev-page", () => true)
                    .catch(() => false)
                : false;
            const totalPage = is_multipage
                ? parseInt((0, validate_1.not_null)(yield _page.$eval("#ctl00_mainContent_ctl01_divPager > ul > li:last-child > a", (el) => el.getAttribute("href"))).split("page=")[1])
                : 0;
            return {
                totalData: element.length,
                totalPage,
                currentPage: page !== undefined ? page : 1,
                canNext,
                canPrev,
                data: yield Promise.all(element.map((e, i) => __awaiter(this, void 0, void 0, function* () {
                    const href = (0, validate_1.not_null)(yield e.$eval("div.image > a", (el) => el.getAttribute("href")));
                    const title = (0, validate_1.not_null)(yield e.$eval("figcaption > h3 > a", (el) => el.textContent));
                    const image_thumbnail = (0, validate_1.not_null)(yield e.$eval("div.image > a > img", (el) => el.getAttribute("data-original")));
                    return {
                        _id: i,
                        title,
                        image_thumbnail: image_thumbnail.startsWith("//")
                            ? `https:${image_thumbnail}`
                            : image_thumbnail,
                        href,
                    };
                }))),
            };
        });
    }
    getListByGenre(genre, page, status, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            const _page = yield (yield this.browser).newPage();
            let path = genre.path;
            if (sort !== undefined) {
                path += `?sort=${sort}${status !== undefined ? `&status=${status}` : "&status=-1"}${page !== undefined ? `&page=${page}` : ""}`;
            }
            else if (status !== undefined) {
                path += `?status=${status}${page !== undefined ? `&page=${page}` : ""}`;
            }
            else if (page !== undefined) {
                path += `?page=${page}`;
            }
            yield _page.setRequestInterception(true);
            _page.on("request", (req) => {
                if (req.resourceType() !== "document")
                    req.abort();
                else
                    req.continue();
            });
            yield _page.goto(`${this.baseUrl}${path}`);
            const element = yield _page.$$("#ctl00_divCenter > div.Module.Module-170 > div > div.items > div > div.item > figure");
            const canNext = yield _page
                .$eval("#ctl00_mainContent_ctl01_divPager > ul > li > a.next-page", () => true)
                .catch(() => false);
            const canPrev = yield _page
                .$eval("#ctl00_mainContent_ctl01_divPager > ul > li > a.prev-page", () => true)
                .catch(() => false);
            const totalPage = parseInt((0, validate_1.not_null)(yield _page.$eval("#ctl00_mainContent_ctl01_divPager > ul > li:last-child > a", (el) => el.getAttribute("href"))).split("page=")[1]);
            return {
                totalData: element.length,
                totalPage,
                currentPage: page !== undefined ? page : 1,
                canNext,
                canPrev,
                data: yield Promise.all(element.map((e, i) => __awaiter(this, void 0, void 0, function* () {
                    const href = (0, validate_1.not_null)(yield e.$eval("div.image > a", (el) => el.getAttribute("href")));
                    const title = (0, validate_1.not_null)(yield e.$eval("figcaption > h3 > a", (el) => el.textContent));
                    const image_thumbnail = (0, validate_1.not_null)(yield e.$eval("div.image > a > img", (el) => el.getAttribute("data-original")));
                    return {
                        _id: i,
                        title,
                        image_thumbnail: image_thumbnail.startsWith("//")
                            ? `https:${image_thumbnail}`
                            : image_thumbnail,
                        href,
                    };
                }))),
            };
        });
    }
    getDataChapter(url_chapter, url, path, prev_chapter, next_chapter) {
        return __awaiter(this, void 0, void 0, function* () {
            url = url !== undefined ? url : "";
            path = path !== undefined ? path : "";
            const _page = yield (yield this.browser).newPage();
            yield _page.setRequestInterception(true);
            _page.on("request", (req) => {
                if (req.resourceType() !== "document")
                    req.abort();
                else
                    req.continue();
            });
            yield _page.goto(url_chapter);
            const content = yield _page.$("#ctl00_divCenter > div > div.reading-detail.box_doc");
            const title = (0, validate_1.not_null)(yield _page.$eval("#ctl00_divCenter > div > div:nth-child(1) > div.top > h1", (el) => el.textContent));
            const images = yield Promise.all((yield content.$$("div.page-chapter > img")).map((e, i) => __awaiter(this, void 0, void 0, function* () {
                const _data_image = yield e.evaluate((el) => {
                    return {
                        src_origin: el.getAttribute("data-original"),
                        src_cdn: el.getAttribute("data-cdn"),
                        alt: el.getAttribute("alt"),
                    };
                });
                return Object.assign(Object.assign({ _id: i, src_origin: (0, validate_1.not_null)(_data_image.src_origin).startsWith("//")
                        ? `https:${(0, validate_1.not_null)(_data_image.src_origin)}`
                        : (0, validate_1.not_null)(_data_image.src_origin) }, ((0, validate_1.not_null)(_data_image.src_cdn) !== ""
                    ? {
                        src_cdn: (0, validate_1.not_null)(_data_image.src_cdn).startsWith("//")
                            ? `https:${(0, validate_1.not_null)(_data_image.src_cdn)}`
                            : (0, validate_1.not_null)(_data_image.src_cdn),
                    }
                    : {})), { alt: (0, validate_1.not_null)(_data_image.alt) });
            })));
            const prev = {};
            if (prev_chapter === undefined) {
                const prev_chapter_get = yield _page.$eval("#chapterNav > a.prev.a_prev", (el) => {
                    return {
                        url_chapter: el.getAttribute("href"),
                    };
                });
                prev.url = (0, validate_1.not_null)(prev_chapter_get.url_chapter);
                prev.parent_href = url;
                prev.path = url.substring(`${this.baseUrl}`.length);
            }
            const next = {};
            if (next_chapter === undefined) {
                const next_chapter_get = yield _page.$eval("#chapterNav > a.next.a_next", (el) => {
                    return {
                        url_chapter: el.getAttribute("href"),
                    };
                });
                next.url = (0, validate_1.not_null)(next_chapter_get.url_chapter);
                next.parent_href = url;
                next.path = url.substring(`${this.baseUrl}`.length);
            }
            return {
                url,
                path,
                chapter_data: images,
                title,
                next_chapter: next_chapter !== undefined
                    ? next_chapter
                    : next.url !== "#"
                        ? next
                        : null,
                prev_chapter: prev_chapter !== undefined
                    ? prev_chapter
                    : prev.url !== "#"
                        ? prev
                        : null,
            };
        });
    }
    getDetailManga(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const _page = yield (yield this.browser).newPage();
            yield _page.setRequestInterception(true);
            _page.on("request", (req) => {
                if (req.resourceType() !== "document")
                    req.abort();
                else
                    req.continue();
            });
            yield _page.goto(url);
            const content = yield _page.$("#ctl00_divCenter");
            const title = yield content.$eval("article > h1", (el) => el.textContent);
            const path = url.substring(`${this.baseUrl}`.length);
            const author = yield content.$eval("#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li.author.row > p.col-xs-8", (el) => el.textContent);
            const status = yield content.$eval("#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li.status.row > p.col-xs-8", (el) => el.textContent);
            const genres = yield Promise.all((yield content.$$("#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li.kind.row > p.col-xs-8 > a")).map((e) => __awaiter(this, void 0, void 0, function* () {
                const data = yield e.evaluate((el) => {
                    return {
                        url: el.getAttribute("href"),
                        path: el.getAttribute("href"),
                        name: el.textContent,
                    };
                });
                return {
                    url: (0, validate_1.not_null)(data.url),
                    path: (0, validate_1.not_null)(data.path).substring(`${this.baseUrl}`.length),
                    name: (0, validate_1.not_null)(data.name),
                };
            })));
            const views = yield content.$eval("#item-detail > div.detail-info > div.row > div.col-xs-8.col-info > ul > li:last-child > p.col-xs-8", (el) => el.textContent);
            const chapters = yield Promise.all((yield content.$$(".list-chapter > nav > ul > li")).map((e) => __awaiter(this, void 0, void 0, function* () {
                const chapter_anchor = yield e.$eval(".col-xs-5.chapter > a", (el) => {
                    const data = {
                        title: el.textContent,
                        url: el.getAttribute("href"),
                    };
                    return {
                        title: data.title,
                        url: data.url,
                    };
                });
                const last_update = yield e.$eval(".col-xs-4.text-center.no-wrap.small", (el) => el.textContent);
                const views_chapter = yield e.$eval(".col-xs-3.text-center.small", (el) => el.textContent);
                return {
                    title: (0, validate_1.not_null)(chapter_anchor.title),
                    url: (0, validate_1.not_null)(chapter_anchor.url),
                    path: (0, validate_1.not_null)(chapter_anchor.url).substring(`${this.baseUrl}`.length),
                    parent_href: url,
                    last_update: (0, validate_1.not_null)(last_update),
                    views: (0, validate_1.not_null)(views_chapter),
                };
            })));
            const rate = (0, validate_1.not_null)(yield content.$eval("#item-detail > div.detail-info > div > div.col-xs-8.col-info > div.mrt5.mrb10 > span > span:nth-child(1)", (el) => el.textContent));
            const rate_number = (0, validate_1.not_null)(yield content.$eval("#item-detail > div.detail-info > div > div.col-xs-8.col-info > div.mrt5.mrb10 > span > span:nth-child(3)", (el) => el.textContent));
            const follows = (0, validate_1.not_null)(yield content.$eval("#item-detail > div.detail-info > div > div.col-xs-8.col-info > div.follow > span > b", (el) => el.textContent));
            return {
                title: (0, validate_1.not_null)(title),
                path,
                author: (0, validate_1.not_null)(author),
                url,
                status: (0, validate_1.not_null)(status),
                genres,
                views: (0, validate_1.not_null)(views),
                rate,
                rate_number,
                follows,
                chapters,
            };
        });
    }
    getListLatestUpdate(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const _page = yield (yield this.browser).newPage();
            yield _page.setRequestInterception(true);
            _page.on("request", (req) => {
                if (req.resourceType() !== "document")
                    req.abort();
                else
                    req.continue();
            });
            yield _page.goto(`${this.baseUrl}${page > 1 ? `/?page=${page}` : ``}`);
            const element = yield _page.$$("#ctl00_divCenter > div > div > div.items > div.row > div.item");
            const canNext = yield _page
                .$eval("#ctl00_mainContent_ctl00_divPager > ul > li > a.next-page", () => true)
                .catch(() => false);
            const canPrev = yield _page
                .$eval("#ctl00_mainContent_ctl00_divPager > ul > li > a.prev-page", () => true)
                .catch(() => false);
            const totalPage = parseInt((0, validate_1.not_null)(yield _page.$eval("#ctl00_mainContent_ctl00_divPager > ul > li:last-child > a", (el) => el.getAttribute("href"))).split("page=")[1]);
            return {
                totalData: element.length,
                totalPage,
                currentPage: page,
                canNext,
                canPrev,
                data: yield Promise.all(element.map((e, i) => __awaiter(this, void 0, void 0, function* () {
                    const image_thumbnail = yield e.$eval(".image > a > img", (el) => el.getAttribute("data-original"));
                    const link = yield e.$eval("figure > figcaption > h3 > a", (el) => {
                        return {
                            title: el.textContent,
                            href: el.getAttribute("href"),
                        };
                    });
                    return {
                        _id: i,
                        title: (0, validate_1.not_null)(link.title),
                        href: (0, validate_1.not_null)(link.href),
                        image_thumbnail: image_thumbnail.startsWith("//")
                            ? `https:${image_thumbnail}`
                            : image_thumbnail,
                    };
                }))),
            };
        });
    }
}
exports.Nettruyen = Nettruyen;
