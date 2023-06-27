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
exports.useGetDataChapter = void 0;
const validate_1 = require("../utils/validate");
const useGetDataChapter = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { puppeteer, cheerioApi, url, prev_chapter, next_chapter, baseUrl, mainContentSelector, titleSelector, imageSelectorAll, originImageAttr, cdnImageAttr, prevChapterSelector, nextChapterSelector, } = params;
    if (cheerioApi === undefined) {
        const content = yield puppeteer.$(mainContentSelector);
        const title = (0, validate_1.not_null)(yield content.$eval(titleSelector, (el) => el.textContent));
        const images = yield Promise.all((yield content.$$(`${imageSelectorAll}`)).map((e, i) => __awaiter(void 0, void 0, void 0, function* () {
            const _data_image = yield e.evaluate((el, originImageAttr, cdnImageAttr) => {
                return Object.assign(Object.assign({ src_origin: el.getAttribute(originImageAttr) }, (cdnImageAttr
                    ? { src_cdn: el.getAttribute(cdnImageAttr) }
                    : {})), { alt: el.getAttribute('alt') });
            }, originImageAttr, cdnImageAttr);
            return Object.assign(Object.assign({ _id: i, src_origin: (0, validate_1.not_null)(_data_image.src_origin).startsWith('//')
                    ? `https:${(0, validate_1.not_null)(_data_image.src_origin)}`
                    : (0, validate_1.not_null)(_data_image.src_origin) }, ((0, validate_1.not_null)(_data_image.src_cdn) !== ''
                ? {
                    src_cdn: (0, validate_1.not_null)(_data_image.src_cdn).startsWith('//')
                        ? `https:${(0, validate_1.not_null)(_data_image.src_cdn)}`
                        : (0, validate_1.not_null)(_data_image.src_cdn),
                }
                : {})), { alt: (0, validate_1.not_null)(_data_image.alt) });
        })));
        const prev = {};
        if (prev_chapter === undefined) {
            const prev_chapter_get = yield content
                .$eval(prevChapterSelector, (el) => {
                return {
                    url_chapter: el.getAttribute('href'),
                };
            })
                .catch(() => null);
            if (prev_chapter_get !== null) {
                prev.url = (0, validate_1.not_null)(prev_chapter_get === null || prev_chapter_get === void 0 ? void 0 : prev_chapter_get.url_chapter);
                prev.parent_href = url;
                prev.path = url.substring(`${baseUrl}`.length);
            }
        }
        const next = {};
        if (next_chapter === undefined) {
            const next_chapter_get = yield content
                .$eval(nextChapterSelector, (el) => {
                return {
                    url_chapter: el.getAttribute('href'),
                    t: el.outerHTML,
                };
            })
                .catch(() => null);
            if (next_chapter_get !== null) {
                next.url = (0, validate_1.not_null)(next_chapter_get === null || next_chapter_get === void 0 ? void 0 : next_chapter_get.url_chapter);
                next.parent_href = url;
                next.path = url.substring(`${baseUrl}`.length);
            }
        }
        return {
            title,
            chapter_data: images,
            next_chapter: Object.keys(next).length === 0 ? null : next,
            prev_chapter: Object.keys(prev).length === 0 ? null : prev,
        };
    }
    else {
        throw new Error('not yet define');
    }
});
exports.useGetDataChapter = useGetDataChapter;
