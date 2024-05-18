import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { articleConfigDto } from 'src/entities/articles/dto';
import { articleTone, characterLimit, endWithQuestion, useEmojis } from '@common/constants';

@Injectable()
export class OpenAIService {
    private async createRules(config: articleConfigDto, domain: string) {
        let rules = 'As a commentator on that post you must follow these rules:';
        // tone, useEmojis, endWithQuestion

        switch (config?.tone) {
            case articleTone.EXCITED:
                rules += '\n\n- please rewrite it in a very excited way.';
                break;
            case articleTone.HAPPY:
                rules += '\n\n- please rewrite it in a very happy way.';
                break;
            case articleTone.GRACIOUS:
                rules += '\n\n- please rewrite it in a very gracious way.';
                break;
            case articleTone.SUPPORTIVE:
                rules += '\n\n- please rewrite it in a very supportive way.';
                break;
            case articleTone.POLITE:
                rules += '\n\n- please rewrite it in a very polite way.';
                break;
            case articleTone.RESPECTFULLY_OPPOSED:
                rules += '\n\n- please rewrite it in a very respectfully opposed way.';
                break;
            case articleTone.PROVOCATIVE:
                rules += '\n\n- please rewrite it in a very provocative way.';
                break;
            case articleTone.CONTROVERSIAL:
                rules += '\n\n- please rewrite it in a very controversial way.';
                break;
            case articleTone.DISAPPOINTED:
                rules += '\n\n- please rewrite it in a very disappointed way.';
                break;
            case articleTone.FRUSTRATED:
                rules += '\n\n- please rewrite it in a very frustrated way.';
                break;
            case articleTone.SARCASTIC:
                rules += '\n\n- please rewrite it in a very sarcastic way.';
                break;
            case articleTone.SAD:
                rules += '\n\n- please rewrite it in a very sad way.';
                break;
            case articleTone.ANGRY:
                rules += '\n\n- please rewrite it in a very angry way.';
                break;
            case articleTone.NASTY:
                rules += '\n\n- please rewrite it in a very lousy way.';
                break;

            default:
                break;
        }

        switch (config?.useEmojis) {
            case useEmojis.USE_EMOJIS:
                rules += `\n\n- result must use and contains emojis.`;
                break;
            case useEmojis.DONT_USE_EMOJIS:
                rules += "\n\n- result shouldn't contain any emojis.";
                break;

            default:
                break;
        }

        switch (config?.endWithQuestion) {
            case endWithQuestion.USE_END_WITH_QUESTION:
                rules += '\n\n- result must end with question.';
                break;
            case endWithQuestion.DONT_END_WITH_QUESTION:
                rules += "\n\n- result shouldn't end with question.";
                break;

            default:
                break;
        }

        rules += `\n\n- result should be use ${characterLimit[domain][1]} completion_tokens or less. Target response length ${characterLimit[domain][2]} words or less.`;
        rules += `\n\n- result must take into account all the above rules, and not contain your personal comments like “I understand the task. Here is the response:”`;
        return rules;
    }
    async generateContent(apiKey: string, content: string) {
        try {
            const openai = new OpenAI({ apiKey });

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
                        content: content,
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

    async rewriteArticle(apiKey: string, content: string, config: articleConfigDto, domain: string, title: string) {
        try {
            const openai = new OpenAI({ apiKey });

            const promt = `\n\nHere is the "content": \n\n"${content}" \n\n`;
            const rules = await this.createRules(config, domain);
            let systemMessage = `You are an assistant, whorewrite the scrapped "content" from the site to tailor it specifically to the given topic "${title}". Result shouldn't contain main title: "${title}".`;
            systemMessage += `As an assistant must follow such rules:" \n\n${rules}`;
            console.log(`systemMessage`, systemMessage);
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: systemMessage,
                    },
                    {
                        role: 'assistant',
                        content: promt,
                    },
                ],
                temperature: 0.4,
                n: 1,
            });
            return response?.choices[0]?.message?.content;
        } catch (error) {
            console.error('Error generating article with OpenAI:', error);
            throw error;
        }
    }
}
