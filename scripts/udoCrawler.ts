import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';
import { join } from 'path';

const BASE_URL = 'https://udo.raleighnc.gov';

type Chapter = {
    title: string;
    url: string;
    articles: Article[];
}

type Article = {
    title: string;
    url: string;
    sections: Section[];
}

type Section = {
    title: string;
    content: string;
    url: string;
}

const axiosInstance = axios.create({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }
});

const delay = () => new Promise(resolve => setTimeout(resolve, 50));

const crawlUDO = async () => {
    try {
        const response = await axiosInstance.get(BASE_URL);
        await delay(); // Delay of 1 second
        const $ = load(response.data);

        // Example logic to extract chapters, articles, and sections
        const chapters: Chapter[] = [];

        // Select chapters using the class 'item-list'
        const chapterElements = $('.item-list li a');
        for (const chapterElem of chapterElements) {
            const chapterUrl = $(chapterElem).attr('href')?.replace('/', '');
            const chapter = {
                title: $(chapterElem).text(),
                url: chapterUrl || '',
                articles: [] as Article[]
            };

            // Fetch the chapter page
            const chapterResponse = await axiosInstance.get(join(BASE_URL, chapterUrl || ''));
            await delay(); // Delay of 1 second
            const chapterPage = load(chapterResponse.data);

            // Select articles using the class 'book-navigation__menu'
            const articleElements = chapterPage('.book-navigation .book-navigation__menu li a');
            for (const articleElem of articleElements) {
                const articleUrl = $(articleElem).attr('href')?.replace('/', '');
                const article = {
                    title: $(articleElem).text(),
                    url: articleUrl || '',
                    sections: [] as Section[]
                };

                // Fetch the article page
                const articleResponse = await axiosInstance.get(join(BASE_URL, articleUrl || ''));
                await delay(); // Delay of 1 second
                const articlePage = load(articleResponse.data);

                // Select sections using the class 'book-navigation__menu'
                const sectionElements = articlePage('.book-navigation .book-navigation__menu li a');
                for (const sectionElem of sectionElements) {
                    const sectionUrl = $(sectionElem).attr('href')?.replace('/', '');
                    const section = {
                        title: $(sectionElem).text(),
                        content: '',
                        url: sectionUrl || ''
                    };

                    // Add logging before each section call
                    console.log(`Processing section: ${section.title} (${sectionUrl})`);

                    const sectionResponse = await axiosInstance.get(join(BASE_URL, sectionUrl || ''));
                    await delay(); // Delay of 1 second
                    const sectionPage = load(sectionResponse.data);

                    section.content = sectionPage('.text-content').html() || '';

                    article.sections.push(section);
                }

                chapter.articles.push(article);
            }

            chapters.push(chapter);
        }

        const udoData = { chapters };

        fs.writeFileSync('public/udoData.json', JSON.stringify(udoData, null, 2));
        console.log('UDO data has been saved.');
    } catch (error) {
        console.error('Error crawling UDO:', error);
    }
};

crawlUDO(); 