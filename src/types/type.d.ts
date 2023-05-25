import { Browser } from "puppeteer";

export type responseListManga = {
  _id: number;
  image_thumbnail: string;
  title: string;
  href: string;
};

type genre = {
  slug: string;
  url: string;
  name: string;
};

type chapter = {
  slug: string;
  url: string;
  title: string;
  parent_href: string;
  last_update: string;
  views: string;
};

export type responseDetailManga = {
  slug: string;
  url: string;
  author: string;
  title: string;
  status: string;
  genres: genre[];
  views: string;
  rate: string;
  rate_number: string;
  follows: string;
  chapters: chapter[];
};

export type image_chapter = {
  _id: number;
  src_origin: string;
  src_cdn: string;
  alt: string;
};

export type responseChapter = {
  url: string;
  slug: string;
  chapter_data: image_chapter[];
};

export interface AbstractMangaFactory {
  baseUrl: string;
  browser: Promise<Browser>;

  getListLatestUpdate(page: number): Promise<responseListManga[]>;

  getDetailManga(url: string): Promise<responseDetailManga>;

  getDataChapter(
    url_chapter: string,
    url: string,
    slug: string
  ): Promise<responseChapter>;
}
