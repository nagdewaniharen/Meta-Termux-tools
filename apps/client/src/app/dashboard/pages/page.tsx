'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { api, type Page } from '@/lib/api'

export default function PagesPage() {
    const [pages, setPages] = useState<Page[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [publishing, setPublishing] = useState<string | null>(null)

    useEffect(() => {
        loadPages()
    }, [])

    async function loadPages() {
        try {
            setLoading(true)
            const data = await api.pages.list()
            setPages(data.items)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load pages')
        } finally {
            setLoading(false)
        }
    }

    async function handlePreview(slug: string) {
        try {
            const { url } = await api.publish.preview(slug)
            window.open(url, '_blank')
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to generate preview')
        }
    }

    async function handlePublish(slug: string) {
        if (!confirm('Are you sure you want to publish this page?')) return

        try {
            setPublishing(slug)
            await api.publish.publish(slug)
            await loadPages()
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to publish')
        } finally {
            setPublishing(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Static Pages</h1>
                    <p className="text-muted-foreground">
                        Manage page scripts and publishing
                    </p>
                </div>
                <Link href="/dashboard/pages/new">
                    <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        New Page
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 border rounded-lg">
                    <div className="text-muted-foreground">Loading pages...</div>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center h-64 border rounded-lg bg-destructive/5">
                    <div className="text-destructive">{error}</div>
                </div>
            ) : (
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Page</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Version</TableHead>
                                <TableHead className="w-[150px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pages.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No pages found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pages.map((page) => (
                                    <TableRow key={page.id}>
                                        <TableCell>
                                            <Link
                                                href={`/dashboard/pages/${page.slug}`}
                                                className="font-medium hover:underline"
                                            >
                                                {page.title}
                                            </Link>
                                            <div className="text-sm text-muted-foreground">{page.description}</div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-sm">/{page.slug}</code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={page.status === 'published' ? 'success' : 'warning'}>
                                                {page.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>v{page.version}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePreview(page.slug)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handlePublish(page.slug)}
                                                    disabled={publishing === page.slug}
                                                >
                                                    <Upload className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    )
}
