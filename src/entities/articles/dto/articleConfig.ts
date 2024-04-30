import { Tones } from '@prisma/client';

export interface articleConfig {
    tone: Tones;
    useEmojis: boolean;
    endWithQuestion: boolean;
}
