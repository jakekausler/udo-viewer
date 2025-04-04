export type Chapter = {
  title: string;
  articles: Article[];
}

export type Article = {
  title: string;
  sections: Section[];
}

export type Section = {
  title: string;
  content: string;
  url: string;
}