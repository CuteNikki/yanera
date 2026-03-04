import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { FilterStatus } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserAvatarUrl = (userId: string, discriminator: string, avatarHash: string | null, size: number = 64) => {
  // If they have a custom avatar, return it immediately
  if (avatarHash) {
    const isAnimated = avatarHash.startsWith('a_');
    const format = isAnimated ? 'gif' : 'webp';
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${format}?size=${size}`;
  }

  // Handle Default Avatars
  if (discriminator === '0' || discriminator === '#0000') {
    // New system: Use User ID
    const index = Number((BigInt(userId) >> BigInt(22)) % BigInt(6));
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  } else {
    // Legacy system: Use Discriminator
    const index = parseInt(discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
  }
};

export const getUserBannerUrl = (userId: string, bannerHash: string, size: number = 64) => {
  const isAnimated = bannerHash.startsWith('a_');
  const format = isAnimated ? 'gif' : 'webp';
  return `https://cdn.discordapp.com/banners/${userId}/${bannerHash}.${format}?size=${size}`;
};

export const getGuildIconUrl = (guildId: string, hash: string, size: number = 64) => {
  const isAnimated = hash.startsWith('a_');
  const format = isAnimated ? 'gif' : 'webp';

  return `https://cdn.discordapp.com/icons/${guildId}/${hash}.${format}?size=${size}`;
};

export function getNodeStatus(lastHeartbeat: number, now: number): Exclude<FilterStatus, FilterStatus.All> {
  const diff = now - lastHeartbeat;
  if (diff > 30_000) return FilterStatus.Offline;
  if (diff > 20_000) return FilterStatus.Unresponsive;
  return FilterStatus.Online;
}

export function formatDuration(ms: number) {
  if (ms < 1_000) return 'just now';
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 && days === 0) parts.push(`${seconds}s`);

  return parts.join(' ') || '0s';
}
