/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CheerioAPI } from 'cheerio';
import { not_null } from '../utils/validate';
import { Page } from 'puppeteer';

interface MangaDataParams {
    cheerioApi?: CheerioAPI;
    puppeteer?: Page;
    wrapSelector: string;
    titleSelector: string;
    thumbnailSelector: string;
    thumbnailAttr: string;
    hrefSelector: string;
}

export const useGetDataItemsManga = async (
    params: MangaDataParams
): Promise<
    {
        _id: number;
        title: string;
        image_thumbnail: string;
        href: string;
    }[]
> => {
    const {
        cheerioApi,
        puppeteer,
        wrapSelector,
        titleSelector,
        thumbnailSelector,
        thumbnailAttr,
        hrefSelector,
    } = params;

    let data = [] as {
        _id: number;
        title: string;
        image_thumbnail: string;
        href: string;
    }[];
    if (cheerioApi !== undefined) {
        const wrapItems = cheerioApi(wrapSelector);
        wrapItems.each((i, e) => {
            data.push({
                _id: i,
                title: cheerioApi(e).find(titleSelector).text(),
                image_thumbnail: not_null(
                    cheerioApi(e).find(thumbnailSelector).attr(thumbnailAttr)
                ),
                href: not_null(cheerioApi(e).find(hrefSelector).attr('href')),
            });
        });
    } else {
        const wrapItems = await puppeteer!.$$(wrapSelector);
        data = await Promise.all(
            wrapItems.map(async (e, i) => {
                const image_thumbnail: string = await e.$eval(
                    thumbnailSelector,
                    (el) => el.getAttribute(`${thumbnailAttr}`)!
                );

                const { href } = await e.$eval(hrefSelector, (el) => {
                    return {
                        href: el.getAttribute('href'),
                    };
                });

                const { title } = await e.$eval(titleSelector, (el) => {
                    return {
                        title: el.textContent,
                    };
                });

                return {
                    _id: i,
                    title: not_null(title),
                    href: not_null(href),
                    image_thumbnail: image_thumbnail.startsWith('//')
                        ? `https:${image_thumbnail}`
                        : image_thumbnail,
                };
            })
        );
    }
    return data;
};
