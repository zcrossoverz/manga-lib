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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetDataItemsManga = void 0;
const validate_1 = require("../utils/validate");
const useGetDataItemsManga = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { cheerioApi, puppeteer, wrapSelector, titleSelector, thumbnailSelector, thumbnailAttr, hrefSelector, } = params;
    let data = [];
    if (cheerioApi !== undefined) {
        const wrapItems = cheerioApi(wrapSelector);
        wrapItems.each((i, e) => {
            data.push({
                _id: i,
                title: cheerioApi(e).find(titleSelector).text(),
                image_thumbnail: (0, validate_1.not_null)(cheerioApi(e).find(thumbnailSelector).attr(thumbnailAttr)),
                href: (0, validate_1.not_null)(cheerioApi(e).find(hrefSelector).attr('href')),
            });
        });
    }
    else {
        const wrapItems = yield puppeteer.$$(wrapSelector);
        data = yield Promise.all(wrapItems.map((e, i) => __awaiter(void 0, void 0, void 0, function* () {
            const image_thumbnail = yield (yield e.$(thumbnailSelector)).evaluate((el, thumbnailAttr) => {
                return el.getAttribute(thumbnailAttr);
            }, thumbnailAttr);
            const { href } = yield e.$eval(hrefSelector, (el) => {
                return {
                    href: el.getAttribute('href'),
                };
            });
            const { title } = yield e.$eval(titleSelector, (el) => {
                return {
                    title: el.textContent,
                };
            });
            return {
                _id: i,
                title: (0, validate_1.not_null)(title).trim().replace(/\n/, ''),
                href: (0, validate_1.not_null)(href),
                image_thumbnail: image_thumbnail.startsWith('//')
                    ? `https:${image_thumbnail}`
                    : image_thumbnail,
            };
        })));
    }
    return data;
});
exports.useGetDataItemsManga = useGetDataItemsManga;
