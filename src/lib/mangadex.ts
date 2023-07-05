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
    throw new Error('Method not implemented');
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
        for (let i = 0; i < response.data.data.attributes.tags.length; i++)
          genres.push({
            url: `https://mangadex.org/tag/` + infoData.attributes.tags[i].id,
            name: infoData.attributes.tags[i].attributes.name.en,
            path: '/tag/' + infoData.attributes.tags[i].id,
          });
      })
      .catch(function (error) {
        console.log(error);
      });
    //Get info Manga Chapter
    let chapters: chapter[] = [] as chapter[];
    await axios
      .get(
        `https://api.mangadex.org/manga/${sourceId}/feed?translatedLanguage[]=en&includes[]=scanlation_group&&includes[]=user&order[volume]=desc&order[chapter]=desc&offset=0&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`
      )
      .then(function (response) {
        const chapterData = response.data.data;
        for (let i = 0; i < chapterData.length; i++)
          chapters.push({
            path: '/' + chapterData[i].id,
            url: `https://mangadex.org/chapter/${chapterData[i].id}`,
            parent_href: '/chapter/' + chapterData[i].id,
            title: chapterData[i].attributes.title,
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
        for (let i = 0; i < response.data.chapter.data.length; i++) {
          chapter_data.push({
            _id: i,
            src_origin: `https://uploads.mangadex.org/data/${hash}/${response.data.chapter.data[i]}`,
            alt: title + ' id: ' + i,
          });
        }
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
    throw new Error('Method not implemented');
  }
}
