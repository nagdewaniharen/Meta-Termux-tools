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
import { api, type Campaign } from '@/lib/api'

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'secondary'> = {
    draft: 'secondary',
    active: 'success',
    paused: 'warning',
    archived: 'secondary',
}

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        loadCampaigns()
    }, [])

    async function loadCampaigns() {
        try {
            setLoading(true)
            const data = await api.campaigns.list()
            setCampaigns(data.items)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load campaigns')
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this campaign?')) return

        try {
            await api.campaigns.delete(id)
            setCampaigns(campaigns.filter(c => c.id !== id))
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading campaigns...</div>
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
                    <h1 className="text-3xl font-bold">Campaigns</h1>
                    <p className="text-muted-foreground">
                        Manage traffic campaigns and script targeting
                    </p>
                </div>
                <Link href="/dashboard/campaigns/new">
                    <Button>
                        <Plus className="h-4 w-4" />
                        New Campaign
                    </Button>
                </Link>
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Campaign</TableHead>
                            <TableHead>Target Pages</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {campaigns.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No campaigns yet. Create your first campaign.
                                </TableCell>
                            </TableRow>
                        ) : (
                            campaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell>
                                        <Link
                                            href={`/dashboard/campaigns/${campaign.id}`}
                                            className="font-medium hover:underline"
                                        >
                                            {campaign.name}
                                        </Link>
                                        {campaign.description && (
                                            <div className="text-sm text-muted-foreground">{campaign.description}</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {campaign.target_pages.slice(0, 3).map((page) => (
                                                <Badge key={page} variant="outline" className="text-xs">
                                                    {page}
                                                </Badge>
                                            ))}
                                            {campaign.target_pages.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{campaign.target_pages.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariants[campaign.status]}>
                                            {campaign.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/dashboard/campaigns/${campaign.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(campaign.id)}
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
