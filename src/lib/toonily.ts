/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from "axios";
import {
  NETTRUYEN_STATUS_FILTER,
  NETTRUYEN_SORT_FILTER,
} from "../constants/filter";
import * as cheerio from "cheerio";
import {
  AbstractMangaFactory,
  chapter,
  genre,
  responseChapter,
  responseDetailManga,
  responseListManga,
} from "../types/type";

export class Toonily implements AbstractMangaFactory {
  baseUrl: string;
  all_genres: genre[];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.all_genres = [] as genre[];
  }

  async getListLatestUpdate(
    page?: number | undefined
  ): Promise<responseListManga> {
    const axios_get = await axios.get(
      `${this.baseUrl}${page !== undefined && page > 1 ? `/page/${page}` : ``}`
    );
    const $ = cheerio.load(axios_get.data);
    const wrap_items = $("#loop-content > div > div > div");

    const data: {
      _id: number;
      title: string;
      image_thumbnail: string;
      href: string;
    }[] = [];
    wrap_items.each((i, e) => {
      data.push({
        _id: i,
        title: $(e)
          .find("div.item-summary > div.post-title.font-title > h3 > a")
          .text(),
        image_thumbnail: $(e)
          .find("div.item-thumb.c-image-hover > a > img")
          .attr("data-src")!,
        href: $(e)
          .find("div.item-summary > div.post-title.font-title > h3 > a")
          .attr("href")!,
      });
    });

    const last_page = $("div.wp-pagenavi").find("a.last").attr("href")!;

    console.log(last_page);

    const totalPage = Number(
      last_page !== undefined
        ? last_page
            .substring(0, last_page.length - 1)
            .split("/")
            .at(-1)
        : page !== undefined
        ? page
        : 1
    );

    return {
      data,
      totalData: data.length,
      totalPage,
      currentPage: page !== undefined ? page : 1,
      canNext: page !== undefined ? page < totalPage : true,
      canPrev: page !== undefined ? page > 1 : false,
    };
  }
  async getDetailManga(url: string): Promise<responseDetailManga> {
    const $ = cheerio.load((await axios.get(url)).data);

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
    const genres: genre[] = [] as genre[];
    $("div.genres-content > a").each((_i, e) => {
      genres.push({
        url: $(e).attr("href")!,
        name: $(e).text(),
        path: $(e).attr("href")!.substring(this.baseUrl.length),
      });
    });

    const views = site_content
      .find(
        "div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-content > div:nth-child(5) > div.summary-content"
      )
      .text()
      .split("views")[0]
      .trim()
      .split(" ")
      .at(-1)!;

    const rate = site_content.find("#averagerate").text().trim();
    const rate_number = site_content.find("#countrate").text();
    const follows = site_content
      .find(
        "div.profile-manga.summary-layout-1 > div > div > div > div.tab-summary > div.summary_content_wrap > div > div.post-status > div.manga-action > div.add-bookmark > div.action_detail > span"
      )
      .text()
      .split(" ")[0];

    const chapters: chapter[] = [] as chapter[];
    site_content
      .find("ul.main.version-chap.no-volumn > li.wp-manga-chapter")
      .each((i, e) => {
        chapters.push({
          url: $(e).find("a").attr("href")!,
          path: $(e).find("a").attr("href")!.substring(this.baseUrl.length),
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
  }
  getDataChapter(
    url_chapter: string,
    url?: string | undefined,
    path?: string | undefined,
    prev_chapter?: chapter | undefined,
    next_chapter?: chapter | undefined
  ): Promise<responseChapter> {
    throw new Error("Method not implemented.");
  }
  getListByGenre(
    genre: genre,
    page?: number | undefined,
    status?: NETTRUYEN_STATUS_FILTER | undefined,
    sort?: NETTRUYEN_SORT_FILTER | undefined
  ): Promise<responseListManga> {
    throw new Error("Method not implemented.");
  }
  search(
    keyword: string,
    page?: number | undefined
  ): Promise<responseListManga> {
    throw new Error("Method not implemented.");
  }
}
