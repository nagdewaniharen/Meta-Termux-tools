# Project Specification: AdSyntheX Content Platform

## Overview

A content management and search arbitrage platform with dynamic script injection, preview workflows, and campaign management. Built for performance, maintainability, and scalability.

Reference: https://search.termuxtools.com/

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| UI Library | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Components | shadcn/ui + Radix UI | Latest |
| Database | PostgreSQL | 15+ |
| ORM | Prisma | 6.x |
| Authentication | Supabase Auth | Latest |
| Storage | Cloudflare R2 | - |
| Images | Cloudflare Images | - |
| AI | OpenAI API | GPT-4o |
| Deployment | Vercel | - |
| Package Manager | pnpm | 8.x |

---

## Architecture Principles

1. **Separation of Concerns** - Clear boundaries between data, business logic, and presentation
2. **Single Responsibility** - Each module handles one specific task
3. **Dependency Injection** - Services injected rather than instantiated directly
4. **Repository Pattern** - Database access abstracted through repositories
5. **Clean Code** - Self-documenting code, minimal comments, meaningful names
6. **Type Safety** - Strict TypeScript, no `any` types, proper interfaces
7. **Error Handling** - Centralized error handling with proper HTTP status codes
8. **Security First** - Input validation, sanitization, CORS, rate limiting

---

## Folder Structure

