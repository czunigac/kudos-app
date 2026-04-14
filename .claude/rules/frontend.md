---
paths:
  - "frontend/src/app/**/*.tsx"
  - "frontend/src/app/**/*.ts"
  - "frontend/src/components/**/*.tsx"
  - "frontend/src/components/**/*.ts"
  - "frontend/src/hooks/**/*.ts"
  - "frontend/src/store/**/*.ts"
  - "frontend/src/lib/**/*.ts"
---

# Frontend rules — loads only when touching Next.js code

## Component model

- Server Components by default — only add `'use client'` when the component needs:
  - Browser APIs (`window`, `localStorage`, `document`)
  - React hooks (`useState`, `useEffect`, `useRef`)
  - Event handlers (`onClick`, `onChange`)
  - Supabase browser client
- Never add `'use client'` to layout files or page files that don't need it
- Keep `'use client'` components small — push interactivity to leaf nodes

## Data fetching

- Server Components fetch data directly (no React Query needed) — use `createClient()` from `@/lib/supabase/server`
- Client Components use React Query — never `useState + useEffect` for server data
- `queryKey` arrays must be consistent: `['kudos', 'feed']`, `['categories']`, `['auth', 'me']`
- Invalidate by exact key after mutations: `queryClient.invalidateQueries({ queryKey: ['kudos', 'feed'] })`
- Always set `staleTime` on queries — default is `0` which causes refetch on every focus

## Forms

- All forms use React Hook Form with `zodResolver`
- Zod schemas defined in `src/lib/schemas/` — never inline in component files
- Field-level error display: `{errors.field && <p className="text-xs text-destructive">{errors.field.message}</p>}`
- Submit button shows loading state: `disabled={isSubmitting}` and text changes to "Loading..."
- On API error: display via `useToast()` from shadcn with `variant: 'destructive'`

## Styling

- Tailwind utility classes only — no inline `style={{}}`, no CSS modules, no styled-components
- shadcn/ui components for all UI primitives — Button, Input, Card, Badge, Avatar, Dialog, Toast
- Custom colors via the `kudos-*` tokens defined in `tailwind.config.ts`
- Conditional classes via `cn()` from `@/lib/utils` — never string concatenation
- Dark theme is the default — never hardcode light-mode-only colors like `text-gray-900`

## Auth pattern

- `useAuth()` hook for all auth operations — never call Supabase directly from components
- `useAuthStore()` for reading the current user profile — `const { profile } = useAuthStore()`
- Never read from `localStorage` directly — the Zustand store handles persistence
- Protected pages: handled by `src/middleware.ts` — no need to check auth in page components

## API calls

- Always use `api` from `@/lib/api` — never raw `fetch` except for SSE streaming
- SSE streaming (Kudos Coach): use raw `fetch` with `ReadableStream` — Axios does not support streaming
- Handle 401 in the Axios interceptor — do not handle it per-component
- Show loading skeletons while data is fetching — never show empty UI or blank areas

## File naming

- Components: `PascalCase.tsx` — `KudosCard.tsx`, `UserAvatar.tsx`
- Hooks: `camelCase.ts` starting with `use` — `useKudos.ts`, `useAuth.ts`
- Utilities: `camelCase.ts` — `api.ts`, `utils.ts`
- Pages: `page.tsx` (Next.js convention)
- Layouts: `layout.tsx` (Next.js convention)

## Performance

- `import dynamic from 'next/dynamic'` for heavy components not needed on first render
- `next/image` for all images — never raw `<img>` tags
- `next/link` for all internal navigation — never `<a href>` for internal routes
- Framer Motion animations only on elements visible in the viewport — use `whileInView`
