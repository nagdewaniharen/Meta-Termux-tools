# Phase 1: Static Website with Script Management

## Project Overview

Build a static content website with dynamic script injection, preview system, and campaign management. The architecture should support future expansion for content generation and article management.

Reference: https://search.termuxtools.com/

---

## Scope - Phase 1 Only

### In Scope
- Static pages (Homepage, Search, About, Contact, Privacy, Terms)
- Script management system (add/edit/remove scripts via UI)
- Draft/Preview/Live publishing workflow
- Campaign system (page variants with different scripts)
- Version history with rollback
- Basic analytics dashboard
- Authentication (Google OAuth)

### Out of Scope (Future Phases)
- AI content generation
- Article CMS
- Image upload system
- Advanced analytics

---

## Technology Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Framework | Next.js 16 (App Router) | Server components, API routes |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS 4 | Utility-first, fast development |
| Components | shadcn/ui | Production-ready, accessible |
| Database | PostgreSQL | Reliable, scalable |
| ORM | Prisma | Type-safe queries |
| Auth | Supabase | Easy OAuth setup |
| Storage | Cloudflare R2 | CDN delivery for static HTML |
| Deployment | Vercel | Zero-config Next.js hosting |

---

## Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── callback/page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                      # Dashboard home
│   │   │
│   │   ├── pages/
│   │   │   ├── page.tsx                  # List static pages
│   │   │   └── [id]/edit/page.tsx        # Edit page content
│   │   │
│   │   ├── scripts/
│   │   │   ├── page.tsx                  # Script library
│   │   │   └── [id]/edit/page.tsx        # Edit script
│   │   │
│   │   ├── campaigns/
│   │   │   ├── page.tsx                  # List campaigns
│   │   │   ├── new/page.tsx              # Create campaign
│   │   │   └── [id]/edit/page.tsx        # Edit campaign
│   │   │
│   │   └── analytics/page.tsx            # Basic analytics
│   │
│   ├── api/
│   │   ├── pages/
│   │   │   ├── route.ts                  # GET, POST
│   │   │   ├── [id]/route.ts             # GET, PUT, DELETE
│   │   │   ├── [id]/preview/route.ts     # POST generate preview
│   │   │   ├── [id]/publish/route.ts     # POST publish to live
│   │   │   └── [id]/rollback/route.ts    # POST rollback version
│   │   │
│   │   ├── scripts/
│   │   │   ├── route.ts                  # GET, POST
│   │   │   └── [id]/route.ts             # GET, PUT, DELETE
│   │   │
│   │   ├── campaigns/
│   │   │   ├── route.ts                  # GET, POST
│   │   │   ├── [id]/route.ts             # GET, PUT, DELETE
│   │   │   ├── [id]/preview/route.ts     # POST
│   │   │   └── [id]/publish/route.ts     # POST
│   │   │
│   │   ├── tracking/
│   │   │   ├── route.ts                  # POST track event
│   │   │   └── stats/route.ts            # GET stats
│   │   │
│   │   └── auth/
│   │       └── callback/route.ts
│   │
│   ├── layout.tsx
│   ├── globals.css
│   └── not-found.tsx
│
├── components/
│   ├── ui/                               # shadcn components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   ├── dropdown-menu.tsx
│   │   └── toast.tsx
│   │
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── nav-item.tsx
│   │   └── page-container.tsx
│   │
│   ├── pages/
│   │   ├── pages-table.tsx
│   │   ├── page-editor.tsx
│   │   ├── page-scripts-manager.tsx
│   │   └── page-preview-button.tsx
│   │
│   ├── scripts/
│   │   ├── scripts-table.tsx
│   │   ├── script-editor.tsx
│   │   └── script-form.tsx
│   │
│   ├── campaigns/
│   │   ├── campaigns-table.tsx
│   │   ├── campaign-form.tsx
│   │   └── campaign-scripts-manager.tsx
│   │
│   └── shared/
│       ├── loading.tsx
│       ├── empty-state.tsx
│       ├── status-badge.tsx
│       ├── confirm-dialog.tsx
│       └── code-editor.tsx
│
├── lib/
│   ├── db.ts                             # Prisma singleton
│   ├── auth.ts                           # Auth helpers
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── storage.ts                        # R2 client
│   ├── utils.ts                          # cn, formatDate, etc
│   └── validation.ts                     # Zod schemas
│
├── services/
│   ├── page.service.ts
│   ├── script.service.ts
│   ├── campaign.service.ts
│   ├── publish.service.ts
│   └── tracking.service.ts
│
├── renderers/
│   ├── base.renderer.ts
│   ├── homepage.renderer.ts
│   ├── search.renderer.ts
│   ├── about.renderer.ts
│   ├── contact.renderer.ts
│   ├── privacy.renderer.ts
│   ├── terms.renderer.ts
│   └── templates/
│       ├── html-wrapper.ts
│       ├── head.ts
│       ├── header.ts
│       ├── footer.ts
│       └── scripts-injector.ts
│
├── types/
│   ├── page.ts
│   ├── script.ts
│   ├── campaign.ts
│   └── api.ts
│
├── constants/
│   ├── pages.ts                          # Default page configs
│   ├── script-positions.ts
│   └── routes.ts
│
└── middleware.ts

