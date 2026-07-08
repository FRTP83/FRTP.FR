export type ProjectHeroSettings = {
  imageUrl: string;
  positionX: number;
  positionY: number;
  zoom: number;
  overlay: number;
};

export type ProjectHeroSettingsMap = Record<string, ProjectHeroSettings>;

export const defaultProjectHeroSettings: ProjectHeroSettings = {
  imageUrl: "",
  positionX: 50,
  positionY: 50,
  zoom: 1,
  overlay: 28
};

export function normalizeProjectHeroSettings(value: Partial<ProjectHeroSettings> | null | undefined): ProjectHeroSettings {
  return {
    imageUrl: typeof value?.imageUrl === "string" ? value.imageUrl : defaultProjectHeroSettings.imageUrl,
    positionX: clampNumber(value?.positionX, 0, 100, defaultProjectHeroSettings.positionX),
    positionY: clampNumber(value?.positionY, 0, 100, defaultProjectHeroSettings.positionY),
    zoom: clampNumber(value?.zoom, 1, 2.2, defaultProjectHeroSettings.zoom),
    overlay: clampNumber(value?.overlay, 0, 75, defaultProjectHeroSettings.overlay)
  };
}

export function normalizeProjectHeroSettingsMap(value: unknown): ProjectHeroSettingsMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value as Record<string, Partial<ProjectHeroSettings>>).reduce<ProjectHeroSettingsMap>((settings, [projectId, item]) => {
    settings[projectId] = normalizeProjectHeroSettings(item);
    return settings;
  }, {});
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, numberValue));
}
