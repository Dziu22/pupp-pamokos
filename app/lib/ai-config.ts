export const AI_MODELS = {
  cheap: "gpt-4o-mini",
  strong: "gpt-4o",
} as const;

export const AI_CONFIG = {
  model: AI_MODELS.cheap,
  temperature: 0.4,
  maxTokens: 1600,
} as const;
