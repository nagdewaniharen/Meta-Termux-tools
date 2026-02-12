const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface Script {
    id: string
    name: string
    description: string | null
    code: string
    position: 'head_start' | 'head_end' | 'body_start' | 'body_end'
    is_global: boolean
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
}

export interface ScriptInput {
    name: string
    description?: string
    code: string
    position: 'head_start' | 'head_end' | 'body_start' | 'body_end'
    is_global?: boolean
}

export interface Page {
    id: string
    slug: string
    title: string
    description: string
    status: 'draft' | 'published' | 'archived'
    version: number
    created_at: string
    updated_at: string
}

export interface Campaign {
    id: string
    name: string
    description: string | null
    status: 'draft' | 'active' | 'paused' | 'archived'
    target_pages: string[]
    target_keywords: string[]
    created_at: string
    updated_at: string
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const headers: HeadersInit = { ...options?.headers }

    // Only set JSON content type if body is NOT FormData
    if (!(options?.body instanceof FormData)) {
        Object.assign(headers, { 'Content-Type': 'application/json' })
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    })

    if (!res.ok) {
        let errorMessage = 'Request failed'
        try {
            const errorBody = await res.json()
            errorMessage = errorBody.error || errorBody.message || errorMessage
        } catch {
            errorMessage = `Request failed with status ${res.status}`
        }
        throw new Error(errorMessage)
    }

    const json = await res.json()
    // Server wraps responses in { success, data } - unwrap if present
    return json.data !== undefined ? json.data : json
}

export const api = {
    // ... scripts, pages, campaigns ...
    scripts: {
        list: () => apiFetch<{ items: Script[]; total: number }>('/scripts'),
        get: (id: string) => apiFetch<Script>(`/scripts/${id}`),
        create: (data: ScriptInput) =>
            apiFetch<Script>('/scripts', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: Partial<ScriptInput>) =>
            apiFetch<Script>(`/scripts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) =>
            apiFetch<{ success: boolean }>(`/scripts/${id}`, { method: 'DELETE' }),
        toggleStatus: (id: string, status: 'active' | 'inactive') =>
            apiFetch<Script>(`/scripts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    },

    pages: {
        list: () => apiFetch<{ items: Page[]; total: number }>('/pages'),
        create: (data: Partial<Page>) => apiFetch<Page>('/pages', { method: 'POST', body: JSON.stringify(data) }),
        get: (slug: string) => apiFetch<Page & { scripts: Script[] }>(`/pages/${slug}`),
        attachScript: (slug: string, scriptId: string) =>
            apiFetch<{ success: boolean }>(`/pages/${slug}/scripts/${scriptId}`, { method: 'POST' }),
        detachScript: (slug: string, scriptId: string) =>
            apiFetch<{ success: boolean }>(`/pages/${slug}/scripts/${scriptId}`, { method: 'DELETE' }),
    },

    campaigns: {
        list: () => apiFetch<{ items: Campaign[]; total: number }>('/campaigns'),
        get: (id: string) => apiFetch<Campaign & { scripts: Script[] }>(`/campaigns/${id}`),
        create: (data: Partial<Campaign>) =>
            apiFetch<Campaign>('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
        update: (id: string, data: Partial<Campaign>) =>
            apiFetch<Campaign>(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id: string) =>
            apiFetch<{ success: boolean }>(`/campaigns/${id}`, { method: 'DELETE' }),
        attachScript: (id: string, scriptId: string) =>
            apiFetch<{ success: boolean }>(`/campaigns/${id}/scripts/${scriptId}`, { method: 'POST' }),
        detachScript: (id: string, scriptId: string) =>
            apiFetch<{ success: boolean }>(`/campaigns/${id}/scripts/${scriptId}`, { method: 'DELETE' }),
    },

    publish: {
        preview: (slug: string) => apiFetch<{ url: string }>(`/publish/${slug}/preview`, { method: 'POST' }),
        publish: (slug: string) => apiFetch<{ success: boolean }>(`/publish/${slug}`, { method: 'POST' }),
    },

    landingPages: {
        list: (limit = 20, offset = 0) => apiFetch<{ items: LandingPage[]; total: number }>(`/landing-pages?limit=${limit}&offset=${offset}`),
        get: (id: string) => apiFetch<LandingPage>(`/landing-pages/${id}`),
        generate: (data: LandingPageGenerateInput) =>
            apiFetch<LandingPage>('/landing-pages/generate', { method: 'POST', body: JSON.stringify(data) }),
        publish: (id: string) =>
            apiFetch<{ url: string }>(`/landing-pages/${id}/publish`, { method: 'POST' }),
        unpublish: (id: string) =>
            apiFetch<{ success: boolean }>(`/landing-pages/${id}/unpublish`, { method: 'POST' }),
        delete: (id: string) =>
            apiFetch<{ success: boolean }>(`/landing-pages/${id}`, { method: 'DELETE' }),
    },

    upload: (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        return apiFetch<{ url: string }>('/upload', { method: 'POST', body: formData })
    }
}


export interface LandingPage {
    id: string
    title: string
    slug: string
    keyword: string
    description: string
    template: 'landing' | 'article'
    status: 'draft' | 'published' | 'archived'
    version: number
    created_at: string
    updated_at: string
    generated_html?: string
    live_html?: string
}

export interface LandingPageGenerateInput {
    title: string
    keyword: string
    template: 'landing' | 'article'
    creatives: Array<{ type: 'image' | 'video'; url: string; alt?: string }>
}