```
src/
├── app/                              # Next.js App Router
│   ├── (public)/                     # Public pages group
│   │   ├── page.tsx                  # Homepage
│   │   ├── search/page.tsx           # Search page
│   │   ├── about/page.tsx            # About page
│   │   ├── contact/page.tsx          # Contact page
│   │   ├── privacy/page.tsx          # Privacy policy
│   │   ├── terms/page.tsx            # Terms of service
│   │   └── [slug]/page.tsx           # Dynamic article pages
│   │
│   ├── (auth)/                       # Authentication pages group
│   │   ├── layout.tsx                # Auth layout (centered, minimal)
│   │   ├── login/page.tsx            # Login page
│   │   └── signup/page.tsx           # Signup page
│   │
│   ├── (dashboard)/                  # Protected dashboard group
│   │   ├── layout.tsx                # Dashboard layout with sidebar
│   │   ├── page.tsx                  # Dashboard home
│   │   │
│   │   ├── articles/                 # Article management
│   │   │   ├── page.tsx              # List articles
│   │   │   ├── new/page.tsx          # Create article
│   │   │   └── [id]/
│   │   │       └── edit/page.tsx     # Edit article
│   │   │
│   │   ├── pages/                    # Static pages management
│   │   │   ├── page.tsx              # List static pages
│   │   │   ├── [id]/
│   │   │   │   └── edit/page.tsx     # Edit static page
│   │   │   └── scripts/
│   │   │       └── page.tsx          # Script manager
│   │   │
│   │   ├── campaigns/                # Campaign management
│   │   │   ├── page.tsx              # List campaigns
│   │   │   ├── new/page.tsx          # Create campaign
│   │   │   └── [id]/
│   │   │       └── edit/page.tsx     # Edit campaign
│   │   │
│   │   ├── analytics/                # Analytics dashboard
│   │   │   └── page.tsx              # Traffic analytics
│   │   │
│   │   └── settings/                 # Settings
│   │       └── page.tsx              # User/site settings
│   │
│   ├── api/                          # API routes
│   │   ├── auth/
│   │   │   └── [...supabase]/route.ts
│   │   │
│   │   ├── articles/
│   │   │   ├── route.ts              # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET, PUT, DELETE
│   │   │
│   │   ├── pages/
│   │   │   ├── route.ts              # GET (list), POST (create)
│   │   │   ├── [id]/
│   │   │   │   └── route.ts          # GET, PUT, DELETE
│   │   │   ├── publish/
│   │   │   │   └── route.ts          # POST (publish to live)
│   │   │   └── preview/
│   │   │       └── route.ts          # POST (generate preview)
│   │   │
│   │   ├── scripts/
│   │   │   ├── route.ts              # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET, PUT, DELETE
│   │   │
│   │   ├── campaigns/
│   │   │   ├── route.ts              # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET, PUT, DELETE
│   │   │
│   │   ├── ai/
│   │   │   ├── generate/route.ts     # POST (generate content)
│   │   │   └── suggest/route.ts      # POST (suggest titles)
│   │   │
│   │   ├── upload/
│   │   │   └── route.ts              # POST (upload image)
│   │   │
│   │   └── tracking/
│   │       ├── route.ts              # POST (track event)
│   │       └── stats/route.ts        # GET (analytics)
│   │
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global styles
│   └── not-found.tsx                 # 404 page
│
├── components/
│   ├── ui/                           # Base UI components (shadcn)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── layout/                       # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   ├── nav-item.tsx
│   │   └── page-header.tsx
│   │
│   ├── forms/                        # Form components
│   │   ├── article-form.tsx
│   │   ├── page-form.tsx
│   │   ├── script-form.tsx
│   │   ├── campaign-form.tsx
│   │   └── login-form.tsx
│   │
│   ├── editors/                      # Editor components
│   │   ├── rich-text-editor.tsx
│   │   ├── code-editor.tsx
│   │   └── script-editor.tsx
│   │
│   ├── tables/                       # Table components
│   │   ├── articles-table.tsx
│   │   ├── pages-table.tsx
│   │   ├── scripts-table.tsx
│   │   └── campaigns-table.tsx
│   │
│   ├── cards/                        # Card components
│   │   ├── stats-card.tsx
│   │   ├── article-card.tsx
│   │   └── campaign-card.tsx
│   │
│   └── shared/                       # Shared components
│       ├── loading-spinner.tsx
│       ├── error-boundary.tsx
│       ├── empty-state.tsx
│       ├── confirm-dialog.tsx
│       └── status-badge.tsx
│
├── lib/                              # Core libraries
│   ├── db.ts                         # Prisma client singleton
│   ├── auth.ts                       # Auth utilities
│   ├── storage.ts                    # Cloudflare R2 client
│   ├── images.ts                     # Cloudflare Images client
│   ├── ai.ts                         # OpenAI client
│   ├── validation.ts                 # Zod schemas
│   └── utils.ts                      # General utilities
│
├── services/                         # Business logic layer
│   ├── article.service.ts
│   ├── page.service.ts
│   ├── script.service.ts
│   ├── campaign.service.ts
│   ├── publish.service.ts
│   ├── auth.service.ts
│   ├── storage.service.ts
│   └── analytics.service.ts
│
├── repositories/                     # Data access layer
│   ├── article.repository.ts
│   ├── page.repository.ts
│   ├── script.repository.ts
│   ├── campaign.repository.ts
│   ├── author.repository.ts
│   └── tracking.repository.ts
│
├── renderers/                        # HTML renderers
│   ├── base.renderer.ts              # Base renderer class
│   ├── page.renderer.ts              # Static page renderer
│   ├── article.renderer.ts           # Article page renderer
│   ├── search.renderer.ts            # Search page renderer
│   └── templates/
│       ├── head.template.ts
│       ├── header.template.ts
│       ├── footer.template.ts
│       └── scripts.template.ts
│
├── types/                            # TypeScript types
│   ├── article.types.ts
│   ├── page.types.ts
│   ├── script.types.ts
│   ├── campaign.types.ts
│   ├── auth.types.ts
│   └── api.types.ts
│
├── constants/                        # Constants
│   ├── routes.ts
│   ├── config.ts
│   └── defaults.ts
│
├── hooks/                            # Custom React hooks
│   ├── use-auth.ts
│   ├── use-articles.ts
│   ├── use-pages.ts
│   ├── use-scripts.ts
│   └── use-campaigns.ts
│
└── middleware.ts                     # Next.js middleware

prisma/
├── schema.prisma                     # Database schema
├── migrations/                       # Migration files
└── seed.ts                           # Seed data

config/
├── site.ts                           # Site configuration
└── navigation.ts                     # Navigation config

public/
├── favicon.ico
└── robots.txt
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

// Authors/Users
model Author {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String
  role      String    @default("editor")
  avatarUrl String?   @map("avatar_url")
  bio       String?
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  articles  Article[]

  @@map("authors")
}

// Categories
model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  description String?
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  articles    Article[]

  @@map("categories")
}

// Articles
model Article {
  id              String    @id @default(cuid())
  title           String
  slug            String    @unique
  excerpt         String?
  contentMarkdown String?   @map("content_markdown")
  sections        Json?
  imageId         String?   @map("image_id")
  authorId        String    @map("author_id")
  categoryId      String?   @map("category_id")
  status          String    @default("draft")
  publishedAt     DateTime? @map("published_at")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")

  author          Author    @relation(fields: [authorId], references: [id])
  category        Category? @relation(fields: [categoryId], references: [id])

  @@map("articles")
}

// Static Pages
model StaticPage {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  title       String
  description String?
  content     Json?
  status      String    @default("draft")
  draftHtml   String?   @map("draft_html")
  liveHtml    String?   @map("live_html")
  previewKey  String    @unique @default(cuid()) @map("preview_key")
  version     Int       @default(1)
  publishedAt DateTime? @map("published_at")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  pageScripts PageScript[]
  campaigns   Campaign[]
  versions    PageVersion[]

  @@map("static_pages")
}

// Page Versions (History)
model PageVersion {
  id        String   @id @default(cuid())
  pageId    String   @map("page_id")
  version   Int
  html      String
  scripts   Json?
  createdAt DateTime @default(now()) @map("created_at")
  createdBy String?  @map("created_by")

  page      StaticPage @relation(fields: [pageId], references: [id], onDelete: Cascade)

  @@unique([pageId, version])
  @@map("page_versions")
}

// Scripts Library
model Script {
  id          String    @id @default(cuid())
  name        String
  description String?
  code        String
  type        String    @default("tracking")
  position    String    @default("body_end")
  isGlobal    Boolean   @default(false) @map("is_global")
  isActive    Boolean   @default(true) @map("is_active")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  pageScripts     PageScript[]
  campaignScripts CampaignScript[]

  @@map("scripts")
}

// Page-Script Association
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

// Campaigns
model Campaign {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  basePageId  String    @map("base_page_id")
  status      String    @default("draft")
  startDate   DateTime? @map("start_date")
  endDate     DateTime? @map("end_date")
  draftHtml   String?   @map("draft_html")
  liveHtml    String?   @map("live_html")
  previewKey  String    @unique @default(cuid()) @map("preview_key")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  basePage    StaticPage       @relation(fields: [basePageId], references: [id])
  scripts     CampaignScript[]

  @@map("campaigns")
}

// Campaign-Script Association
model CampaignScript {
  id         String   @id @default(cuid())
  campaignId String   @map("campaign_id")
  scriptId   String   @map("script_id")
  order      Int      @default(0)
  isActive   Boolean  @default(true) @map("is_active")
  createdAt  DateTime @default(now()) @map("created_at")

  campaign   Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  script     Script   @relation(fields: [scriptId], references: [id], onDelete: Cascade)

  @@unique([campaignId, scriptId])
  @@map("campaign_scripts")
}

// Traffic Tracking
model TrackingEvent {
  id          String   @id @default(cuid())
  eventType   String   @map("event_type")
  pageType    String?  @map("page_type")
  campaignId  String?  @map("campaign_id")
  ipAddress   String?  @map("ip_address")
  userAgent   String?  @map("user_agent")
  referrer    String?
  countryCode String?  @map("country_code")
  metadata    Json?
  isBlocked   Boolean  @default(false) @map("is_blocked")
  createdAt   DateTime @default(now()) @map("created_at")

  @@index([eventType, createdAt])
  @@index([campaignId, createdAt])
  @@map("tracking_events")
}
```

