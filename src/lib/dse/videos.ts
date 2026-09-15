import chineseVideos from "@/data/videos/chinese.json";
import englishVideos from "@/data/videos/english.json";
import mathVideos from "@/data/videos/math.json";
import m2Videos from "@/data/videos/m2.json";
import econVideos from "@/data/videos/econ.json";
import physicsVideos from "@/data/videos/physics.json";
import chemistryVideos from "@/data/videos/chemistry.json";
import biologyVideos from "@/data/videos/biology.json";

export type StudyVideo = {
  id: string;
  title: string;
  channel: string;
  duration: string;
  topics: string[];
  summary: string;
  keyPoints: string[];
  studyStage: string;
  analysis: string;
};

export type VideoSubjectMeta = {
  subject: string;
  name: string;
  nameEn: string;
  description: string;
  videoCount: number;
  verification: string;
  curatedAt: string;
  curator: string;
};

export type VideoLibrary = {
  meta: VideoSubjectMeta;
  videos: StudyVideo[];
};

const LIBRARIES: Record<string, VideoLibrary> = {
  chinese: chineseVideos as VideoLibrary,
  english: englishVideos as VideoLibrary,
  math: mathVideos as VideoLibrary,
  m2: m2Videos as VideoLibrary,
  econ: econVideos as VideoLibrary,
  physics: physicsVideos as VideoLibrary,
  chemistry: chemistryVideos as VideoLibrary,
  biology: biologyVideos as VideoLibrary,
};

/** Display order on the hub page. */
export const VIDEO_SUBJECTS = [
  "chinese",
  "english",
  "math",
  "m2",
  "econ",
  "physics",
  "chemistry",
  "biology",
] as const;

export type VideoSubjectId = (typeof VIDEO_SUBJECTS)[number];

export function getVideoLibrary(subject: string): VideoLibrary | null {
  return LIBRARIES[subject] ?? null;
}

export function getAllVideoLibraries(): VideoLibrary[] {
  return VIDEO_SUBJECTS.map((s) => LIBRARIES[s]).filter(Boolean);
}

export function getVideoTopics(subject: string): string[] {
  const lib = getVideoLibrary(subject);
  if (!lib) return [];
  return [...new Set(lib.videos.flatMap((v) => v.topics))];
}

export function getVideoCount(): number {
  return getAllVideoLibraries().reduce((n, lib) => n + lib.videos.length, 0);
}

export function getAllTopics(): string[] {
  return [...new Set(getAllVideoLibraries().flatMap((lib) => lib.videos.flatMap((v) => v.topics)))].sort(
    (a, b) => a.localeCompare(b, "zh-Hant"),
  );
}

/** Flat index used by the hub page filter. */
export type IndexedVideo = StudyVideo & {
  subject: string;
  subjectName: string;
};

export function getVideoIndex(): IndexedVideo[] {
  return getAllVideoLibraries().flatMap((lib) =>
    lib.videos.map((v) => ({
      ...v,
      subject: lib.meta.subject,
      subjectName: lib.meta.name,
    })),
  );
}
