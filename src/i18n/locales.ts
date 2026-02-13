const locales = ['en', 'en-GB', 'bn-IN', 'hi-IN', 'ta-IN', 'de-DE'] as const;

export type Locale = (typeof locales)[number];

export default locales;
