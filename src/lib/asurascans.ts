/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import puppeteer, { Browser } from "puppeteer";
import {
  AbstractMangaFactory,
  chapter,
  genre,
  responseChapter,
  responseDetailManga,
  responseListManga,
} from "../types/type";
import { not_null } from "../utils/validate";
import {
  NETTRUYEN_SORT_FILTER,
  NETTRUYEN_STATUS_FILTER,
} from "../constants/filter";
import { useGetDataItemsManga } from "../hooks/getListLatest";
import { useGetDataChapter } from "../hooks/getDataChapter";

export class AsuraScans implements AbstractMangaFactory {
  baseUrl: string;
  all_genres: genre[];
  browser: Promise<Browser>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.browser = puppeteer.launch({
      headless: "new",
    });
    this.all_genres = [] as genre[];
  }

  async search(keyword: string, page = 1): Promise<responseListManga> {
    const _page = await (await this.browser).newPage();
    await _page.setRequestInterception(true);
    _page.on("request", (req) => {
      if (req.resourceType() !== "document") req.abort();
      else req.continue();
    });
    await _page.goto(
      `${this.baseUrl}/tim-truyen?keyword=${keyword}${
        page > 1 ? `&page=${page}` : ``
      }`
    );

    const element = await _page.$$(
      "#ctl00_divCenter > div.Module.Module-170 > div > div.items > div > div.item > figure"
    );

    const is_multipage = await _page
      .$eval("#ctl00_mainContent_ctl01_divPager", () => true)
      .catch(() => false);

    const canNext = is_multipage
      ? await _page
          .$eval(
            "#ctl00_mainContent_ctl01_divPager > ul > li > a.next-page",
            () => true
          )
          .catch(() => false)
      : false;

    const canPrev = is_multipage
      ? await _page
          .$eval(
            "#ctl00_mainContent_ctl01_divPager > ul > li > a.prev-page",
            () => true
          )
          .catch(() => false)
      : false;

    const totalPage = is_multipage
      ? parseInt(
          not_null(
            await _page.$eval(
              "#ctl00_mainContent_ctl01_divPager > ul > li:last-child > a",
              (el) => el.getAttribute("href")
            )
          ).split("page=")[1]
        )
      : 0;

    return {
      totalData: element.length,
      totalPage,
      currentPage: page !== undefined ? page : 1,
      canNext,
      canPrev,
      data: await Promise.all(
        element.map(async (e, i) => {
          const href = not_null(
            await e.$eval("div.image > a", (el) => el.getAttribute("href"))
          );

          const title = not_null(
            await e.$eval("figcaption > h3 > a", (el) => el.textContent)
          );

          const image_thumbnail = not_null(
            await e.$eval("div.image > a > img", (el) =>
              el.getAttribute("data-original")
            )
          );
          return {
            _id: i,
            title,
            image_thumbnail: image_thumbnail.startsWith("//")
              ? `https:${image_thumbnail}`
              : image_thumbnail,
            href,
          };
        })
      ),
    };
  }

  async getListByGenre(
    genre: genre,
    page?: number,
    status?: NETTRUYEN_STATUS_FILTER,
    sort?: NETTRUYEN_SORT_FILTER
  ): Promise<responseListManga> {
    const _page = await (await this.browser).newPage();
    let path = genre.path;
    if (sort !== undefined) {
      path += `?sort=${sort}${
        status !== undefined ? `&status=${status}` : "&status=-1"
      }${page !== undefined ? `&page=${page}` : ""}`;
    } else if (status !== undefined) {
      path += `?status=${status}${page !== undefined ? `&page=${page}` : ""}`;
    } else if (page !== undefined) {
      path += `?page=${page}`;
    }
    await _page.setRequestInterception(true);
    _page.on("request", (req) => {
      if (req.resourceType() !== "document") req.abort();
      else req.continue();
    });
    await _page.goto(`${this.baseUrl}${path}`);
    const element = await _page.$$(
      "#ctl00_divCenter > div.Module.Module-170 > div > div.items > div > div.item > figure"
    );

    const canNext = await _page
      .$eval(
        "#ctl00_mainContent_ctl01_divPager > ul > li > a.next-page",
        () => true
      )
      .catch(() => false);

    const canPrev = await _page
      .$eval(
        "#ctl00_mainContent_ctl01_divPager > ul > li > a.prev-page",
        () => true
      )
      .catch(() => false);

    const totalPage = parseInt(
      not_null(
        await _page.$eval(
          "#ctl00_mainContent_ctl01_divPager > ul > li:last-child > a",
          (el) => el.getAttribute("href")
        )
      ).split("page=")[1]
    );

    return {
      totalData: element.length,
      totalPage,
      currentPage: page !== undefined ? page : 1,
      canNext,
      canPrev,
      data: await Promise.all(
        element.map(async (e, i) => {
          const href = not_null(
            await e.$eval("div.image > a", (el) => el.getAttribute("href"))
          );

          const title = not_null(
            await e.$eval("figcaption > h3 > a", (el) => el.textContent)
          );

          const image_thumbnail = not_null(
            await e.$eval("div.image > a > img", (el) =>
              el.getAttribute("data-original")
            )
          );
          return {
            _id: i,
            title,
            image_thumbnail: image_thumbnail.startsWith("//")
              ? `https:${image_thumbnail}`
              : image_thumbnail,
            href,
          };
        })
      ),
    };
  }

  async getDataChapter(
    url_chapter: string,
    url?: string,
    path?: string,
    prev_chapter?: chapter,
    next_chapter?: chapter
  ): Promise<responseChapter> {
    url = url !== undefined ? url : "";
    path = path !== undefined ? path : "";

    const _page = await (await this.browser).newPage();
    await _page.setRequestInterception(true);
    _page.on("request", (req) => {
      if (req.resourceType() !== "document") req.abort();
      else req.continue();
    });
    await _page.goto(url_chapter);

    const paramsSelector = {
      puppeteer: _page,
      mainContentSelector: "div.chapterbody > div.postarea > article",
      titleSelector: "div.headpost > h1",
      imageSelectorAll: "div#readerarea > p > img",
      originImageAttr: "src",
      prevChapterSelector: ".amob > .npv.r > div.nextprev > a.ch-prev-btn",
      nextChapterSelector: ".amob > .npv.r > div.nextprev > a.ch-next-btn",
      baseUrl: this.baseUrl,
      url: url_chapter,
    };

    const data = await useGetDataChapter(paramsSelector);

    return {
      url,
      path,
      ...data,
    };
  }

  async getDetailManga(url: string): Promise<responseDetailManga> {
    const _page = await (await this.browser).newPage();
    await _page.setRequestInterception(true);
    _page.on("request", (req) => {
      if (req.resourceType() !== "document") req.abort();
      else req.continue();
    });
    await _page.goto(url);
    const content = await _page.$("div.postbody");
    const title = await content!.$eval(
      "article > div.bixbox.animefull > div.bigcontent.nobigcover > div.infox > h1",
      (el) => el.textContent
    );
    const path = url.substring(`${this.baseUrl}`.length);
    const author = await content!.$eval(
      "article > div.bixbox.animefull > div.bigcontent.nobigcover > div.infox > div.flex-wrap > div:nth-child(2) > span",
      (el) => el.textContent
    );

    const status = await content!.$eval(
      "article > div.bixbox.animefull > div.bigcontent.nobigcover > div.thumbook > div.rt > div.tsinfo > div:nth-child(1) > i",
      (el) => el.textContent
    );

    const genres: genre[] = await Promise.all(
      (
        await content!.$$(
          "article > div.bixbox.animefull > div.bigcontent.nobigcover > div.infox > div.wd-full > span > a"
        )
      ).map(async (e) => {
        const data = await e.evaluate((el) => {
          return {
            url: el.getAttribute("href"),
            path: el.getAttribute("href"),
            name: el.textContent,
          };
        });
        return {
          url: not_null(data.url),
          path: not_null(data.path).substring(`${this.baseUrl}`.length),
          name: not_null(data.name),
        };
      })
    );

    const chapters: chapter[] = await Promise.all(
      (
        await content!.$$("#chapterlist > ul > li")
      ).map(async (e) => {
        const chapter_anchor = await e.$eval("a", (el) => {
          const data = {
            title: el.children[0].textContent,
            url: el.getAttribute("href"),
          };
          return {
            title: data.title,
            url: data.url,
          };
        });

        const last_update = await e.$eval(
          "a > span.chapterdate",
          (el) => el.textContent
        );

        return {
          title: not_null(chapter_anchor.title),
          url: not_null(chapter_anchor.url),
          path: not_null(chapter_anchor.url).substring(
            `${this.baseUrl}`.length
          ),
          parent_href: url,
          last_update: not_null(last_update),
        };
      })
    );

    const rate = not_null(
      await content!.$eval(
        "article > div.bixbox.animefull > div.bigcontent.nobigcover > div.thumbook > div.rt > div.rating > div > div.num",
        (el) => el.textContent
      )
    );

    const follows = not_null(
      await content!.$eval(
        "article > div.bixbox.animefull > div.bigcontent.nobigcover > div.thumbook > div.rt > div.bmc",
        (el) => el.textContent
      )
    );

    return {
      title: not_null(title),
      path,
      author: not_null(author).replace(/\n/g, ""),
      url,
      status: not_null(status),
      genres,
      rate,
      follows: follows.replace(/\D/g, ""),
      chapters,
    };
  }

  async getListLatestUpdate(page = 1): Promise<responseListManga> {
    const _page = await (await this.browser).newPage();
    await _page.setRequestInterception(true);
    _page.on("request", (req) => {
      if (req.resourceType() !== "document") req.abort();
      else req.continue();
    });
    await _page.goto(
      `${this.baseUrl}${page !== undefined && page > 1 ? `/page/${page}` : ``}`
    );
    const paramsSelector = {
      puppeteer: _page,
      wrapSelector: "div.listupd > div.utao.styletwo",
      titleSelector: "div.uta > div.luf > a > h4",
      thumbnailSelector: "div.uta > div.imgu > a > img",
      thumbnailAttr: "src",
      hrefSelector: "div.uta > div.luf > a",
    };

    const data = await useGetDataItemsManga(paramsSelector);

    const canNext = await _page
      .$eval("div.hpage > a.r", () => true)
      .catch(() => false);

    const canPrev = await _page
      .$eval("div.hpage > a.l", () => true)
      .catch(() => false);

    return {
      data,
      totalData: data.length,
      currentPage: page,
      canNext,
      canPrev,
    };
  }
}
