/* eslint-disable @typescript-eslint/no-empty-function */
import { MangaType } from "../constants/manga";
import { Nettruyen } from "../lib/nettruyen";
import { AbstractMangaFactory, constructorParams } from "../types/type";

export class Manga {
  constructor() {}

  build(type: MangaType, params?: constructorParams): AbstractMangaFactory {
    switch (type) {
      case MangaType.NETTRUYEN: {
        return new Nettruyen(
          params !== undefined && params.baseUrl !== undefined
            ? params.baseUrl
            : "https://www.nettruyenplus.com"
        );
      }
      default: {
        return new Nettruyen("https://www.nettruyenplus.com");
      }
    }
  }
}
