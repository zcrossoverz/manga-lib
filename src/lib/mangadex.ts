import axios from 'axios';
import {
  AbstractMangaFactory,
  chapter,
  genre,
  image_chapter,
  responseChapter,
  responseDetailManga,
  responseListManga,
} from '../types/type';
export class Mangadex implements AbstractMangaFactory {
  baseUrl: string;
  all_genres: genre[];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.all_genres = [] as genre[];
  }
  async getListByGenre(
    genre: genre,
    page?: number | undefined,
    status?: any,
    sort?: any
  ): Promise<responseListManga> {
    throw new Error('Method not implemented.');
  }

  async getListLatestUpdate(
    page?: number | undefined
  ): Promise<responseListManga> {
    let totalData = 0;
    let data: {
      _id: number;
      image_thumbnail: string;
      title: string;
      href: string;
    }[] = [];
    let offset = 0;
    if (page != undefined)
      if (page >= 0 && page <= 9983) offset = page;
      else throw new Error('Offset is out of bound');
    await axios
      .get(
        `https://api.mangadex.org/manga?limit=16&offset=${offset}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`
      )
      .then(function (response) {
        const listLatestUpdate = response.data.data;
        totalData = response.data.total;
        data = listLatestUpdate.map((e: any, i: any) => {
          return {
            _id: offset + i,
            title: e.attributes.title.en,
            href: `/${e.id}`,
            image_thumbnail: 'not implemented',
          };
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    return {
      totalData,
      canNext: true,
      canPrev: false,
      totalPage: 2,
      currentPage: 2,
      data,
    };
  }
  async getDetailManga(url: string): Promise<responseDetailManga> {
    const sourceId = url;
    let author = 'null';
    let title = 'null';
    let status = 'null';
    const genres: genre[] = [] as genre[];
    //Get info Manga like (title, author, tag)
    await axios
      .get(
        `https://api.mangadex.org/manga/${sourceId}?includes[]=artist&includes[]=author&includes[]=cover_art`
      )
      .then(function (response) {
        const infoData = response.data.data;
        author = infoData.relationships[0].attributes.name;
        title = infoData.attributes.title.en;
        status = infoData.attributes.status;
        infoData.attributes.tags.map((e: any) => {
          genres.push({
            url: `https://mangadex.org/tag/` + e.id,
            name: e.attributes.name.en,
            path: '/tag/' + e.id,
          });
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    //Get info Manga Chapter
    const chapters: chapter[] = [] as chapter[];
    await axios
      .get(
        `https://api.mangadex.org/manga/${sourceId}/feed?translatedLanguage[]=en&includes[]=scanlation_group&&includes[]=user&order[volume]=desc&order[chapter]=desc&offset=0&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`
      )
      .then(function (response) {
        const chapterData = response.data.data;
        chapterData.map((e: any) => {
          chapters.push({
            path: '/' + e.id,
            url: `https://mangadex.org/chapter/${e.id}`,
            parent_href: '/chapter/' + e.id,
            title: e.attributes.title,
          });
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    return {
      path: this.baseUrl + `/title/${sourceId}`,
      url,
      author,
      genres,
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
    const sourceId = url_chapter;
    const chapter_data: image_chapter[] = [] as image_chapter[];
    let title = 'null';
    // get info data
    await axios
      .get(
        `https://api.mangadex.org/chapter/${sourceId}?includes[]=scanlation_group&includes[]=manga&includes[]=user`
      )
      .then(function (response) {
        const infoData = response.data.data;
        let mangaId = 0;
        for (let i = 0; i < infoData.relationships.length; i++)
          if (infoData.relationships[i].type == 'manga') {
            mangaId = i;
            break;
          }
        title = `${infoData.relationships[mangaId].attributes.title.en} chap ${infoData.attributes.chapter} [${infoData.attributes.title}]`;
      })
      .catch(function (error) {
        console.log(error);
      });
    //get img data
    await axios
      .get(
        `https://api.mangadex.org/at-home/server/${sourceId}?forcePort443=false`
      )
      .then(function (response) {
        const hash = response.data.chapter.hash;
        response.data.chapter.data.map((e: any, i: number) => {
          chapter_data.push({
            _id: i,
            src_origin: `https://uploads.mangadex.org/data/${hash}/${response.data.chapter.data[i]}`,
            alt: title + ' id: ' + i,
          });
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    return {
      url: `${this.baseUrl}/chapter/${sourceId}`,
      path: `/chapter/${sourceId}`,
      title,
      chapter_data,
      prev_chapter: null,
      next_chapter: null,
    };
  }

  async search(
    keyword: string,
    page?: number | undefined
  ): Promise<responseListManga> {
    let totalData = 0;
    let data: {
      _id: number;
      image_thumbnail: string;
      title: string;
      href: string;
    }[] = [];
    let offset = 0;
    if (page != undefined)
      if (page >= 0 && page <= 9983) offset = page;
      else throw new Error('Offset is out of bound');
    await axios
      .get(
        `https://api.mangadex.org/manga?limit=10&offset=${offset}&includes[]=cover_art&includes[]=artist&includes[]=author&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&title=${keyword}&order[relevance]=desc`
      )
      .then(function (response) {
        totalData = response.data.total;
        const listLatestUpdate = response.data.data;
        totalData = response.data.total;
        data = listLatestUpdate.map((e: any, i: any) => {
          return {
            _id: i,
            title: e.attributes.title.en,
            href: e.id,
            image_thumbnail: 'not implemented',
          };
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    return {
      totalData,
      canNext: true,
      canPrev: false,
      totalPage: 2,
      currentPage: 2,
      data,
    };
  }
}
