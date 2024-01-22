export type ResponseChapterData = {
  result: string;
  baseUrl: string;
  chapter: _Chapter;
};

type _Chapter = {
  hash: string;
  data: string[];
  dataSaver: string[];
};