---

## Core Features

### 1. Static Pages Management

**Page States:**
- `draft` - Work in progress, not visible
- `preview` - Ready for testing via preview URL
- `live` - Published and visible to public

**Workflow:**
```
Create/Edit Page
      │
      ▼
Save as Draft ──► Edit Scripts ──► Generate Preview
      │                                    │
      │                                    ▼
      │                           Test via Preview URL
      │                                    │
      │                                    ▼
      └──────────────────────────► Publish to Live
                                          │
                                          ▼
                                   Version Created
```

**Preview URL Format:**
```
https://domain.com/search?preview=<preview_key>
```

### 2. Script Manager

**Script Types:**
- `tracking` - Analytics, conversion tracking
- `ads` - AdSense, ad network scripts
- `utility` - Helper scripts, polyfills
- `custom` - Custom functionality

**Script Positions:**
- `head_start` - Beginning of <head>
- `head_end` - End of <head>
- `body_start` - Beginning of <body>
- `body_end` - End of <body>

**Script Properties:**
```typescript
interface Script {
  id: string;
  name: string;
  description: string;
  code: string;
  type: 'tracking' | 'ads' | 'utility' | 'custom';
  position: 'head_start' | 'head_end' | 'body_start' | 'body_end';
  isGlobal: boolean;
  isActive: boolean;
}
```

