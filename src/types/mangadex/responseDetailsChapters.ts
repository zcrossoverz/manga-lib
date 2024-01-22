export type ResponseDetailsChapters = {
  result: string;
  response: string;
  data: Datum[];
  limit: number;
  offset: number;
  total: number;
};

type Datum = {
  id: string;
  type: string;
  attributes: DatumAttributes;
  relationships: Relationship[];
};

type DatumAttributes = {
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

type Relationship = {
  id: string;
  type: string;
  attributes?: RelationshipAttributes;
};

type RelationshipAttributes = {
  name?: string;
  altNames?: AltName[];
  locked?: boolean;
  website?: string;
  ircServer?: null;
  ircChannel?: null;
  discord?: string;
  contactEmail?: string;
  description?: string;
  twitter?: string;
  mangaUpdates?: string;
  focusedLanguages?: string[];
  official?: boolean;
  verified?: boolean;
  inactive?: boolean;
  exLicensed?: boolean;
  createdAt?: string;
  updatedAt?: string;
  version: number;
  publishDelay?: null;
  username?: string;
  roles?: string[];
};

type AltName = {
  en: string;
};