prisma/
├── schema.prisma
└── seed.ts

config/
└── site.ts
```

---

## Database Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      String   @default("editor")
  avatarUrl String?  @map("avatar_url")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model StaticPage {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  title       String
  description String?
  metaTitle   String?  @map("meta_title")
  metaDesc    String?  @map("meta_description")
  content     Json?

  status      String   @default("draft")
  draftHtml   String?  @map("draft_html") @db.Text
  liveHtml    String?  @map("live_html") @db.Text
  previewKey  String   @unique @default(cuid()) @map("preview_key")

  version     Int      @default(1)
  publishedAt DateTime? @map("published_at")
  publishedBy String?   @map("published_by")

  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  scripts     PageScript[]
  versions    PageVersion[]
  campaigns   Campaign[]

  @@map("static_pages")
}

model PageVersion {
  id        String   @id @default(cuid())
  pageId    String   @map("page_id")
  version   Int
  html      String   @db.Text
  scripts   Json?
  note      String?
  createdAt DateTime @default(now()) @map("created_at")
  createdBy String?  @map("created_by")

  page      StaticPage @relation(fields: [pageId], references: [id], onDelete: Cascade)

  @@unique([pageId, version])
  @@map("page_versions")
}

model Script {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  code        String   @db.Text
  type        String   @default("custom")
  position    String   @default("body_end")
  isGlobal    Boolean  @default(false) @map("is_global")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  pageScripts     PageScript[]
  campaignScripts CampaignScript[]

  @@map("scripts")
}

model PageScript {
  id        String   @id @default(cuid())
  pageId    String   @map("page_id")
  scriptId  String   @map("script_id")
  order     Int      @default(0)
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")

  page      StaticPage @relation(fields: [pageId], references: [id], onDelete: Cascade)
  script    Script     @relation(fields: [scriptId], references: [id], onDelete: Cascade)

  @@unique([pageId, scriptId])
  @@map("page_scripts")
}

model Campaign {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  basePageId  String    @map("base_page_id")

  status      String    @default("draft")
  draftHtml   String?   @map("draft_html") @db.Text
  liveHtml    String?   @map("live_html") @db.Text
  previewKey  String    @unique @default(cuid()) @map("preview_key")

  startDate   DateTime? @map("start_date")
  endDate     DateTime? @map("end_date")

  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  basePage    StaticPage       @relation(fields: [basePageId], references: [id])
  scripts     CampaignScript[]

  @@map("campaigns")
}

model CampaignScript {
  id         String   @id @default(cuid())
  campaignId String   @map("campaign_id")
  scriptId   String   @map("script_id")
  order      Int      @default(0)
  isActive   Boolean  @default(true) @map("is_active")
  overrides  Boolean  @default(false)
  createdAt  DateTime @default(now()) @map("created_at")

  campaign   Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  script     Script   @relation(fields: [scriptId], references: [id], onDelete: Cascade)

  @@unique([campaignId, scriptId])
  @@map("campaign_scripts")
}

model TrackingEvent {
  id          String   @id @default(cuid())
  eventType   String   @map("event_type")
  pageSlug    String?  @map("page_slug")
  campaignId  String?  @map("campaign_id")
  ipAddress   String?  @map("ip_address")
  userAgent   String?  @map("user_agent")
  referrer    String?
  countryCode String?  @map("country_code")
  metadata    Json?
  createdAt   DateTime @default(now()) @map("created_at")

  @@index([eventType, createdAt])
  @@index([pageSlug, createdAt])
  @@index([campaignId, createdAt])
  @@map("tracking_events")
}
```

