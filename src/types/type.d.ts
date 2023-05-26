import { Browser } from "puppeteer";

export type responseListManga = {
  _id: number;
  image_thumbnail: string;
  title: string;
  href: string;
};

type genre = {
  url?: string;
  name: string;
  slug?: string;
};

type chapter = {
  slug: string;
  url: string;
  parent_href: string;
  title?: string;
  last_update?: string;
  views?: string;
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
  title: string;
  chapter_data: image_chapter[];
  prev_chapter: chapter | null;
  next_chapter: chapter | null;
};

export interface AbstractMangaFactory {
  baseUrl: string;
  browser: Promise<Browser>;

  getListLatestUpdate(page: number): Promise<responseListManga[]>;

  getDetailManga(url: string): Promise<responseDetailManga>;

  getDataChapter(
    url_chapter: string,
    url: string,
    slug: string,
    prev_chapter?: chapter,
    next_chapter?: chapter
  ): Promise<responseChapter>;
}
