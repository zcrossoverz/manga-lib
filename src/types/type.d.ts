import { Browser } from "puppeteer";
import {
  NETTRUYEN_SORT_FILTER,
  NETTRUYEN_STATUS_FILTER,
} from "../constants/filter";

export type responseListManga = {
  totalData: number;
  canNext: boolean;
  canPrev: boolean;
  totalPage: number;
  currentPage: number;
  data: {
    _id: number;
    image_thumbnail: string;
    title: string;
    href: string;
  }[];
};

type genre = {
  url?: string;
  name: string;
  path: string;
};

type chapter = {
  path: string;
  url: string;
  parent_href: string;
  title?: string;
  last_update?: string;
  views?: string;
};

export type responseDetailManga = {
  path: string;
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
  src_cdn?: string;
  alt: string;
};

export type responseChapter = {
  url: string;
  path: string;
  title: string;
  chapter_data: image_chapter[];
  prev_chapter: chapter | null;
  next_chapter: chapter | null;
};

export interface AbstractMangaFactory {
  baseUrl: string;
  browser: Promise<Browser>;

  getListLatestUpdate(page: number): Promise<responseListManga>;

  getDetailManga(url: string): Promise<responseDetailManga>;

  getDataChapter(
    url_chapter: string,
    url: string,
    path: string,
    prev_chapter?: chapter,
    next_chapter?: chapter
  ): Promise<responseChapter>;

  getListByGenre(
    genre: genre,
    page = 1,
    status = NETTRUYEN_STATUS_FILTER.ALL,
    sort = NETTRUYEN_SORT_FILTER.NONE
  ): Promise<responseListManga>;

  // search(keyword: string): Promise<responseListManga>;
}