---

## Core Features

### 1. Static Pages

**Default Pages to Create:**
| Name | Slug | Description |
|------|------|-------------|
| Homepage | / | Landing page |
| Search | /search | Search page with AdSense |
| About | /about | About us |
| Contact | /contact | Contact form |
| Privacy | /privacy | Privacy policy |
| Terms | /terms | Terms of service |

**Page Editor Features:**
- Edit page title, meta title, meta description
- Edit page content (JSON structure for flexibility)
- Manage scripts attached to this page
- Preview button (opens preview URL in new tab)
- Publish button (moves draft to live)
- View version history

### 2. Script Manager

**Script Properties:**
```typescript
interface Script {
  id: string;
  name: string;
  slug: string;
  description: string;
  code: string;
  type: 'tracking' | 'ads' | 'analytics' | 'custom';
  position: 'head_start' | 'head_end' | 'body_start' | 'body_end';
  isGlobal: boolean;  // applies to all pages
  isActive: boolean;
}
```

**Script Types:**
- `tracking` - Conversion pixels, event tracking
- `ads` - AdSense, ad network code
- `analytics` - Google Analytics, etc
- `custom` - Any custom JavaScript

**Script Positions:**
- `head_start` - First thing in <head>
- `head_end` - Last thing in <head>
- `body_start` - First thing in <body>
- `body_end` - Last thing in <body> (most common)

**Global Scripts:**
Scripts marked as global are automatically included on ALL pages.

### 3. Publishing Workflow

```
┌─────────────────────────────────────────────────────────┐
│                    PAGE LIFECYCLE                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   DRAFT ──────► PREVIEW ──────► LIVE                    │
│     │              │              │                      │
│     │              │              │                      │
│   Edit          Test URL      Production                │
│   Scripts       No impact     Users see this            │
│   Content       on live       Uploaded to R2            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Draft State:**
- All edits are saved as draft
- draftHtml stores the rendered preview
- No impact on live site

**Preview:**
- URL format: `https://domain.com/search?preview=<preview_key>`
- Shows draftHtml content
- Only accessible with correct preview key
- Test scripts without affecting users

**Publish:**
1. Current liveHtml saved to PageVersion
2. draftHtml copied to liveHtml
3. liveHtml uploaded to Cloudflare R2
4. CDN cache purged
5. version incremented
6. publishedAt updated

**Rollback:**
1. Select version from history
2. Version html copied to draftHtml
3. Preview to verify
4. Publish to make live

### 4. Campaign System

**Purpose:** Create variants of pages with different scripts for testing or traffic segmentation.

**Example Use Cases:**
- Facebook traffic gets FB Pixel
- Taboola traffic gets Taboola pixel
- Test new AdSense config on subset of traffic
- A/B test different tracking setups

**Campaign URL:**
```
Base page:     https://domain.com/search
Campaign:      https://domain.com/search?c=facebook
Campaign preview: https://domain.com/search?c=facebook&preview=<key>
```

**Campaign Scripts:**
- Can ADD scripts (in addition to base page scripts)
- Can OVERRIDE scripts (replace base page scripts)
- Order determines injection sequence

### 5. Rendering System

**How Pages Are Rendered:**

```typescript
// Simplified render flow
async function renderPage(page: StaticPage, campaign?: Campaign) {
  // 1. Get base template
  const template = getTemplateForPage(page.slug);

  // 2. Collect scripts
  const scripts = [];

  // Add global scripts
  scripts.push(...await getGlobalScripts());

  // Add page scripts (if not overridden by campaign)
  if (!campaign?.overridesPageScripts) {
    scripts.push(...await getPageScripts(page.id));
  }

  // Add campaign scripts
  if (campaign) {
    scripts.push(...await getCampaignScripts(campaign.id));
  }

  // 3. Inject scripts into template
  const html = injectScripts(template, scripts);

  return html;
}
```