### 3. Campaign System

**Purpose:** Create page variants with different scripts for A/B testing or traffic sources.

**Example:**
```
Base: Search Page
  │
  ├── Campaign: "facebook-traffic"
  │   └── Scripts: FB Pixel, Custom Tracking
  │
  ├── Campaign: "taboola-test"
  │   └── Scripts: Taboola Pixel, Alternate AdSense
  │
  └── Campaign: "organic"
      └── Scripts: Standard Tracking
```

**Campaign URL Format:**
```
https://domain.com/search?c=facebook-traffic
https://domain.com/search?c=taboola-test&preview=<key>
```

### 4. Version History

- Automatic versioning on publish
- View previous versions
- One-click rollback
- Compare versions

### 5. Article Management

- Structured editor with sections
- AI-powered content generation
- Auto-slug generation
- Featured images via Cloudflare
- Category organization
- Draft/Published states

### 6. Analytics Dashboard

- Traffic overview
- Bot detection stats
- Campaign performance
- Geographic breakdown
- Export functionality

---

## API Endpoints

### Pages API

```
GET    /api/pages                    List all pages
POST   /api/pages                    Create page
GET    /api/pages/:id                Get page details
PUT    /api/pages/:id                Update page
DELETE /api/pages/:id                Delete page
POST   /api/pages/:id/preview        Generate preview
POST   /api/pages/:id/publish        Publish to live
POST   /api/pages/:id/rollback       Rollback to version
GET    /api/pages/:id/versions       Get version history
```

### Scripts API

```
GET    /api/scripts                  List all scripts
POST   /api/scripts                  Create script
GET    /api/scripts/:id              Get script details
PUT    /api/scripts/:id              Update script
DELETE /api/scripts/:id              Delete script
POST   /api/scripts/:id/duplicate    Duplicate script
```

### Campaigns API

```
GET    /api/campaigns                List all campaigns
POST   /api/campaigns                Create campaign
GET    /api/campaigns/:id            Get campaign details
PUT    /api/campaigns/:id            Update campaign
DELETE /api/campaigns/:id            Delete campaign
POST   /api/campaigns/:id/preview    Generate preview
POST   /api/campaigns/:id/publish    Publish campaign
```

### Articles API

```
GET    /api/articles                 List articles
POST   /api/articles                 Create article
GET    /api/articles/:id             Get article
PUT    /api/articles/:id             Update article
DELETE /api/articles/:id             Delete article
POST   /api/articles/:id/publish     Publish article
```

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Cloudflare R2
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET_NAME=""
R2_PUBLIC_URL=""

# Cloudflare Images
CLOUDFLARE_ACCOUNT_ID=""
CLOUDFLARE_API_TOKEN=""
CLOUDFLARE_IMAGES_HASH=""
NEXT_PUBLIC_CLOUDFLARE_IMAGES_HASH=""

# OpenAI
OPENAI_API_KEY=""

# Application
NEXT_PUBLIC_SITE_URL=""
NEXT_PUBLIC_ADMIN_EMAILS=""

# Google (Optional)
GSHEETS_WEBAPP_URL=""
```

---

## Code Standards

### Naming Conventions

```typescript
// Files: kebab-case
article.service.ts
use-articles.ts
articles-table.tsx

// Components: PascalCase
function ArticlesTable() {}
function PageHeader() {}

// Functions: camelCase
function getArticleById() {}
function publishPage() {}

// Constants: UPPER_SNAKE_CASE
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const DEFAULT_PAGE_SIZE = 20;

// Types/Interfaces: PascalCase
interface Article {}
type PageStatus = 'draft' | 'preview' | 'live';

// Database fields: snake_case (in schema)
// Mapped to camelCase in TypeScript
```

### Component Structure

```typescript
// component-name.tsx

import { dependencies } from 'external';
import { internal } from '@/lib';
import { Component } from '@/components';
import { type Types } from '@/types';

interface ComponentNameProps {
  prop1: string;
  prop2?: number;
  onAction: (id: string) => void;
}

