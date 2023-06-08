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
  getDetailManga(url: string): Promise<responseDetailManga> {
    throw new Error("Method not implemented.");
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