**Script Injection:**

```typescript
function injectScripts(html: string, scripts: Script[]) {
  const headStart = scripts.filter(s => s.position === 'head_start');
  const headEnd = scripts.filter(s => s.position === 'head_end');
  const bodyStart = scripts.filter(s => s.position === 'body_start');
  const bodyEnd = scripts.filter(s => s.position === 'body_end');

  html = html.replace('<head>', `<head>${renderScripts(headStart)}`);
  html = html.replace('</head>', `${renderScripts(headEnd)}</head>`);
  html = html.replace('<body>', `<body>${renderScripts(bodyStart)}`);
  html = html.replace('</body>', `${renderScripts(bodyEnd)}</body>`);

  return html;
}
```

### 6. Analytics (Basic)

**Track Events:**
- Page views
- Campaign hits
- Traffic sources

**Dashboard Shows:**
- Total page views (today, week, month)
- Views by page
- Views by campaign
- Top referrers

---

## API Specification

### Pages

**GET /api/pages**
```typescript
// Response
{
  data: StaticPage[]
}
```

**GET /api/pages/:id**
```typescript
// Response
{
  data: StaticPage & {
    scripts: (PageScript & { script: Script })[]
    versions: PageVersion[]
  }
}
```

**PUT /api/pages/:id**
```typescript
// Request
{
  title?: string;
  metaTitle?: string;
  metaDesc?: string;
  content?: object;
}

// Response
{ data: StaticPage }
```

**POST /api/pages/:id/preview**
```typescript
// Generates preview HTML and saves to draftHtml
// Response
{
  data: {
    previewUrl: string;
    draftHtml: string;
  }
}
```

**POST /api/pages/:id/publish**
```typescript
// Request
{
  note?: string;  // Version note
}

// Response
{
  data: {
    page: StaticPage;
    version: PageVersion;
    cdnUrl: string;
  }
}
```

**POST /api/pages/:id/rollback**
```typescript
// Request
{
  versionId: string;
}

// Response
{ data: StaticPage }
```

### Scripts

**GET /api/scripts**
```typescript
{ data: Script[] }
```

**POST /api/scripts**
```typescript
// Request
{
  name: string;
  slug: string;
  code: string;
  type: string;
  position: string;
  isGlobal?: boolean;
}

// Response
{ data: Script }
```

**PUT /api/scripts/:id**
```typescript
// Request - partial update
{
  name?: string;
  code?: string;
  type?: string;
  position?: string;
  isGlobal?: boolean;
  isActive?: boolean;
}

// Response
{ data: Script }
```

**DELETE /api/scripts/:id**
```typescript
{ success: true }
```

### Page Scripts (attach/detach scripts from pages)

**POST /api/pages/:id/scripts**
```typescript
// Request
{
  scriptId: string;
  order?: number;
}

// Response
{ data: PageScript }
```

**DELETE /api/pages/:pageId/scripts/:scriptId**
```typescript
{ success: true }
```

**PUT /api/pages/:pageId/scripts/:scriptId**
```typescript
// Request
{
  order?: number;
  isActive?: boolean;
}

// Response
{ data: PageScript }
```

### Campaigns

**GET /api/campaigns**
```typescript
{ data: Campaign[] }
```

**POST /api/campaigns**
```typescript
// Request
{
  name: string;
  slug: string;
  basePageId: string;
  description?: string;
}

// Response
{ data: Campaign }
```

**PUT /api/campaigns/:id**
```typescript
// Request
{
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

// Response
{ data: Campaign }
```

**POST /api/campaigns/:id/scripts**
```typescript
// Request
{
  scriptId: string;
  order?: number;
  overrides?: boolean;
}

// Response
{ data: CampaignScript }
```

**POST /api/campaigns/:id/preview**
```typescript
// Response
{
  data: {
    previewUrl: string;
    draftHtml: string;
  }
}
```

**POST /api/campaigns/:id/publish**
```typescript
// Response
{
  data: {
    campaign: Campaign;
    cdnUrl: string;
  }
}
```

### Tracking

