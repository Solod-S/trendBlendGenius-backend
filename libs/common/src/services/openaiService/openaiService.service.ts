import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
    // private openai: any;

    async generateContent(apiKey: string, constent: string) {
        try {
            const openai = new OpenAI({ apiKey });

            // const messages = [
            //     {
            //         role: 'system',
            //         content:
            //             'You are an assistant in generating description/title/keywords for Google, and creating short limited to 10 words posts with <h1> and <p> on social networks.',
            //     },
            //     {
            //         role: 'system',
            //         content: `Consider that Description - is a short description of up to 50 words for Google SEO, Title - is a title for google SEO, Keywords -are keywords for google SEO, Social network post - html markup for a social network up to 10 words with using emoji and without hashtags!`,
            //     },
            //     {
            //         role: 'assistant',
            //         content: `Analyze the incoming markup and return me description, title, keywords and social network post without hashtags`,
            //     },
            //     {
            //         role: 'assistant',
            //         content: `This is an example of what I expect - "Description: Motorola introduces a new flexible smartphone with an adaptive display that can be worn on the wrist or stand on its own. The innovative design allows for customizable accessorizing, adding a fashionable twist to traditional smartphones. This showcases Motorola's commitment to pushing the boundaries of smartphone technology.\n\nTitle: Motorola Adaptive Display: A Fashionable Twist on Smartphones\n\nKeywords: motorola, adaptive display, flexible smartphone, wearable tech, customizable, fashionable twist, smartphone technology, versatile devices\n\nSocial network post: <div><h1>📱 Motorola's new Adaptive Display is here to revolutionize the smartphone industry! 🌟</h1></div>"`,
            //     },
            //     {
            //         role: 'user',
            //         content: constent,
            //     },
            // ];

            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are an assistant in generating description/title/keywords for Google, and creating short limited to 10 words posts with <h1> and <p> on social networks.',
                    },
                    {
                        role: 'system',
                        content: `Consider that Description - is a short description of up to 50 words for Google SEO, Title - is a title for google SEO, Keywords -are keywords for google SEO, Social network post - html markup for a social network up to 10 words with using emoji and without hashtags!`,
                    },
                    {
                        role: 'assistant',
                        content: `Analyze the incoming markup and return me description, title, keywords and social network post without hashtags`,
                    },
                    {
                        role: 'assistant',
                        content: `This is an example of what I expect - "Description: Motorola introduces a new flexible smartphone with an adaptive display that can be worn on the wrist or stand on its own. The innovative design allows for customizable accessorizing, adding a fashionable twist to traditional smartphones. This showcases Motorola's commitment to pushing the boundaries of smartphone technology.\n\nTitle: Motorola Adaptive Display: A Fashionable Twist on Smartphones\n\nKeywords: motorola, adaptive display, flexible smartphone, wearable tech, customizable, fashionable twist, smartphone technology, versatile devices\n\nSocial network post: <div><h1>📱 Motorola's new Adaptive Display is here to revolutionize the smartphone industry! 🌟</h1></div>"`,
                    },
                    {
                        role: 'user',
                        content: constent,
                    },
                ],
                temperature: 0.4,
                n: 1,
            });
            return response?.choices[0]?.message?.content;
        } catch (error) {
            console.error('Error generating content with OpenAI:', error);
            throw error;
        }
    }
}
