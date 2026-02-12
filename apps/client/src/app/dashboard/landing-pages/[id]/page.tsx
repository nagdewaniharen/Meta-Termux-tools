'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Globe, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { api, type LandingPage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'

export default function LandingPageDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)
    const router = useRouter()
    const [page, setPage] = useState<LandingPage | null>(null)
    const [loading, setLoading] = useState(true)
    const [publishing, setPublishing] = useState(false)

    useEffect(() => {
        loadPage()
    }, [id])

    async function loadPage() {
        try {
            setLoading(true)
            const data = await api.landingPages.get(id)
            setPage(data)
        } catch (error) {
            toast.error('Failed to load landing page')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    async function handlePublish() {
        if (!page) return
        try {
            setPublishing(true)
            const result = await api.landingPages.publish(page.id)
            toast.success('Landing page published successfully!')
            // refresh page data
            loadPage()
            // show live url
            window.open(result.url, '_blank')
        } catch (error: any) {
            toast.error(error.message || 'Failed to publish landing page')
        } finally {
            setPublishing(false)
        }
    }

    async function handleUnpublish() {
        if (!page) return
        if (!confirm('Are you sure you want to unpublish this page? It will no longer be accessible.')) return
        try {
            setPublishing(true)
            await api.landingPages.unpublish(page.id)
            toast.success('Landing page unpublished')
            loadPage()
        } catch (error: any) {
            toast.error(error.message || 'Failed to unpublish landing page')
        } finally {
            setPublishing(false)
        }
    }

    async function handleDelete() {
        if (!page) return
        if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) return
        try {
            await api.landingPages.delete(page.id)
            toast.success('Landing page deleted')
            router.push('/dashboard/landing-pages')
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete landing page')
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!page) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Landing page not found</p>
                <Link href="/dashboard/landing-pages">
                    <Button variant="outline">Back to List</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/landing-pages">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight">{page.title}</h1>
                            <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                                {page.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            /{page.slug} • Last updated {new Date(page.updated_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {page.status === 'published' ? (
                        <Button variant="outline" onClick={handleUnpublish} disabled={publishing}>
                            Unpublish
                        </Button>
                    ) : (
                        <Button onClick={handlePublish} disabled={publishing}>
                            {publishing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Globe className="mr-2 h-4 w-4" />
                                    Publish Live
                                </>
                            )}
                        </Button>
                    )}
                    <Button variant="destructive" size="icon" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="preview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="h-[calc(100vh-250px)] min-h-[500px] border rounded-lg bg-background overflow-hidden relative">
                    {page.generated_html ? (
                        <IframePreview html={page.generated_html} />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            No content generated yet
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="details">
                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
                            <CardDescription>SEO and configuration details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Title</div>
                                    <div>{page.title}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Keyword</div>
                                    <div>{page.keyword}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Slug</div>
                                    <div className="font-mono text-sm">{page.slug}</div>
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground">Version</div>
                                    <div>v{page.version}</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">Description</div>
                                <div className="text-sm">{page.description}</div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function IframePreview({ html }: { html: string }) {
    const [previewUrl, setPreviewUrl] = useState<string>('')

    useEffect(() => {
        const blob = new Blob([html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)

        return () => URL.revokeObjectURL(url)
    }, [html])

    if (!previewUrl) return null

    return (
        <iframe
            src={previewUrl}
            className="w-full h-full border-0 bg-white"
            title="Landing Page Preview"
            sandbox="allow-scripts allow-same-origin"
        />
    )
}
