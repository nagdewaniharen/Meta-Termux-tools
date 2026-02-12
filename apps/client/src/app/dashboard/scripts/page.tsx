'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
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
import { api, type Script } from '@/lib/api'

const positionLabels: Record<string, string> = {
    head_start: 'Head Start',
    head_end: 'Head End',
    body_start: 'Body Start',
    body_end: 'Body End',
}

export default function ScriptsPage() {
    const [scripts, setScripts] = useState<Script[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadScripts()
    }, [])

    async function loadScripts() {
        try {
            setLoading(true)
            const data = await api.scripts.list()
            setScripts(data.items)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load scripts')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this script?')) return

        try {
            await api.scripts.delete(id)
            setScripts(scripts.filter(s => s.id !== id))
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete')
        }
    }

    async function handleToggleStatus(script: Script) {
        const newStatus = script.status === 'active' ? 'inactive' : 'active'
        try {
            await api.scripts.toggleStatus(script.id, newStatus)
            setScripts(scripts.map(s =>
                s.id === script.id ? { ...s, status: newStatus } : s
            ))
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update status')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading scripts...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-destructive">{error}</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Scripts</h1>
                    <p className="text-muted-foreground">
                        Manage tracking and analytics scripts
                    </p>
                </div>
                <Link href="/dashboard/scripts/new">
                    <Button>
                        <Plus className="h-4 w-4" />
                        Add Script
                    </Button>
                </Link>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Global</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scripts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    No scripts yet. Create your first script.
                                </TableCell>
                            </TableRow>
                        ) : (
                            scripts.map((script) => (
                                <TableRow key={script.id}>
                                    <TableCell>
                                        <div className="font-medium">{script.name}</div>
                                        {script.description && (
                                            <div className="text-sm text-muted-foreground">{script.description}</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{positionLabels[script.position]}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {script.is_global ? (
                                            <Badge variant="secondary">Global</Badge>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <button onClick={() => handleToggleStatus(script)}>
                                            <Badge variant={script.status === 'active' ? 'success' : 'warning'}>
                                                {script.status}
                                            </Badge>
                                        </button>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/dashboard/scripts/${script.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(script.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
