"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Toonily = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
class Toonily {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.all_genres = [];
    }
    getListLatestUpdate(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const axios_get = yield axios_1.default.get(`${this.baseUrl}${page !== undefined && page > 1 ? `/page/${page}` : ``}`);
            const $ = cheerio.load(axios_get.data);
            const wrap_items = $("#loop-content > div > div > div");
            const data = [];
            wrap_items.each((i, e) => {
                data.push({
                    _id: i,
                    title: $(e)
                        .find("div.item-summary > div.post-title.font-title > h3 > a")
                        .text(),
                    image_thumbnail: $(e)
                        .find("div.item-thumb.c-image-hover > a > img")
                        .attr("data-src"),
                    href: $(e)
                        .find("div.item-summary > div.post-title.font-title > h3 > a")
                        .attr("href"),
                });
            });
            const last_page = $("div.wp-pagenavi").find("a.last").attr("href");
            const totalPage = Number(last_page !== undefined
                ? last_page
                    .substring(0, last_page.length - 1)
                    .split("/")
                    .at(-1)
                : page !== undefined
                    ? page
                    : 1);
            return {
                data,
                totalData: data.length,
                totalPage,
                currentPage: page !== undefined ? page : 1,
                canNext: page !== undefined ? page < totalPage : 1 < totalPage,
                canPrev: page !== undefined ? page > 1 : false,
            };
        });
    }
    getDetailManga(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const $ = cheerio.load((yield axios_1.default.get(url)).data);
            const site_content = $("div.site-content");
            const path = url.substring(this.baseUrl.length);
            const author = site_content
                .find("div.summary-content > div.author-content > a")
                .text();
            const title = site_content
                .find("div.post-content > div.post-title > h1")
                .text()
                .trim();
            const status = site_content
                .find("div.post-status > div.post-content_item > div.summary-content")
                .text()
                .trim();
            const genres = [];
            $("div.genres-content > a").each((_i, e) => {
                genres.push({
                    url: $(e).attr("href"),
                    name: $(e).text(),
                    path: $(e).attr("href").substring(this.baseUrl.length),
                });
            });
            const views = site_content
                .find("div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-content > div:nth-child(5) > div.summary-content")
                .text()
                .split("views")[0]
                .trim()
                .split(" ")
                .at(-1);
            const rate = site_content.find("#averagerate").text().trim();
            const rate_number = site_content.find("#countrate").text();
            const follows = site_content
                .find("div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-status > div.manga-action > div.add-bookmark > div.action_detail > span")
                .text()
                .split(" ")[0];
            const chapters = [];
            site_content
                .find("ul.main.version-chap.no-volumn > li.wp-manga-chapter")
                .each((i, e) => {
                chapters.push({
                    url: $(e).find("a").attr("href"),
                    path: $(e).find("a").attr("href").substring(this.baseUrl.length),
                    parent_href: url,
                    title: $(e).find("a").text().trim(),
                });
            });
            return {
                path,
                url,
                author,
                genres,
                rate,
                rate_number,
                follows,
                views,
                title,
                status,
                chapters,
            };
        });
    }
    getDataChapter(url_chapter, url, path, prev_chapter, next_chapter) {
        return __awaiter(this, void 0, void 0, function* () {
            const $ = cheerio.load((yield axios_1.default.get(url_chapter)).data);
            const site_content = $("div.main-col-inner");
            const title = site_content
                .find("ol.breadcrumb > li:nth-child(3)")
                .text()
                .trim();
            const chapter_data = [];
            site_content
                .find("div.entry-content div.reading-content > div.page-break > img")
                .each((i, e) => {
                chapter_data.push({
                    _id: i,
                    src_origin: $(e).attr("data-src").trim(),
                    alt: $(e).attr("alt"),
                });
            });
            const parent_href = site_content
                .find("ol.breadcrumb > li:nth-child(3) > a")
                .attr("href");
            const next_chapter_data = site_content.find("div.nav-links > div.nav-next > a").length
                ? {
                    url: site_content
                        .find("div.nav-links > div.nav-next > a")
                        .attr("href"),
                    path: site_content
                        .find("div.nav-links > div.nav-next > a")
                        .attr("href")
                        .substring(this.baseUrl.length),
                    parent_href: parent_href,
                    title,
                }
                : null;
            const prev_chapter_data = site_content.find("div.nav-links > div.nav-previous > a").length
                ? {
                    url: site_content
                        .find("div.nav-links > div.nav-previous > a")
                        .attr("href"),
                    path: site_content
                        .find("div.nav-links > div.nav-previous > a")
                        .attr("href")
                        .substring(this.baseUrl.length),
                    parent_href: parent_href,
                    title,
                }
                : null;
            return {
                url: url_chapter,
                path: url_chapter.substring(this.baseUrl.length),
                title,
                chapter_data,
                prev_chapter: prev_chapter !== undefined ? null : prev_chapter_data,
                next_chapter: next_chapter !== undefined ? null : next_chapter_data,
            };
        });
    }
    getListByGenre(genre, page, status, sort) {
        throw new Error("Method not implemented.");
    }
    search(keyword, page) {
        return __awaiter(this, void 0, void 0, function* () {
            keyword = keyword.replace(/\s/g, "-");
            const axios_get = yield axios_1.default.get(`${this.baseUrl}/search/${keyword}${page !== undefined && page > 1 ? `/page/${page}` : ``}`);
            const $ = cheerio.load(axios_get.data);
            const wrap_items = $("div.page-listing-item > div.row.row-eq-height > div > div");
            const data = [];
            wrap_items.each((i, e) => {
                data.push({
                    _id: i,
                    title: $(e)
                        .find("div.item-summary > div.post-title.font-title > h3 > a")
                        .text(),
                    image_thumbnail: $(e)
                        .find("div.item-thumb.c-image-hover > a > img")
                        .attr("data-src"),
                    href: $(e)
                        .find("div.item-summary > div.post-title.font-title > h3 > a")
                        .attr("href"),
                });
            });
            const last_page = $("div.wp-pagenavi").find("a.last").attr("href");
            const totalPage = Number(last_page !== undefined
                ? last_page
                    .substring(0, last_page.length - 1)
                    .split("/")
                    .at(-1)
                : page !== undefined
                    ? page
                    : 1);
            return {
                data,
                totalData: data.length,
                totalPage,
                currentPage: page !== undefined ? page : 1,
                canNext: page !== undefined ? page < totalPage : 1 < totalPage,
                canPrev: page !== undefined ? page > 1 : false,
            };
        });
    }
}
exports.Toonily = Toonily;
