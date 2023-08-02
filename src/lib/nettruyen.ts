/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

export class Nettruyen implements AbstractMangaFactory {
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
    _page.setDefaultNavigationTimeout(0);
    await _page.setRequestInterception(true);
    _page.on('request', (req) => {
      if (req.resourceType() !== 'document') req.abort();
      else req.continue();
    });
    await _page.goto(
      `${this.baseUrl}/tim-truyen?keyword=${keyword}${
        page > 1 ? `&page=${page}` : ``
      }`
    );

    const element = await _page.$$(
      '#ctl00_divCenter > div.Module.Module-170 > div > div.items > div > div.item > figure'
    );

    const is_multipage = await _page
      .$eval('#ctl00_mainContent_ctl01_divPager', () => true)
      .catch(() => false);

    const canNext = is_multipage
      ? await _page
          .$eval(
            '#ctl00_mainContent_ctl01_divPager > ul > li > a.next-page',
            () => true
          )
          .catch(() => false)
      : false;

    const canPrev = is_multipage
      ? await _page
          .$eval(
            '#ctl00_mainContent_ctl01_divPager > ul > li > a.prev-page',
            () => true
          )
          .catch(() => false)
      : false;

    const totalPage = is_multipage
      ? parseInt(
          not_null(
            await _page.$eval(
              '#ctl00_mainContent_ctl01_divPager > ul > li:last-child > a',
              (el) => el.getAttribute('href')
            )
          ).split('page=')[1]
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
            await e.$eval('div.image > a', (el) => el.getAttribute('href'))
          );

          const title = not_null(
            await e.$eval('figcaption > h3 > a', (el) => el.textContent)
          );