export function ComponentName({ prop1, prop2 = 0, onAction }: ComponentNameProps) {
  const [state, setState] = useState<Type>(initialValue);

  const handleAction = useCallback(() => {
    // logic
  }, [dependencies]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="container">
      {/* content */}
    </div>
  );
}
```

### Service Structure

```typescript
// service-name.service.ts

import { db } from '@/lib/db';
import { repository } from '@/repositories';
import { type Types } from '@/types';

export const ServiceName = {
  async getById(id: string): Promise<Type | null> {
    return repository.findById(id);
  },

  async create(data: CreateInput): Promise<Type> {
    const validated = schema.parse(data);
    return repository.create(validated);
  },

  async update(id: string, data: UpdateInput): Promise<Type> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new NotFoundError('Resource not found');
    }
    return repository.update(id, data);
  },
};
```

### API Route Structure

```typescript
// route.ts

import { NextRequest, NextResponse } from 'next/server';
import { service } from '@/services';
import { schema } from '@/lib/validation';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const data = await service.getAll();
    return NextResponse.json({ data });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const validated = schema.parse(body);
    const result = await service.create(validated);
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Error Handling

```typescript
// Custom error classes
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public errors?: Record<string, string[]>) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

// API error handler
export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  console.error('Unhandled error:', error);
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

---

## Implementation Phases

### Phase 1: Foundation
- [ ] Project setup (Next.js, TypeScript, Tailwind)
- [ ] Database setup (Prisma, PostgreSQL)
- [ ] Authentication (Supabase)
- [ ] Base UI components (shadcn/ui)
- [ ] Layout components (header, sidebar, footer)

### Phase 2: Core CMS
- [ ] Article CRUD
- [ ] Category management
- [ ] Image upload
- [ ] Basic article renderer

### Phase 3: Static Pages System
- [ ] Static page CRUD
- [ ] Page renderer
- [ ] Script manager
- [ ] Page-script association
- [ ] Preview system

### Phase 4: Campaign System
- [ ] Campaign CRUD
- [ ] Campaign-script association
- [ ] Campaign URL routing
- [ ] Campaign preview

### Phase 5: Publishing Pipeline
- [ ] Draft/Preview/Live workflow
- [ ] Version history
- [ ] Rollback functionality
- [ ] Cloudflare R2 integration

### Phase 6: Analytics
- [ ] Traffic tracking
- [ ] Analytics dashboard
- [ ] Export functionality

### Phase 7: Polish
- [ ] Error handling
- [ ] Loading states
- [ ] Responsive design
- [ ] Performance optimization

---

## Security Considerations

1. **Authentication** - All dashboard routes protected
2. **Authorization** - Role-based access (admin vs editor)
3. **Input Validation** - Zod schemas for all inputs
4. **XSS Prevention** - Sanitize user content
5. **CSRF Protection** - Built into Next.js
6. **Rate Limiting** - On API routes
7. **SQL Injection** - Prisma parameterized queries
8. **Secrets** - Environment variables, never committed

---

## Performance Considerations

1. **Server Components** - Default for data fetching
2. **Static Generation** - For public pages where possible
3. **Image Optimization** - Cloudflare Images
4. **Code Splitting** - Automatic with Next.js
5. **Caching** - R2 CDN for static assets
6. **Database** - Connection pooling, indexed queries

---

## Testing Strategy

1. **Unit Tests** - Services, utilities
2. **Integration Tests** - API routes
3. **E2E Tests** - Critical user flows
4. **Manual Testing** - Preview system

---

## Deployment

1. **Vercel** - Primary hosting
2. **Database** - Supabase (managed PostgreSQL)
3. **Storage** - Cloudflare R2
4. **Domain** - Custom domain via Vercel
5. **CI/CD** - GitHub Actions + Vercel

---

## Quick Start Commands

```bash
# Install dependencies
pnpm install

# Setup database
pnpm prisma generate
pnpm prisma db push

# Run development server
pnpm dev

# Build for production
pnpm build

# Run production server
pnpm start

# Run linting
pnpm lint

# Run type checking
pnpm typecheck
```

---

## Notes

- All code should be production-ready
- No placeholder or TODO comments in final code
- Self-documenting code preferred over comments
- Follow existing patterns when extending
- Test locally before committing
