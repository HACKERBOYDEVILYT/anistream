# Rr Anime — Web Platform & GitHub Actions Release Deployment

Transform the Anilili repository into **Rr anime**, delivering a web release portal, responsive anime discovery/streaming web experience, direct Android/TV APK distribution center, and a production-ready GitHub Actions workflow (`.github/workflows/deploy.yml`) for automated builds and deployment to GitHub Pages.

### User Review & Critical Decisions

> [!IMPORTANT]
> The clarifying questions were dismissed without choices, so we are proceeding with recommended sensible defaults:
> - **Unified Portal & Web App**: A dual-purpose website featuring both a rich anime catalog/player showcase powered by AniList/Jikan APIs and the official release & APK download hub for mobile and TV.
> - **GitHub Pages Deployment Workflow**: A standard `.github/workflows/deploy.yml` configured to automatically build the Vite/React application on pushes to `main` and publish it directly to GitHub Pages with custom domain support.
> - **Branding Update**: Complete name rebranding across the entire application, metadata, and assets from "Anilili" to "Rr anime" with a sleek Midnight Violet & Electric Glow theme.

- **Confirmed Decision 1**: Brand identity and title updated to **Rr anime**.
- **Confirmed Decision 2**: Automatic deployment workflow file `.github/workflows/deploy.yml` included in repository for GitHub Actions.
- **Recommended Default 3**: Full React web app with live anime streaming and episode browser + download center for APK releases.

---

### 1. Overview & Core Concept

- **What It Does**: Rr anime provides an anime streaming web portal and official distribution site. Users can browse trending, top-rated, and seasonal anime, search titles, watch trailers/episodes with an embedded media player, view AniList/MAL information, read documentation, and download the latest Android and Android TV APK builds.
- **Target Audience / Persona**: Anime fans looking for a fast, ad-free web player experience and Android/TV users downloading the native application.
- **Key Value**: Rebrands the project to "Rr anime", provides a standalone web version that runs in the browser, and supplies an automated CI/CD pipeline so any commit automatically deploys the website to GitHub Pages.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Hero & Overview*: Users land on the cinematic Rr anime hero with featured anime carousel, quick APK download button, and "Watch on Web" action.
  2. *Browse & Search*: Dynamic anime exploration tabs (Trending Now, Top Airing, Popular Seasons, Genre filters) with responsive grid cards.
  3. *Anime Details & Episode Modal*: Clicking any anime opens an episode picker, synopsis, ratings, trailer modal, and streaming player interface.
  4. *Mobile & TV Download Center*: Dedicated release showcase showing features for Phone, Tablet, Android TV, and Fire TV with APK download cards, release changelog, and installation guide.
  5. *CI/CD Workflow & Release Config*: In-app guide and direct copyable GitHub Actions config for quick deployment.
- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Dark cinematic anime streaming design, inspired by Seanime and modern media clients with subtle violet glassmorphism.
  - *Color Palette & Mood*:
    - Background: `#09090b` (Deep obsidian)
    - Card Background: `rgba(18, 18, 24, 0.75)`
    - Accent: `#8b5cf6` (Electric violet) and `#a78bfa` (Soft purple)
    - Border: `rgba(255, 255, 255, 0.08)`
    - Text: `#f4f4f5` (High-contrast white) and `#a1a1aa` (Subtle muted gray)
  - *Typography & Hierarchy*: Plus Jakarta Sans display typography with clean typographic separators for metadata (no clunky pill badges).
- **Interactive Feedback & Motion**:
  - Smooth tab switching and carousel transitions.
  - Interactive video trailer and episode playback modal with fullscreen support.
  - Instant copy-to-clipboard for workflow configuration.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Web App vs Static HTML**:
  - *Chosen Approach*: Modern React 19 + Vite web application that acts as both the web streaming client and the release website, while also providing a standalone static build compatible with GitHub Pages.
  - *Why*: Gives the user an interactive live web app in the preview while preserving 100% compatibility with GitHub Pages static hosting.
  - *Alternatives Considered*: Leaving just static HTML in `docs/` would prevent rich client-side search, AniList integration, and responsive state.
- **Decision 2: GitHub Actions Workflow Configuration**:
  - *Chosen Approach*: Create `.github/workflows/deploy.yml` using `actions/checkout@v4`, `actions/setup-node@v4`, `npm ci`, `npm run build`, and `actions/deploy-pages@v4`.
  - *Why*: Official GitHub-native Pages deployment mechanism that requires zero token setup and deploys upon every git push to the main branch.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌──────────────────────────────────────────────────────────────┐
│                       Rr anime Web Hub                       │
└───────────────┬───────────────────────────────┬──────────────┘
                │                               │
        ┌───────▼────────┐              ┌───────▼────────┐
        │  Web Client    │              │  Release Center│
        │  - Carousel    │              │  - Phone / TV  │
        │  - Search/List │              │  - APK links   │
        │  - Player Modal│              │  - Guide       │
        └───────┬────────┘              └────────────────┘
                │
        ┌───────▼────────┐
        │ Public Anime   │
        │ API (Jikan v4) │
        └────────────────┘

┌──────────────────────────────────────────────────────────────┐
│          GitHub Actions Pipeline (.github/workflows)         │
│  Git Push -> Setup Node -> Build (Vite) -> Deploy to Pages   │
└──────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - Active navigation state: `home`, `browse`, `releases`, `workflow`.
  - Selected anime details: ID, title, Japanese title, score, episodes, synopsis, images, trailer URL.
  - Search query and active filter tags.
  - Active video player state (playing trailer/stream).
- **GitHub Workflow Details**:
  - File path: `/.github/workflows/deploy.yml`
  - Triggers on: `push` to `main` branch (and manual `workflow_dispatch`).
  - Permissions: `contents: read`, `pages: write`, `id-token: write`.
  - Output artifact: `dist` directory.
