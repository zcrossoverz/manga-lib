/* eslint-disable @typescript-eslint/await-thenable */
// import {
//   NETTRUYEN_SORT_FILTER,
//   NETTRUYEN_STATUS_FILTER,
// } from "./src/constants/filter";
// import { list_genres } from "./src/constants/genres";
import { Nettruyen } from "./src/lib/nettruyen";
// eslint-disable-next-line @typescript-eslint/no-floating-promises

const net = new Nettruyen("https://www.nettruyenplus.com");

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => console.log(await net.getListLatestUpdate(2)))();

// import axios from "axios";
// void (async () => {
//   const t = await axios.get(
//     "https://p.ntcdntempv26.com/content/image.jpg?data=5jBDdVOxu2FRISK/OQNcgxMd/h1Syxot/MHEZPwXuUUcbDXvb/ygi6xHZLn1b8LU6XCib6/Yfi5USudMn3KQ6k+/g/WwrEVBAqYlLTxgCpih6yPHPG7bCRv7evxxhP7O",
//     {
//       headers: {
//         // authority: "p.ntcdntempv26.com",
//         // accept:
//         //   "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
//         // "accept-language":
//         //   "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5",
//         // "cache-control": "no-cache",
//         // pragma: "no-cache",
//         referer: "https://www.nettruyenplus.com/",
//         "sec-ch-ua":
//           '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
//         "sec-ch-ua-mobile": "?0",
//         "sec-ch-ua-platform": '"Windows"',
//         "sec-fetch-dest": "image",
//         "sec-fetch-mode": "no-cors",
//         "sec-fetch-site": "cross-site",
//         "user-agent":
//           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
//       },
//     }
//   );
//   console.log(t.data);
// })();

// copy(
//   Array.from(
//     document.querySelectorAll(
//       "#mainNav > div > div > div > div > ul > li.dropdown.active > ul > li > div li"
//     )
//   ).map((e) => {
//     return {
//       name: e.innerText.replaceAll("\n", "").trim(),
//       slug: e.childNodes[1].getAttribute("href"),
//     };
//   })
// );
