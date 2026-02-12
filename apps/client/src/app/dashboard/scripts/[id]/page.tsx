'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api, type Script } from '@/lib/api'

export default function EditScriptPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [script, setScript] = useState<Script | null>(null)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [code, setCode] = useState('')
    const [position, setPosition] = useState<'head_start' | 'head_end' | 'body_start' | 'body_end'>('body_end')
    const [isGlobal, setIsGlobal] = useState(false)

    useEffect(() => {
        loadScript()
    }, [id])

    async function loadScript() {
        try {
            const data = await api.scripts.get(id)
            setScript(data)
            setName(data.name)
            setDescription(data.description || '')
            setCode(data.code)
            setPosition(data.position)
            setIsGlobal(data.is_global)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load script')
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!name.trim() || !code.trim()) {
            setError('Name and code are required')
            return
        }

        try {
            setSaving(true)
            setError(null)
            await api.scripts.update(id, {
                name: name.trim(),
                description: description.trim() || undefined,
                code: code.trim(),
                position,
                is_global: isGlobal,
            })
            router.push('/dashboard/scripts')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update script')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading script...</div>
            </div>
        )
    }

    if (!script) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-destructive">Script not found</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/scripts">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Edit Script</h1>
                    <p className="text-muted-foreground">
                        Update script configuration
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Script Details</CardTitle>
                        <CardDescription>
                            Modify the script properties and code
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
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Google Analytics"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="position">Position</Label>
                                <Select value={position} onValueChange={(v) => setPosition(v as typeof position)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="head_start">Head Start</SelectItem>
                                        <SelectItem value="head_end">Head End</SelectItem>
                                        <SelectItem value="body_start">Body Start</SelectItem>
                                        <SelectItem value="body_end">Body End</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of the script"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">Script Code</Label>
                            <Textarea
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="<script>...</script>"
                                rows={12}
                                className="font-mono text-sm"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Switch
                                id="global"
                                checked={isGlobal}
                                onCheckedChange={setIsGlobal}
                            />
                            <Label htmlFor="global" className="cursor-pointer">
                                Global script (applies to all pages)
                            </Label>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link href="/dashboard/scripts">
                                <Button type="button" variant="outline">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
