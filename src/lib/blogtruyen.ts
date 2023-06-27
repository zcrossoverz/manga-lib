import puppeteer, { Browser } from 'puppeteer';
import {
  AbstractMangaFactory,
  chapter,
  genre,
  image_chapter,
  responseChapter,
  responseDetailManga,
  responseListManga,
} from '../types/type';
import { not_null } from '../utils/validate';
import {
  NETTRUYEN_SORT_FILTER,
  NETTRUYEN_STATUS_FILTER,
} from '../constants/filter';

export class Blogtruyen implements AbstractMangaFactory {
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
    await _page.goto(
      `${this.baseUrl}/timkiem/nangcao/1/0/-1/-1?txt=${keyword}${
        page > 1 ? `&page=${page}` : ``
      }`
    );

    const element = await _page.$$(
      '#wrapper > section.main-content > div:nth-child(1) >  div:nth-child(1) > section > article > section > div.list > p:not(.uppercase)'
    );
    const totalPage = parseInt(
      not_null(
        await _page.$eval(
          '#wrapper > section.main-content > div:nth-child(1) >  div:nth-child(1) > section > article > section > div.row > div > nav > ul > li:last-child > a',
          (el) => el.getAttribute('href')
        )
      ).split(`/timkiem/nangcao/1/0/-1/-1?txt=${keyword}&p=`)[1]
    );
    const data = await Promise.all(
      element.map(async (e, i) => {
        const href = not_null(
          await e.$eval('span:nth-child(1) > a', (el) =>
            el.getAttribute('href')
          )
        );

        const title = not_null(
          await e.$eval('span:nth-child(1) > a', (el) => el.textContent)
        );
        return {
          _id: i,
          title,
          image_thumbnail:
            '!! Not working at this time | Will be fixed soon !!',
          href: this.baseUrl + href,
        };
      })
    );
    return {
      totalData: element.length,
      totalPage,
      currentPage: page !== undefined ? page : 1,
      canNext: page === totalPage ? false : true,
      canPrev: page === 1 ? false : true,
      data,
    };
  }

  async getListByGenre(
    genre: genre,
    page = 1,
    status?: NETTRUYEN_STATUS_FILTER,
    sort?: NETTRUYEN_SORT_FILTER
  ): Promise<responseListManga> {
    const path = genre.path;
    const _page = await (await this.browser).newPage();
    await _page.goto(`${this.baseUrl}${path}`);
    const element = await _page.$$(
      '#wrapper > section.main-content > div:nth-child(1) >  div:nth-child(1) > article > section > div.list > p:not(.uppercase)'
    );
    let totalPage = parseInt(
      not_null(
        await _page.$eval(
          '#wrapper > section.main-content > div >  div:nth-child(1) > article > section > div.paging > span:last-child > a',
          (el) => el.getAttribute('href')
        )
      )
        .split('javascript:LoadMangaPage(')[1]
        .split(')')[0]
    );
    return {
      totalData: element.length,
      totalPage,
      currentPage: page !== undefined ? page : 1,
      canNext: page === totalPage ? false : true,
      canPrev: page === 1 ? false : true,
      data: await Promise.all(
        element.map(async (e, i) => {
          const href = not_null(
            await e.$eval('span.tiptip > a', (el) => el.getAttribute('href'))
          );

          const title = not_null(
            await e.$eval('span.tiptip > a', (el) => el.textContent)
          );

          return {
            _id: i,
            title,
            image_thumbnail:
              '!! Not working at this time | Will be fixed soon !!',
            href: this.baseUrl + href.trim().slice(1),
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
    url = url !== undefined ? url : '';
    path = path !== undefined ? path : '';

    const _page = await (await this.browser).newPage();
    await _page.goto(url_chapter);
    const content = await _page.$('#readonline > section');
    const title = not_null(
      await _page.$eval('#readonline > header > h1', (el) => el.textContent)
    );
    const images: image_chapter[] = await Promise.all(
      (
        await content!.$$('#content > img')
      ).map(async (e, i) => {
        const _data_image = await e.evaluate((el) => {
          return {
            src_origin: el.getAttribute('src'),
            src_cdn: 'N|A',
          };
        });
        return {
          _id: i,
          src_origin: not_null(_data_image.src_origin),
          src_cdn: not_null(_data_image.src_cdn),
          alt: not_null(title + ' id : ' + i),
        };
      })
    );
    const next: chapter = {} as chapter;
    if (next_chapter === undefined) {
      const next_chapter_get = await _page.$eval(
        '#readonline > section > div:first-child > a:first-child ',
        (el) => {
          return {
            url_chapter: el.getAttribute('href'),
          };
        }
      );
      next.url = this.baseUrl + not_null(next_chapter_get.url_chapter).trim();
      next.parent_href = url_chapter;
      next.path = not_null(next_chapter_get.url_chapter);
    }
    const prev: chapter = {} as chapter;
    if (prev_chapter === undefined) {
      const prev_chapter_get = await _page.$eval(
        '#readonline > section > div:first-child > a:last-child ',
        (el) => {
          return {
            url_chapter: el.getAttribute('href'),
          };
        }
      );
      prev.url = this.baseUrl + not_null(prev_chapter_get.url_chapter).trim();
      prev.parent_href = url_chapter;
      prev.path = not_null(prev_chapter_get.url_chapter);
    }
    return {
      url,
      path,
      chapter_data: images,
      title,
      next_chapter: next_chapter === undefined ? next : next_chapter,
      prev_chapter: prev_chapter === undefined ? prev : prev_chapter,
    };
  }

  async getDetailManga(url: string): Promise<responseDetailManga> {
    const _page = await (await this.browser).newPage();
    await _page.goto(url);
    const content = await _page.$(
      '#wrapper > section.main-content > div.row > div.col-md-8 > section.manga-detail'
    );
    const title = await content!.$eval(
      'h1.entry-title',
      (el) => el.textContent
    );
    const path = url.substring(`${this.baseUrl}`.length);
    const author = await content!.$eval(
      'div.description > p:nth-child(2) > a',
      (el) => el.textContent
    );

    const status = await content!.$eval(
      'div.description > p:nth-child(5) > span',
      (el) => el.textContent
    );

    const genres: genre[] = await Promise.all(
      (
        await content!.$$('div.description > p:nth-child(4) > span > a')
      ).map(async (e) => {
        const data = await e.evaluate((el) => {
          return {
            url: el.getAttribute('href'),
            path: el.getAttribute('href'),
            name: el.textContent,
          };
        });
        return {
          url: this.baseUrl + not_null(data.url).trim(),
          path: not_null(data.url).trim().slice(1),
          name: not_null(data.name),
        };
      })
    );

    const views = await content!.$eval('#PageViews', (el) => el.textContent);

    const chapters: chapter[] = await Promise.all(
      (
        await content!.$$(
          'div.list-chapters > #loadChapter > #list-chapters > p'
        )
      ).map(async (e) => {
        const chapter_anchor = await e.$eval('span.title > a', (el) => {
          const data = {
            title: el.textContent,
            url: el.getAttribute('href'),
          };
          return {
            title: data.title,
            url: data.url,
          };
        });

        const last_update = await e.$eval(
          'span.publishedDate',
          (el) => el.textContent
        );
        return {
          title: not_null(chapter_anchor.title).trim(),
          url: this.baseUrl + not_null(chapter_anchor.url).trim(),
          path: not_null(chapter_anchor.url).trim(),
          parent_href: url,
          last_update: not_null(last_update),
        };
      })
    );

    const rate = 'N|A';

    const rate_number = 'N|A';
    const follows = not_null(
      await content!.$eval('#LikeCount', (el) => el.textContent)
    );
    return {
      title: not_null(title).trim(),
      path,
      author: not_null(author).trim(),
      url,
      status: not_null(status).trim(),
      genres,
      views: not_null(views),
      rate,
      rate_number,
      follows,
      chapters,
    };
  }

  async getListLatestUpdate(page = 1): Promise<responseListManga> {
    const _page = await (await this.browser).newPage();
    await _page.goto(`${this.baseUrl}${page > 1 ? `/?page=${page}` : ``}`);

    const element = await _page.$$(
      '#wrapper > section.main-content > div > div:nth-child(1) > section.list-mainpage > div:nth-child(1) > div > div'
    );
    const totalPage = parseInt(
      not_null(
        await _page.$eval(
          '#wrapper > section.main-content > div > div:nth-child(1) > section.list-mainpage > div:nth-child(2) > div > nav > ul > li:last-child > a',
          (el) => el.getAttribute('href')
        )
      ).split('/page-')[1]
    );
    return {
      totalData: element.length,
      totalPage,
      currentPage: page,
      canNext: page === totalPage ? false : true,
      canPrev: page === 1 ? false : true,
      data: await Promise.all(
        element.map(async (e, i) => {
          const image_thumbnail: string = await e.$eval(
            'div.fl-l > a > img',
            (el) => el.getAttribute('src')!
          );

          const link = await e.$eval('div.fl-r > h3 > a', (el) => {
            return {
              title: el.textContent,
              href: el.getAttribute('href'),
            };
          });

          return {
            _id: i,
            title: not_null(link.title),
            href: 'https://blogtruyen.vn' + not_null(link.href),
            image_thumbnail: image_thumbnail.startsWith('//')
              ? `https:${image_thumbnail}`
              : image_thumbnail,
          };
        })
      ),
    };
  }
}
