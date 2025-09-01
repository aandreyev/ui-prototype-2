#!/bin/bash
set -euo pipefail

# Usage: scripts/new-prototype.sh <name> <prd-filename>
# Example: scripts/new-prototype.sh draft-invoices PRD.md

if [ $# -lt 2 ]; then
  echo "Usage: $0 <name> <prd-filename>"
  exit 1
fi

NAME="$1"
PRD="$2"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROTO_DIR="$ROOT_DIR/prototypes/$NAME"
STORYBOOK_VER="${STORYBOOK_VER:-^9.1.3}"

if [ -d "$PROTO_DIR" ]; then
  echo "Error: $PROTO_DIR already exists"
  exit 1
fi

mkdir -p "$PROTO_DIR/src/components" "$PROTO_DIR/src/adapters" "$PROTO_DIR/src/assets" "$PROTO_DIR/mocks" "$PROTO_DIR/.storybook" "$PROTO_DIR/tests"

# Copy templates
cp "$ROOT_DIR/documents/templates/CONTROL Template.md" "$PROTO_DIR/CONTROL.md"
cp "$ROOT_DIR/documents/templates/Prototype Process Checklist.md" "$PROTO_DIR/PROCESS-CHECKLIST.md"
cp "$ROOT_DIR/documents/templates/Prototype README Template.md" "$PROTO_DIR/README.md"
cp "$ROOT_DIR/documents/templates/Accessibility Checklist.md" "$PROTO_DIR/ACCESSIBILITY-CHECKLIST.md"

# Create minimal scaffold files
cat > "$PROTO_DIR/package.json" <<'JSON'
{
  "name": "prototype-REPLACE_NAME",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "storybook dev -p 6006",
    "build": "storybook build",
    "serve": "vite --port 5173",
    "test": "vitest"
  },
  "dependencies": {
    "vue": "^3.4.38"
  },
  "devDependencies": {
    "storybook": "SBVER_PLACEHOLDER",
    "@storybook/addon-essentials": "SBVER_PLACEHOLDER",
    "@storybook/addon-interactions": "SBVER_PLACEHOLDER",
    "@storybook/addon-links": "SBVER_PLACEHOLDER",
    "@storybook/vue3-vite": "SBVER_PLACEHOLDER",
    "@vitejs/plugin-vue": "^5.1.2",
    "autoprefixer": "^10.4.17",
    "msw": "^2.3.1",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.4.5",
    "vite": "^5.4.10",
    "vitest": "^2.1.3"
  }
}
JSON

sed -i '' "s/prototype-REPLACE_NAME/prototype-$NAME/" "$PROTO_DIR/package.json" || true
sed -i '' "s/SBVER_PLACEHOLDER/$STORYBOOK_VER/g" "$PROTO_DIR/package.json" || true

cat > "$PROTO_DIR/tsconfig.json" <<'JSON'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@shared/*": ["../../shared/*"]
    },
    "types": ["vite/client"],
    "lib": ["ES2022", "DOM"],
    "skipLibCheck": true
  },
  "include": ["src", ".storybook", "mocks", "vite.config.ts"],
  "exclude": ["node_modules"]
}
JSON

cat > "$PROTO_DIR/vite.config.ts" <<'TS'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../../shared', import.meta.url)),
    }
  },
})
TS

cat > "$PROTO_DIR/postcss.config.js" <<'JS'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
JS

cat > "$PROTO_DIR/tailwind.config.js" <<'JS'
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{vue,ts}'],
  theme: { extend: {} },
  plugins: [],
}
JS

cat > "$PROTO_DIR/.storybook/main.ts" <<'TS'
import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
}

export default config
TS

cat > "$PROTO_DIR/.storybook/preview.ts" <<'TS'
import type { Preview } from '@storybook/vue3'
import '../src/assets/main.css'
import '../../../shared/styles/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
TS

cat > "$PROTO_DIR/src/assets/main.css" <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;
CSS

# Touch PRD reference in CONTROL.md
sed -i '' "s/<PRD_FILENAME>/$PRD/" "$PROTO_DIR/CONTROL.md" || true

echo "Prototype scaffolded at $PROTO_DIR"
echo "Next: cd prototypes/$NAME && yarn install && yarn dev"


