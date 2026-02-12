'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Eye, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { api, type Page, type Script } from '@/lib/api'

const positionLabels: Record<string, string> = {
    head_start: 'Head Start',
    head_end: 'Head End',
    body_start: 'Body Start',
    body_end: 'Body End',
}

export default function PageDetailPage() {
    const params = useParams()
    const slug = params.slug as string

    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState<(Page & { scripts: Script[] }) | null>(null)
    const [allScripts, setAllScripts] = useState<Script[]>([])
    const [selectedScript, setSelectedScript] = useState<string>('')
    const [attaching, setAttaching] = useState(false)
    const [publishing, setPublishing] = useState(false)

    useEffect(() => {
        loadData()
    }, [slug])

    async function loadData() {
        try {
            setLoading(true)
            const [pageData, scriptsData] = await Promise.all([
                api.pages.get(slug),
                api.scripts.list(),
            ])
            setPage(pageData)
            setAllScripts(scriptsData.items)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleAttachScript() {
        if (!selectedScript) return

        try {
            setAttaching(true)
            await api.pages.attachScript(slug, selectedScript)
            await loadData()
            setSelectedScript('')
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to attach script')
        } finally {
            setAttaching(false)
        }
    }

    async function handleDetachScript(scriptId: string) {
        if (!confirm('Remove this script from the page?')) return

        try {
            await api.pages.detachScript(slug, scriptId)
            await loadData()
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to detach script')
        }
    }

    async function handlePreview() {
        try {
            const { url } = await api.publish.preview(slug)
            window.open(url, '_blank')
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to generate preview')
        }
    }

    async function handlePublish() {
        if (!confirm('Publish this page to production?')) return

        try {
            setPublishing(true)
            await api.publish.publish(slug)
            await loadData()
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to publish')
        } finally {
            setPublishing(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    if (!page) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-destructive">Page not found</div>
            </div>
        )
    }

    const attachedScriptIds = page.scripts.map(s => s.id)
    const availableScripts = allScripts.filter(s => !attachedScriptIds.includes(s.id))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/pages">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{page.title}</h1>
                        <p className="text-muted-foreground">
                            <code>/{page.slug}</code> - v{page.version}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={page.status === 'published' ? 'success' : 'warning'}>
                        {page.status}
                    </Badge>
                    <Button variant="outline" onClick={handlePreview}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                    </Button>
                    <Button onClick={handlePublish} disabled={publishing}>
                        <Upload className="h-4 w-4 mr-2" />
                        {publishing ? 'Publishing...' : 'Publish'}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Attached Scripts</CardTitle>
                    <CardDescription>
                        Scripts that will be injected into this page
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {page.scripts.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-4 text-center">
                            No scripts attached to this page
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {page.scripts.map((script) => (
                                <div
                                    key={script.id}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div>
                                        <div className="font-medium">{script.name}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-xs">
                                                {positionLabels[script.position]}
                                            </Badge>
                                            {script.is_global && (
                                                <Badge variant="secondary" className="text-xs">Global</Badge>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDetachScript(script.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-2 pt-4 border-t">
                        <Select value={selectedScript} onValueChange={setSelectedScript}>
                            <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select a script to add..." />
                            </SelectTrigger>
                            <SelectContent>
                                {availableScripts.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground">
                                        No more scripts available
                                    </div>
                                ) : (
                                    availableScripts.map((script) => (
                                        <SelectItem key={script.id} value={script.id}>
                                            {script.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={handleAttachScript}
                            disabled={!selectedScript || attaching}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
