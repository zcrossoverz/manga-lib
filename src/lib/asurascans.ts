/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import puppeteer, { Browser } from 'puppeteer';
import {
  AbstractMangaFactory,
  chapter,
  genre,
  responseChapter,
  responseDetailManga,
  responseListManga,
} from '../types/type';
import { not_null } from '../utils/validate';
import { useGetDataItemsManga } from '../hooks/getListLatest';
import { useGetDataChapter } from '../hooks/getDataChapter';

export class AsuraScans implements AbstractMangaFactory {
  baseUrl: string;
  all_genres: genre[];
  browser: Promise<Browser>;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.browser = puppeteer.launch({
      headless: 'new',
    });
    this.all_genres = [] as genre[];
  }

  async search(keyword: string, page = 1): Promise<responseListManga> {
    const _page = await (await this.browser).newPage();
    await _page.setRequestInterception(true);
    _page.on('request', (req) => {
      if (req.resourceType() !== 'document') req.abort();
      else req.continue();
    });
    await _page.goto(
      `${this.baseUrl}${page > 1 ? `/page/${page}` : ``}/?s=${keyword}`
    );

    const paramsSelector = {
      puppeteer: _page,
      wrapSelector: 'div.listupd > div.bs > div.bsx',
      titleSelector: 'a > div.bigor > div.tt',
      thumbnailSelector: 'a > div.limit > img',
      thumbnailAttr: 'src',
      hrefSelector: 'a',
    };

    const data = await useGetDataItemsManga(paramsSelector);

    const canNext = await _page
      .$eval('div.pagination > a.next.page-numbers', () => true)
      .catch(() => false);

    const canPrev = await _page
      .$eval('div.pagination > a.prev.page-numbers', () => true)
      .catch(() => false);

    const totalPages = await _page.$$(
      'div.pagination > a.page-numbers:not(.prev):not(.next)'
    );

    const totalPage =
      totalPages !== undefined
        ? Number(
            await totalPages[totalPages.length - 1].evaluate(
              (el) => el.textContent!
            )
          )
        : 0;
    return {
      totalData: data.length,
      totalPage,
      currentPage: page !== undefined ? page : 1,
      canNext,
      canPrev,
      data,
    };
  }

  async getListByGenre(
    genre: genre,
    page?: number,
    status?: any,
    sort?: any
  ): Promise<responseListManga> {
    const _page = await (await this.browser).newPage();
    const url = `${this.baseUrl}${genre.path}${
      page !== undefined && page > 1 ? `/page/${page}` : ``
    }`;
    await _page.setRequestInterception(true);
    _page.on('request', (req) => {
      if (req.resourceType() !== 'document') req.abort();
      else req.continue();
    });
    await _page.goto(url);
    const paramsSelector = {
      puppeteer: _page,
      wrapSelector: 'div.listupd > div.bs > div.bsx',
      titleSelector: 'a > div.bigor > div.tt',
      thumbnailSelector: 'a > div.limit > img',
      thumbnailAttr: 'src',
      hrefSelector: 'a',
    };

    const data = await useGetDataItemsManga(paramsSelector);

    const canNext = await _page
      .$eval('div.pagination > a.next.page-numbers', () => true)
      .catch(() => false);

    const canPrev = await _page
      .$eval('div.pagination > a.prev.page-numbers', () => true)
      .catch(() => false);

    const totalPages = await _page.$$(
      'div.pagination > a.page-numbers:not(.prev):not(.next)'
    );

    const totalPage =
      totalPages !== undefined
        ? Number(
            await totalPages[totalPages.length - 1].evaluate(
              (el) => el.textContent!
            )
          )
        : 0;

    return {
      totalData: data.length,
      totalPage,
      currentPage: page !== undefined ? page : 1,
      canNext,
      canPrev,
      data,
    };
  }

  async getDataChapter(
    url_chapter: string,
    url?: string,
    path?: string,
    prev_chapter?: chapter,
    next_chapter?: chapter
  ): Promise<responseChapter> {
    const _page = await (await this.browser).newPage();
    await _page.setRequestInterception(true);
    _page.on('request', (req) => {
      if (req.resourceType() !== 'document') req.abort();
      else req.continue();
    });
    await _page.goto(url_chapter);

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

    const data = await useGetDataChapter(paramsSelector);

    const scripts = await _page.$$('script');
    const script = await scripts[18].evaluate((e) => {
      return JSON.parse(
        e.textContent!.split('ts_reader.run(')[1].split(');')[0]
      );
    });

    return {
      ...(url !== undefined ? { url } : {}),
      ...(path !== undefined ? { path } : {}),
      ...data,
      next_chapter:
        script.nextUrl !== ''
          ? {
              url: script.nextUrl,
              parent_href: url !== undefined ? url : '',
              path: script.nextUrl.substring(`${this.baseUrl}`.length),
            }
          : null,
      prev_chapter:
        script.prevUrl !== ''
          ? {
              url: script.prevUrl,
              parent_href: url !== undefined ? url : '',
              path: script.prevUrl.substring(`${this.baseUrl}`.length),
            }
          : null,
    };
  }

  async getDetailManga(url: string): Promise<responseDetailManga> {
    const _page = await (await this.browser).newPage();
    await _page.setRequestInterception(true);
    _page.on('request', (req) => {
      if (req.resourceType() !== 'document') req.abort();
      else req.continue();
    });
    await _page.goto(url);
    const content = await _page.$('div.postbody');
    const title = await content!.$eval(
      'article > div.bixbox.animefull > div.bigcontent.nobigcover > div.infox > h1',
      (el) => el.textContent
    );
    const path = url.substring(`${this.baseUrl}`.length);
    const author = await content!.$eval(
      'article > div.bixbox.animefull > div.bigcontent.nobigcover > div.infox > div.flex-wrap > div:nth-child(2) > span',
      (el) => el.textContent
    );

    const status = await content!.$eval(
      'article > div.bixbox.animefull > div.bigcontent.nobigcover > div.thumbook > div.rt > div.tsinfo > div:nth-child(1) > i',
      (el) => el.textContent
    );

    const genres: genre[] = await Promise.all(
      (
        await content!.$$(
          'article > div.bixbox.animefull > div.bigcontent.nobigcover > div.infox > div.wd-full > span > a'
        )
      ).map(async (e) => {
        const data = await e.evaluate((el) => {
          return {
            url: el.getAttribute('href'),
            path: el.getAttribute('href'),
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
        await content!.$$('#chapterlist > ul > li')
      ).map(async (e) => {
        const chapter_anchor = await e.$eval('a', (el) => {
          const data = {
            title: el.children[0].textContent,
            url: el.getAttribute('href'),
          };
          return {
            title: data.title,
            url: data.url,
          };
        });

        const last_update = await e.$eval(
          'a > span.chapterdate',
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
        'article > div.bixbox.animefull > div.bigcontent.nobigcover > div.thumbook > div.rt > div.rating > div > div.num',
        (el) => el.textContent
      )
    );

    const follows = not_null(
      await content!.$eval(
        'article > div.bixbox.animefull > div.bigcontent.nobigcover > div.thumbook > div.rt > div.bmc',
        (el) => el.textContent
      )
    );

    return {
      title: not_null(title),
      path,
      author: not_null(author).replace(/\n/g, ''),
      url,
      status: not_null(status),
      genres,
      rate,
      follows: follows.replace(/\D/g, ''),
      chapters,
    };
  }

  async getListLatestUpdate(page = 1): Promise<responseListManga> {
    const _page = await (await this.browser).newPage();
    await _page.setRequestInterception(true);
    _page.on('request', (req) => {
      if (req.resourceType() !== 'document') req.abort();
      else req.continue();
    });
    await _page.goto(
      `${this.baseUrl}${page !== undefined && page > 1 ? `/page/${page}` : ``}`
    );
    const paramsSelector = {
      puppeteer: _page,
      wrapSelector: 'div.listupd > div.utao.styletwo',
      titleSelector: 'div.uta > div.luf > a > h4',
      thumbnailSelector: 'div.uta > div.imgu > a > img',
      thumbnailAttr: 'src',
      hrefSelector: 'div.uta > div.luf > a',
    };

    const data = await useGetDataItemsManga(paramsSelector);

    const canNext = await _page
      .$eval('div.hpage > a.r', () => true)
      .catch(() => false);

    const canPrev = await _page
      .$eval('div.hpage > a.l', () => true)
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
