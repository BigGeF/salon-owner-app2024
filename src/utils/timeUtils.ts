// src/utils/timeUtils.ts

export const formatDuration = (duration: number): string => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours > 0 ? `${hours}h` : ''}${minutes > 0 ? ` ${minutes}m` : ''}`;
};