'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Loader2, ExternalLink, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { api, type LandingPage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

export default function LandingPagesPage() {
    const [loading, setLoading] = useState(true)
    const [pages, setPages] = useState<LandingPage[]>([])

    useEffect(() => {
        loadPages()
    }, [])

    async function loadPages() {
        try {
            setLoading(true)
            const result = await api.landingPages.list()
            setPages(result?.items || [])
        } catch (error) {
            toast.error('Failed to load landing pages')
            console.error(error)
            setPages([])
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this landing page?')) return
        try {
            await api.landingPages.delete(id)
            toast.success('Landing page deleted')
            loadPages()
        } catch (error) {
            toast.error('Failed to delete landing page')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Landing Pages</h1>
                    <p className="text-muted-foreground">
                        Generate and manage your AI-powered landing pages.
                    </p>
                </div>
                <Link href="/dashboard/landing-pages/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Landing Pages</CardTitle>
                    <CardDescription>
                        A list of all generated landing pages and their status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : pages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <p className="mb-4 text-lg">No landing pages yet</p>
                            <Link href="/dashboard/landing-pages/new">
                                <Button variant="outline">Create your first page</Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Keyword</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pages.map((page) => (
                                    <TableRow key={page.id}>
                                        <TableCell className="font-medium">
                                            {page.title}
                                            <div className="text-xs text-muted-foreground">/{page.slug}</div>
                                        </TableCell>
                                        <TableCell>{page.keyword}</TableCell>
                                        <TableCell>
                                            <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                                                {page.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(page.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/dashboard/landing-pages/${page.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDelete(page.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
