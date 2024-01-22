export type ResponseSearchMangaDex = {
  status: number;
  statusText: string;
  data: _Data;
};

type _Data = {
  result: string;
  response: string;
  data: _Datum[];
  limit: number;
  offset: number;
  total: number;
};

type _Datum = {
  id: string;
  type: string;
  attributes: _DatumAttributes;
  relationships: Array<_Relationship[]>;
};

type _DatumAttributes = {
  name?: string;
  title: _Title;
  altTitles: _AltTitle[];
  description: _DescriptionElement[];
  isLocked: boolean;
  links: _Link[];
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
  createdAt: Date;
  updatedAt: Date;
  version: number;
  availableTranslatedLanguages: string[];
  latestUploadedChapter: string;
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

type _DescriptionElement = {
  en?: string;
  ru?: string;
  uk?: string;
  'es-la'?: string;
  'pt-br'?: string;
};

type _Link = {
  al: string;
  ap: string;
  bw: string;
  kt: string;
  mu: string;
  amz: string;
  cdj: string;
  ebj: string;
  mal: string;
  raw: string;
  engtl: string;
};

type _Tag = {
  id: string;
  type: string;
  attributes: _TagAttributes;
  relationships: unknown[];
};

type _TagAttributes = {
  name: _Title[];
  description: string;
  group: string;
  version: number;
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

type _RelationshipAttributes = {
  name?: string;
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
  description?: string;
  volume?: string;
  fileName?: string;
  locale?: string;
};
