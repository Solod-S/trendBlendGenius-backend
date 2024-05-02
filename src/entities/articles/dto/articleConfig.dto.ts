import { Tones } from '@prisma/client';

export interface articleConfigDto {
    tone: Tones;
    useEmojis: boolean;
    endWithQuestion: boolean;
}
