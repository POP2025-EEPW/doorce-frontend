export const ROUTES = {
  HOME: "/",
  // add future routes here, e.g. SETTINGS: "/settings"
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
