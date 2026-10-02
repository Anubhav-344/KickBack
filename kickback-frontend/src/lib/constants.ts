// src/lib/constants.ts

// Preset avatar gallery — users pick from this fixed set rather than
// uploading their own image (avoids storage/moderation entirely, per the
// original product decision). Using DiceBear's free, no-auth "bottts" style
// since it fits a gaming app's aesthetic better than generic human avatars.
// Each id maps to a fixed seed so the generated image never changes.
export interface AvatarPreset {
    id: number;
    url: string;
  }
  
  export const AVATAR_PRESETS: AvatarPreset[] = [
    { id: 1, url: "https://api.dicebear.com/7.x/bottts/svg?seed=Respawn1" },
    { id: 2, url: "https://api.dicebear.com/7.x/bottts/svg?seed=Respawn2" },
    { id: 3, url: "https://api.dicebear.com/7.x/bottts/svg?seed=Respawn3" },
    { id: 4, url: "https://api.dicebear.com/7.x/bottts/svg?seed=Respawn4" },
    { id: 5, url: "https://api.dicebear.com/7.x/bottts/svg?seed=Respawn5" },
    { id: 6, url: "https://api.dicebear.com/7.x/bottts/svg?seed=Respawn6" },
    { id: 7, url: "https://api.dicebear.com/7.x/bottts/svg?seed=Respawn7" },
    { id: 8, url: "https://api.dicebear.com/7.x/bottts/svg?seed=Respawn8" },
  ];
  
  export function getAvatarUrl(avatarId: number | undefined): string | undefined {
    return AVATAR_PRESETS.find((a) => a.id === avatarId)?.url;
  }
  