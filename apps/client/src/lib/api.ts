const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

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
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    })

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(error.error || 'Request failed')
    }

    return res.json()
}

export const api = {
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
            apiFetch<Script>(`/scripts/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
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
}
