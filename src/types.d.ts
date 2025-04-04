export type Chapter = {
  title: string;
  url: string;
  articles: Article[];
}

export type Article = {
  title: string;
  url: string;
  sections: Section[];
}

export type Section = {
  title: string;
  content: string;
  url: string;
  pages: string[];
}