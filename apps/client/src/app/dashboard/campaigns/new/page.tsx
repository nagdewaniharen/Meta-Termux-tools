'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api, type Page } from '@/lib/api'

export default function NewCampaignPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pages, setPages] = useState<Page[]>([])

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [targetPages, setTargetPages] = useState<string[]>([])

    useEffect(() => {
        loadPages()
    }, [])

    async function loadPages() {
        try {
            const data = await api.pages.list()
            setPages(data.items)
        } catch (err) {
            console.error(err)
        }
    }

    function togglePage(slug: string) {
        setTargetPages(prev =>
            prev.includes(slug)
                ? prev.filter(p => p !== slug)
                : [...prev, slug]
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!name.trim()) {
            setError('Name is required')
            return
        }

        try {
            setLoading(true)
            setError(null)
            await api.campaigns.create({
                name: name.trim(),
                description: description.trim() || undefined,
                target_pages: targetPages,
                status: 'draft',
            })
            router.push('/dashboard/campaigns')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create campaign')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/campaigns">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">New Campaign</h1>
                    <p className="text-muted-foreground">
                        Create a campaign with targeted scripts
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Campaign Details</CardTitle>
                        <CardDescription>
                            Configure campaign name and target pages
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Campaign Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Facebook Traffic Q1"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Campaign description"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Target Pages</Label>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {pages.map((page) => (
                                    <label
                                        key={page.slug}
                                        className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-accent"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={targetPages.includes(page.slug)}
                                            onChange={() => togglePage(page.slug)}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <div>
                                            <div className="font-medium">{page.title}</div>
                                            <div className="text-sm text-muted-foreground">/{page.slug}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link href="/dashboard/campaigns">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Campaign'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
