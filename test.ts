import { Nettruyen } from "./src/lib/nettruyen";
// eslint-disable-next-line @typescript-eslint/no-floating-promises

const net = new Nettruyen("https://www.nettruyenplus.com");

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () =>
  console.log(
    await net.getDataChapter(
      "https://www.nettruyenplus.com/truyen-tranh/vo-dich-don-ngo/chap-41/998245",
      "https://www.nettruyenplus.com/truyen-tranh/vo-dich-don-ngo-79874",
      "sdf"
    )
  ))();
