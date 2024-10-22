import { PortraitImageInfo } from "./image-info";

export type CharacterData = {
  id: string;
  name: string;
  description: string;
  images?: {
    default: PortraitImageInfo;
    moods?: { [key: string]: PortraitImageInfo };
  }
};
