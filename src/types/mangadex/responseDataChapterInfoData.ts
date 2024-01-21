export type ResponseDataChapterInfoData = {
  result: string;
  response: string;
  data: _Data;
};

type _Data = {
  id: string;
  type: string;
  attributes: _DataAttributes;
  relationships: _Relationship[];
};

type _DataAttributes = {
  volume: string;
  chapter: string;
  title: string;
  translatedLanguage: string;
  externalUrl: null;
  publishAt: string;
  readableAt: string;
  createdAt: string;
  updatedAt: string;
  pages: number;
  version: number;
};

type _Relationship = {
  id: string;
  type: string;
  attributes: _RelationshipAttributes;
};

type _RelationshipAttributes = {
  name?: string;
  altNames?: unknown[];
  locked?: boolean;
  website?: string;
  ircServer?: null;
  ircChannel?: null;
  discord?: string;
  contactEmail?: string;
  description?: _Description[] | null;
  twitter?: string;
  mangaUpdates?: null;
  focusedLanguages?: string[];
  official?: boolean;
  verified?: boolean;
  inactive?: boolean;
  publishDelay?: null;
  exLicensed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  version: number;
  title?: _Title;
  altTitles?: _AltTitle[];
  isLocked?: boolean;
  links?: _Links;
  originalLanguage?: string;
  lastVolume?: string;
  lastChapter?: string;
  publicationDemographic?: string;
  status?: string;
  year?: number;
  contentRating?: string;
  tags?: _Tag[];
  state?: string;
  chapterNumbersResetOnNewVolume?: boolean;
  availableTranslatedLanguages?: string[];
  latestUploadedChapter?: string;
  username?: string;
  roles?: string[];
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
  name: _Title;
  description: _Description;
  group: string;
  version: number;
};

type _Title = {
  en: string;
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

type _Description = {
  en: string;
  run: string;
  uk: string;
  'es-la': string;
  'pr-br': string;
};
