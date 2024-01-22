export type ResponseDetailsGenres = {
  result: string;
  response: string;
  data: _DataData;
};

type _DataData = {
  id: string;
  type: string;
  attributes: _Attributes;
  relationships: _Relationship[];
};

type _Attributes = {
  title: _Title;
  altTitles: _AltTitle[];
  description: _Description;
  isLocked: boolean;
  links: _Links;
  originalLanguage: string;
  lastVolume: string;
  lastChapter: string;
  publicationDemographic: string;
  status: string;
  year: number;
  contentRating: string;
  tags: _Tag[];
  state: string;
  chapterNumbersResetOnNewVolume: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
  availableTranslatedLanguages: string[];
  latestUploadedChapter: string;
};

type _Description = {
  en: string;
  run: string;
  uk: string;
  'es-la': string;
  'pr-br': string;
};

type _Links = {
  al: string;
  ap: string;
  bw: string;
  kt: string;
  mu: string;
  amz: string;
  cdj: string;
  ebj: string;
  mal: number;
  raw: string;
  engtl: string;
};

type _Title = {
  en: string;
};

type _Relationship = {
  id: string;
  type: string;
  attributes?: _RelationshipAttributes;
  related?: string;
};

type _AltTitle = {
  ko?: string;
  my?: string;
  th?: string;
  bn?: string;
  ne?: string;
  zh?: string;
  'zh-hk'?: string;
  mn?: string;
  ar?: string;
  fa?: string;
  he?: string;
  vi?: string;
  ru?: string;
  ms?: string;
  uk?: string;
  ta?: string;
  hi?: string;
  kk?: string;
  ja?: string;
};

type _Tag = {
  id: string;
  type: string;
  attributes: TagAttributes;
  relationships: unknown[];
};

type TagAttributes = {
  name: _Title;
  description: string;
  group: string;
  version: number;
};

type _RelationshipAttributes = {
  name: string;
  imageUrl?: null;
  biography?: _Title[];
  twitter?: null;
  pixiv?: null;
  melonBook?: null;
  fanBox?: null;
  booth?: null;
  nicoVideo?: null;
  skeb?: null;
  fantia?: null;
  tumblr?: null;
  youtube?: null;
  weibo?: null;
  naver?: null;
  website?: null;
  createdAt: string;
  updatedAt: string;
  version: number;
};
