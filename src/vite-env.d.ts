/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WP_API_URL: string;
  readonly VITE_WP_JWT_ENDPOINT: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
