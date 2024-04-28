import * as NewsAPI from 'newsapi';

export class NewsService {
    constructor() {}

    // get top news
    // const response = await getTopHeadlines(apiKey, {
    //     sources: 'bbc-news,the-verge',
    //     q: 'bitcoin',
    //     category: 'business',
    //     language: 'en',
    //     country: 'us',
    // });
    async getTopHeadlines(apiKey: string, options: any) {
        const newsapi = new NewsAPI(apiKey);
        try {
            const response = await newsapi.v2.topHeadlines(options);
            return response;
        } catch (error) {
            console.error('Ошибка при получении главных новостей:', error);
            throw error;
        }
    }

    // get all the news
    // const response = await searchEverything(apiKey, {
    //     q: 'bitcoin',
    //     sources: 'bbc-news,the-verge',
    //     domains: 'bbc.co.uk,techcrunch.com',
    //     from: '2017-12-01',
    //     to: '2017-12-12',
    //     language: 'en',
    //     sortBy: 'relevancy',
    //     page: 2,
    // });
    async searchEverything(apiKey: string, options: any) {
        const newsapi = new NewsAPI(apiKey);
        try {
            const response = await newsapi.v2.everything(options);
            return response;
        } catch (error) {
            console.error('Ошибка при поиске всех новостей:', error);
            throw error;
        }
    }

    // get news sources
    //  const response = await getSources(apiKey, {
    //      category: 'technology',
    //      language: 'en',
    //      country: 'us',
    //  });
    async getSources(apiKey: string, options: any) {
        const newsapi = new NewsAPI(apiKey);
        try {
            const response = await newsapi.v2.sources(options);
            return response;
        } catch (error) {
            console.error('Ошибка при получении источников новостей:', error);
            throw error;
        }
    }
}
