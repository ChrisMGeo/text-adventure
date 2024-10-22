import { LandscapeImageInfo } from "./image-info";

export type SceneData = {
  id: string;
  name?: string;
  description?: string;
  images?: {
    default: LandscapeImageInfo;
    moods?: { [key: string]: LandscapeImageInfo };
  }
};
