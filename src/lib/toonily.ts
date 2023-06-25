/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from "axios";
import * as cheerio from "cheerio";
import {
  AbstractMangaFactory,
  chapter,
  genre,
  image_chapter,
  responseChapter,
  responseDetailManga,
  responseListManga,
} from "../types/type";
import { useGetDataItemsManga } from "../hooks/getListLatest";

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

    const paramsSelector = {
      cheerioApi: $,
      wrapSelector: "#loop-content > div > div > div",
      titleSelector: "div.item-summary > div.post-title.font-title > h3 > a",
      thumbnailSelector: "div.item-thumb.c-image-hover > a > img",
      thumbnailAttr: "data-src",
      hrefSelector: "div.item-summary > div.post-title.font-title > h3 > a",
    };

    const data = await useGetDataItemsManga(paramsSelector);

    const last_page = $("div.wp-pagenavi").find("a.last").attr("href")!;

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
      canNext: page !== undefined ? page < totalPage : 1 < totalPage,
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
  async getDataChapter(
    url_chapter: string,
    url?: string | undefined,
    path?: string | undefined,
    prev_chapter?: chapter | undefined,
    next_chapter?: chapter | undefined
  ): Promise<responseChapter> {
    const $ = cheerio.load((await axios.get(url_chapter)).data);

    const site_content = $("div.main-col-inner");
    const title = site_content
      .find("ol.breadcrumb > li:nth-child(3)")
      .text()
      .trim();

    const chapter_data: image_chapter[] = [] as image_chapter[];
    site_content
      .find("div.entry-content div.reading-content > div.page-break > img")
      .each((i, e) => {
        chapter_data.push({
          _id: i,
          src_origin: $(e).attr("data-src")!.trim(),
          alt: $(e).attr("alt")!,
        });
      });

    const parent_href = site_content
      .find("ol.breadcrumb > li:nth-child(3) > a")
      .attr("href")!;

    const next_chapter_data: chapter | null = site_content.find(
      "div.nav-links > div.nav-next > a"
    ).length
      ? {
          url: site_content
            .find("div.nav-links > div.nav-next > a")
            .attr("href")!,
          path: site_content
            .find("div.nav-links > div.nav-next > a")
            .attr("href")!
            .substring(this.baseUrl.length),
          parent_href: parent_href,
          title,
        }
      : null;

    const prev_chapter_data: chapter | null = site_content.find(
      "div.nav-links > div.nav-previous > a"
    ).length
      ? {
          url: site_content
            .find("div.nav-links > div.nav-previous > a")
            .attr("href")!,
          path: site_content
            .find("div.nav-links > div.nav-previous > a")
            .attr("href")!
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
  }

  async search(
    keyword: string,
    page?: number | undefined
  ): Promise<responseListManga> {
    keyword = keyword.replace(/\s/g, "-");
    const axios_get = await axios.get(
      `${this.baseUrl}/search/${keyword}${
        page !== undefined && page > 1 ? `/page/${page}` : ``
      }`
    );
    const $ = cheerio.load(axios_get.data);
    const wrap_items = $(
      "div.page-listing-item > div.row.row-eq-height > div > div"
    );

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
      canNext: page !== undefined ? page < totalPage : 1 < totalPage,
      canPrev: page !== undefined ? page > 1 : false,
    };
  }
}
