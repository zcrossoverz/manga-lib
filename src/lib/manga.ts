/* eslint-disable @typescript-eslint/no-empty-function */
import { MangaType } from "../constants/manga";
import { Nettruyen } from "../lib/nettruyen";
import { AbstractMangaFactory, constructorParams } from "../types/type";
import { Toonily } from "./toonily";

export class Manga {
  constructor() {}

  build(type: MangaType, params?: constructorParams): AbstractMangaFactory {
    switch (type) {
      case MangaType.NETTRUYEN: {
        return new Nettruyen(
          params !== undefined && params.baseUrl !== undefined
            ? params.baseUrl
            : "https://www.nettruyenmax.com"
        );
      }

      case MangaType.TOONILY: {
        return new Toonily(
          params !== undefined && params.baseUrl !== undefined
            ? params.baseUrl
            : "https://toonily.com"
        );
      }

      default: {
        return new Nettruyen("https://www.nettruyenmax.com");
      }
    }
  }
}
