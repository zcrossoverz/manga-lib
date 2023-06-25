/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CheerioAPI } from "cheerio";
import { Page } from "puppeteer";
import { not_null } from "../utils/validate";
import { chapter, image_chapter, responseChapter } from "../types/type";

interface paramsSelector {
  puppeteer?: Page;
  cheerioApi?: CheerioAPI;
  mainContentSelector: string;
  baseUrl: string;
  url: string;
  prev_chapter?: string;
  next_chapter?: string;
  titleSelector: string;
  imageSelectorAll: string;
  originImageAttr: string;
  cdnImageAttr?: string;
  prevChapterSelector: string;
  nextChapterSelector: string;
}

export const useGetDataChapter = async (
  params: paramsSelector
): Promise<responseChapter> => {
  const {
    puppeteer,
    cheerioApi,
    url,
    prev_chapter,
    next_chapter,
    baseUrl,
    mainContentSelector,
    titleSelector,
    imageSelectorAll,
    originImageAttr,
    cdnImageAttr,
    prevChapterSelector,
    nextChapterSelector,
  } = params;

  if (cheerioApi === undefined) {
    const content = await puppeteer!.$(mainContentSelector);

    const title = not_null(
      await content!.$eval(titleSelector, (el) => el.textContent)
    );
    const images: image_chapter[] = await Promise.all(
      (
        await content!.$$(`${imageSelectorAll}`)
      ).map(async (e, i) => {
        const _data_image = await e.evaluate(
          (el, originImageAttr, cdnImageAttr) => {
            return {
              src_origin: el.getAttribute(originImageAttr),
              ...(cdnImageAttr
                ? { src_cdn: el.getAttribute(cdnImageAttr) }
                : {}),
              alt: el.getAttribute("alt"),
            };
          },
          originImageAttr,
          cdnImageAttr
        );
        return {
          _id: i,
          src_origin: not_null(_data_image.src_origin).startsWith("//")
            ? `https:${not_null(_data_image.src_origin)}`
            : not_null(_data_image.src_origin),
          ...(not_null(_data_image.src_cdn) !== ""
            ? {
                src_cdn: not_null(_data_image.src_cdn).startsWith("//")
                  ? `https:${not_null(_data_image.src_cdn)}`
                  : not_null(_data_image.src_cdn),
              }
            : {}),
          alt: not_null(_data_image.alt),
        };
      })
    );
    const prev: chapter = {} as chapter;

    if (prev_chapter === undefined) {
      const prev_chapter_get = await content!.$eval(
        prevChapterSelector,
        (el) => {
          return {
            url_chapter: el.getAttribute("href"),
          };
        }
      );

      prev.url = not_null(prev_chapter_get.url_chapter);
      prev.parent_href = url;
      prev.path = url.substring(`${baseUrl}`.length);
    }

    const next: chapter = {} as chapter;

    if (next_chapter === undefined) {
      const next_chapter_get = await content!.$eval(
        nextChapterSelector,
        (el) => {
          return {
            url_chapter: el.getAttribute("href"),
            t: el.outerHTML,
          };
        }
      );

      console.log(next_chapter_get);

      next.url = not_null(next_chapter_get.url_chapter);
      next.parent_href = url;
      next.path = url.substring(`${baseUrl}`.length);
    }

    return {
      title,
      chapter_data: images,
      next_chapter: Object.keys(next).length === 0 ? null : next,
      prev_chapter: Object.keys(prev).length === 0 ? null : prev,
    };
  } else {
    throw new Error("not yet define");
  }
};