**POST /api/tracking**
```typescript
// Request
{
  eventType: string;
  pageSlug?: string;
  campaignId?: string;
  metadata?: object;
}

// Response
{ success: true }
```

**GET /api/tracking/stats**
```typescript
// Query params: startDate, endDate, groupBy
// Response
{
  data: {
    total: number;
    byPage: { slug: string; count: number }[];
    byCampaign: { id: string; name: string; count: number }[];
    byDate: { date: string; count: number }[];
  }
}
```

---

## UI Pages

### Dashboard Home
- Quick stats (total pages, scripts, campaigns)
- Recent activity
- Quick actions (create campaign, add script)

### Pages List
- Table: Name, Status, Last Published, Actions
- Status badge (draft/live)
- Actions: Edit, Preview, Publish

### Page Editor
- Form: Title, Meta Title, Meta Description
- Scripts section: List attached scripts, add/remove
- Buttons: Save Draft, Preview, Publish
- Version history panel

### Scripts List
- Table: Name, Type, Position, Global, Active, Actions
- Filter by type
- Actions: Edit, Duplicate, Delete

### Script Editor
- Form: Name, Slug, Description
- Code editor with syntax highlighting
- Type selector
- Position selector
- Global toggle
- Active toggle

### Campaigns List
- Table: Name, Base Page, Status, Actions
- Actions: Edit, Preview, Publish, Delete

### Campaign Editor
- Form: Name, Slug, Description, Base Page
- Scripts section: Add scripts, set order
- Override toggle (replace base page scripts)
- Preview and Publish buttons

### Analytics
- Date range picker
- Total views chart
- Views by page table
- Views by campaign table
- Top referrers

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

# Cloudflare R2
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME=""
R2_PUBLIC_URL=""

# App
NEXT_PUBLIC_SITE_URL=""
NEXT_PUBLIC_ADMIN_EMAILS=""
```

---

## Default Data (Seed)

### Default Pages
```typescript
const defaultPages = [
  { name: 'Homepage', slug: 'index', title: 'Welcome' },
  { name: 'Search', slug: 'search', title: 'Search' },
  { name: 'About', slug: 'about', title: 'About Us' },
  { name: 'Contact', slug: 'contact', title: 'Contact Us' },
  { name: 'Privacy', slug: 'privacy', title: 'Privacy Policy' },
  { name: 'Terms', slug: 'terms', title: 'Terms of Service' },
];
```

### Default Scripts
```typescript
const defaultScripts = [
  {
    name: 'Google Analytics',
    slug: 'google-analytics',
    type: 'analytics',
    position: 'head_end',
    isGlobal: true,
    code: `<!-- GA code here -->`
  },
  {
    name: 'AdSense',
    slug: 'adsense',
    type: 'ads',
    position: 'head_end',
    isGlobal: false,
    code: `<!-- AdSense code here -->`
  }
];
```

---

## Code Quality Standards

### Do
- Use TypeScript strict mode
- Define interfaces for all data structures
- Use async/await, never callbacks
- Handle errors at API boundaries
- Use meaningful variable names
- Keep functions small and focused
- Use early returns to reduce nesting

### Do Not
- Use `any` type
- Leave console.log in production code
- Write comments explaining obvious code
- Use abbreviations in names (use `script` not `scr`)
- Mix business logic with data access
- Hardcode values that should be configurable

### Example Service

```typescript
// page.service.ts

import { db } from '@/lib/db';
import { PublishService } from './publish.service';
import type { StaticPage, PageScript } from '@prisma/client';

interface UpdatePageInput {
  title?: string;
  metaTitle?: string;
  metaDesc?: string;
  content?: object;
}