          const image_thumbnail = not_null(
            await e.$eval('div.image > a > img', (el) =>
              el.getAttribute('data-original')
            )
          );
          return {
            _id: i,
            title,
            image_thumbnail: image_thumbnail.startsWith('//')
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
    _page.setDefaultNavigationTimeout(0);
    let path = genre.path;
    if (sort !== undefined) {
      path += `?sort=${sort}${
        status !== undefined ? `&status=${status}` : '&status=-1'
      }${page !== undefined ? `&page=${page}` : ''}`;
    } else if (status !== undefined) {
      path += `?status=${status}${page !== undefined ? `&page=${page}` : ''}`;
    } else if (page !== undefined) {
      path += `?page=${page}`;
    }
    await _page.setRequestInterception(true);
    _page.on('request', (req) => {
      if (req.resourceType() !== 'document') req.abort();
      else req.continue();
    });
    await _page.goto(`${this.baseUrl}${path}`);
    const element = await _page.$$(
      '#ctl00_divCenter > div.Module.Module-170 > div > div.items > div > div.item > figure'
    );

    const canNext = await _page
      .$eval(
        '#ctl00_mainContent_ctl01_divPager > ul > li > a.next-page',
        () => true
      )
      .catch(() => false);

    const canPrev = await _page
      .$eval(
        '#ctl00_mainContent_ctl01_divPager > ul > li > a.prev-page',
        () => true
      )
      .catch(() => false);

    const totalPage = parseInt(
      not_null(
        await _page.$eval(
          '#ctl00_mainContent_ctl01_divPager > ul > li:last-child > a',
          (el) => el.getAttribute('href')
        )
      ).split('page=')[1]
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
            await e.$eval('div.image > a', (el) => el.getAttribute('href'))
          );

          const title = not_null(
            await e.$eval('figcaption > h3 > a', (el) => el.textContent)
          );

          const image_thumbnail = not_null(
            await e.$eval('div.image > a > img', (el) =>
              el.getAttribute('data-original')
            )
          );
          return {
            _id: i,
            title,
            image_thumbnail: image_thumbnail.startsWith('//')
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
    url = url !== undefined ? url : '';
    path = path !== undefined ? path : '';

    const _page = await (await this.browser).newPage();
    _page.setDefaultNavigationTimeout(0);
    await _page.setRequestInterception(true);
    _page.on('request', (req) => {
      if (req.resourceType() !== 'document') req.abort();
      else req.continue();
    });
    await _page.goto(url_chapter);
    const content = await _page.$(
      '#ctl00_divCenter > div > div.reading-detail.box_doc'
    );
    const title = not_null(
      await _page.$eval(
        '#ctl00_divCenter > div > div:nth-child(1) > div.top > h1',
        (el) => el.textContent
      )
    );
    const images: image_chapter[] = await Promise.all(
      (
        await content!.$$('div.page-chapter > img')
      ).map(async (e, i) => {
        const _data_image = await e.evaluate((el) => {
          return {
            src_origin: el.getAttribute('data-original'),
            src_cdn: el.getAttribute('data-cdn'),
            alt: el.getAttribute('alt'),
          };
        });
        return {
          _id: i,
          src_origin: not_null(_data_image.src_origin).startsWith('//')
            ? `https:${not_null(_data_image.src_origin)}`
            : not_null(_data_image.src_origin),
          ...(not_null(_data_image.src_cdn) !== ''
            ? {
                src_cdn: not_null(_data_image.src_cdn).startsWith('//')
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
      const prev_chapter_get = await _page.$eval(
        '#chapterNav > a.prev.a_prev',
        (el) => {
          return {
            url_chapter: el.getAttribute('href'),
          };
        }
      );
      prev.url = not_null(prev_chapter_get.url_chapter);
      prev.parent_href = url;
      prev.path = url.substring(`${this.baseUrl}`.length);
    }
    const next: chapter = {} as chapter;
    if (next_chapter === undefined) {
      const next_chapter_get = await _page.$eval(
        '#chapterNav > a.next.a_next',
        (el) => {
          return {
            url_chapter: el.getAttribute('href'),
          };
        }
      );
      next.url = not_null(next_chapter_get.url_chapter);
      next.parent_href = url;
      next.path = url.substring(`${this.baseUrl}`.length);
    }

    return {
      url,
      path,
      chapter_data: images,
      title,
      next_chapter:
        next_chapter !== undefined
          ? next_chapter
          : next.url !== '#'
          ? next
          : null,
      prev_chapter:
        prev_chapter !== undefined
          ? prev_chapter
          : prev.url !== '#'
          ? prev
          : null,
    };
  }

  async getDetailManga(url: string): Promise<responseDetailManga> {
    const _page = await (await this.browser).newPage();
    _page.setDefaultNavigationTimeout(0);
    await _page.setRequestInterception(true);
    _page.on('request', (req) => {
      if (req.resourceType() !== 'document') req.abort();
      else req.continue();
    });
    await _page.goto(url);
    const content = await _page.$('#ctl00_divCenter');
    const title = await content!.$eval('article > h1', (el) => el.textContent);
    const path = url.substring(`${this.baseUrl}`.length);
    const author = await content!.$eval(
      '#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li.author.row > p.col-xs-8',
      (el) => el.textContent
    );

    const status = await content!.$eval(
      '#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li.status.row > p.col-xs-8',
      (el) => el.textContent
    );

    const genres: genre[] = await Promise.all(
      (
        await content!.$$(
          '#item-detail > div.detail-info > div > div.col-xs-8.col-info > ul > li.kind.row > p.col-xs-8 > a'
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

    const views = await content!.$eval(
      '#item-detail > div.detail-info > div.row > div.col-xs-8.col-info > ul > li:last-child > p.col-xs-8',
      (el) => el.textContent
    );

    const chapters: chapter[] = await Promise.all(
      (
        await content!.$$('.list-chapter > nav > ul > li')
      ).map(async (e) => {
        const chapter_anchor = await e.$eval('.col-xs-5.chapter > a', (el) => {
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
          '.col-xs-4.text-center.no-wrap.small',
          (el) => el.textContent
        );
        const views_chapter = await e.$eval(
          '.col-xs-3.text-center.small',
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
          views: not_null(views_chapter),
        };
      })
    );

    const rate = not_null(
      await content!.$eval(
        '#item-detail > div.detail-info > div > div.col-xs-8.col-info > div.mrt5.mrb10 > span > span:nth-child(1)',
        (el) => el.textContent
      )
    );

    const rate_number = not_null(
      await content!.$eval(
        '#item-detail > div.detail-info > div > div.col-xs-8.col-info > div.mrt5.mrb10 > span > span:nth-child(3)',
        (el) => el.textContent
      )
    );
    const follows = not_null(
      await content!.$eval(
        '#item-detail > div.detail-info > div > div.col-xs-8.col-info > div.follow > span > b',
        (el) => el.textContent
      )
    );

    return {
      title: not_null(title),
      path,
      author: not_null(author),
      url,
      status: not_null(status),
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
    _page.setDefaultNavigationTimeout(0);
    await _page.setRequestInterception(true);
    _page.on('request', (req) => {
      if (req.resourceType() !== 'document') req.abort();
      else req.continue();
    });
    await _page.goto(`${this.baseUrl}${page > 1 ? `/?page=${page}` : ``}`);

    const element = await _page.$$(
      '#ctl00_divCenter > div > div > div.items > div.row > div.item'
    );

    const canNext = await _page
      .$eval(
        '#ctl00_mainContent_ctl00_divPager > ul > li > a.next-page',
        () => true
      )
      .catch(() => false);

    const canPrev = await _page
      .$eval(
        '#ctl00_mainContent_ctl00_divPager > ul > li > a.prev-page',
        () => true
      )
      .catch(() => false);

    const totalPage = parseInt(
      not_null(
        await _page.$eval(
          '#ctl00_mainContent_ctl00_divPager > ul > li:last-child > a',
          (el) => el.getAttribute('href')
        )
      ).split('page=')[1]
    );

    return {
      totalData: element.length,
      totalPage,
      currentPage: page,
      canNext,
      canPrev,
      data: await Promise.all(
        element.map(async (e, i) => {
          const image_thumbnail: string = await e.$eval(
            '.image > a > img',
            (el) => el.getAttribute('data-original')!
          );

          const link = await e.$eval('figure > figcaption > h3 > a', (el) => {
            return {
              title: el.textContent,
              href: el.getAttribute('href'),
            };
          });

          return {
            _id: i,
            title: not_null(link.title),
            href: not_null(link.href),
            image_thumbnail: image_thumbnail.startsWith('//')
              ? `https:${image_thumbnail}`
              : image_thumbnail,
          };
        })
      ),
    };
  }
}
