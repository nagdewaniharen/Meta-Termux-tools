'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { api } from '@/lib/api'

export default function NewScriptPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [code, setCode] = useState('')
    const [position, setPosition] = useState<'head_start' | 'head_end' | 'body_start' | 'body_end'>('body_end')
    const [isGlobal, setIsGlobal] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!name.trim() || !code.trim()) {
            setError('Name and code are required')
            return
        }

        try {
            setLoading(true)
            setError(null)
            await api.scripts.create({
                name: name.trim(),
                description: description.trim() || undefined,
                code: code.trim(),
                position,
                is_global: isGlobal,
            })
            router.push('/dashboard/scripts')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create script')
        } finally {
            setLoading(false)
        }
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
                    <h1 className="text-3xl font-bold">New Script</h1>
                    <p className="text-muted-foreground">
                        Add a tracking or analytics script
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Script Details</CardTitle>
                        <CardDescription>
                            Configure the script properties and code
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
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Script'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