export const PageService = {
  async getAll(): Promise<StaticPage[]> {
    return db.staticPage.findMany({
      orderBy: { name: 'asc' }
    });
  },

  async getById(id: string) {
    return db.staticPage.findUnique({
      where: { id },
      include: {
        scripts: {
          include: { script: true },
          orderBy: { order: 'asc' }
        },
        versions: {
          orderBy: { version: 'desc' },
          take: 10
        }
      }
    });
  },

  async update(id: string, data: UpdatePageInput): Promise<StaticPage> {
    return db.staticPage.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  },

  async generatePreview(id: string): Promise<{ previewUrl: string; html: string }> {
    const page = await this.getById(id);
    if (!page) throw new Error('Page not found');

    const html = await PublishService.renderPage(page);

    await db.staticPage.update({
      where: { id },
      data: { draftHtml: html }
    });

    const previewUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${page.slug}?preview=${page.previewKey}`;

    return { previewUrl, html };
  },

  async publish(id: string, userId: string, note?: string) {
    const page = await this.getById(id);
    if (!page) throw new Error('Page not found');
    if (!page.draftHtml) throw new Error('No draft to publish');

    return db.$transaction(async (tx) => {
      // Save current live as version
      if (page.liveHtml) {
        await tx.pageVersion.create({
          data: {
            pageId: id,
            version: page.version,
            html: page.liveHtml,
            scripts: page.scripts,
            note,
            createdBy: userId
          }
        });
      }

      // Update page
      const updated = await tx.staticPage.update({
        where: { id },
        data: {
          liveHtml: page.draftHtml,
          status: 'live',
          version: page.version + 1,
          publishedAt: new Date(),
          publishedBy: userId
        }
      });

      // Upload to R2
      await PublishService.uploadToR2(page.slug, page.draftHtml);

      return updated;
    });
  },

  async rollback(id: string, versionId: string) {
    const version = await db.pageVersion.findUnique({
      where: { id: versionId }
    });

    if (!version || version.pageId !== id) {
      throw new Error('Version not found');
    }

    return db.staticPage.update({
      where: { id },
      data: { draftHtml: version.html }
    });
  }
};
```

### Example API Route

```typescript
// app/api/pages/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PageService } from '@/services/page.service';
import { requireAuth } from '@/lib/auth';
import { updatePageSchema } from '@/lib/validation';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();

    const page = await PageService.getById(params.id);

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: page });
  } catch (error) {
    console.error('GET /api/pages/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await requireAuth();

    const body = await request.json();
    const validated = updatePageSchema.parse(body);

    const page = await PageService.update(params.id, validated);

    return NextResponse.json({ data: page });
  } catch (error) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('PUT /api/pages/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Implementation Checklist

### Week 1: Foundation
- [ ] Initialize Next.js project with TypeScript
- [ ] Setup Tailwind CSS
- [ ] Install and configure shadcn/ui
- [ ] Setup Prisma with schema
- [ ] Configure Supabase auth
- [ ] Create database and run migrations
- [ ] Build layout components (sidebar, header)
- [ ] Setup middleware for auth

### Week 2: Pages System
- [ ] Build pages list UI
- [ ] Build page editor UI
- [ ] Create pages API routes
- [ ] Implement PageService
- [ ] Build page renderers for each page type
- [ ] Implement preview system
- [ ] Test preview URLs

### Week 3: Scripts System
- [ ] Build scripts list UI
- [ ] Build script editor with code highlighting
- [ ] Create scripts API routes
- [ ] Implement ScriptService
- [ ] Build page-scripts manager UI
- [ ] Implement script injection in renderers

### Week 4: Publishing & Campaigns
- [ ] Implement R2 upload service
- [ ] Build publish workflow
- [ ] Implement version history
- [ ] Build rollback functionality
- [ ] Create campaigns UI
- [ ] Implement campaign system
- [ ] Campaign preview and publish

### Week 5: Polish
- [ ] Basic analytics dashboard
- [ ] Error handling improvements
- [ ] Loading states
- [ ] Empty states
- [ ] Responsive design fixes
- [ ] Testing
- [ ] Documentation

---

## Notes for Developer

1. Start with database schema - get it right first
2. Build services before UI - test with API client
3. Use server components where possible
4. Client components only for interactivity
5. Keep renderers simple and testable
6. Preview system is key - test thoroughly
7. Version history prevents data loss - implement early
8. Scripts injection must handle edge cases (malformed HTML)

---

## Future Expansion Points

This architecture supports adding:
- Article CMS (add Article model, article.service, article.renderer)
- AI generation (add ai.service, connect to article creation)
- Image uploads (add Cloudflare Images integration)
- Advanced analytics (expand tracking schema)
- Multi-user (expand User model with permissions)
- Multi-site (add Site model, scope all queries)
