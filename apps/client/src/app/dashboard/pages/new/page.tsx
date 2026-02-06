'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'

export default function NewPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')

    // Auto-generate slug from title
    function handleTitleChange(val: string) {
        setTitle(val)
        if (!slug) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!title.trim() || !slug.trim()) {
            setError('Title and slug are required')
            return
        }

        try {
            setLoading(true)
            setError(null)
            await api.pages.create({
                title: title.trim(),
                slug: slug.trim(),
                description: description.trim(),
                status: 'draft',
            })
            router.push('/dashboard/pages')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create page')
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/pages">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">New Page</h1>
                    <p className="text-muted-foreground">
                        Create a new landing page
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Page Details</CardTitle>
                        <CardDescription>
                            Configure the basic page properties. You can attach scripts after creation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="title">Page Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="e.g., Cyber Security Guide"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL Path)</Label>
                                <Input
                                    id="slug"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="e.g., cyber-security-guide"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    The URL will be {typeof window !== 'undefined' ? window.location.origin : ''}/{slug}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description for SEO and internal use"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link href="/dashboard/pages">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Page'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
