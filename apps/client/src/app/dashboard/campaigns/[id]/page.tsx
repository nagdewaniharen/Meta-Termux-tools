'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
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
import { api, type Campaign, type Script } from '@/lib/api'

const positionLabels: Record<string, string> = {
    head_start: 'Head Start',
    head_end: 'Head End',
    body_start: 'Body Start',
    body_end: 'Body End',
}

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'secondary'> = {
    draft: 'secondary',
    active: 'success',
    paused: 'warning',
    archived: 'secondary',
}

export default function CampaignDetailPage() {
    const params = useParams()
    const id = params.id as string

    const [loading, setLoading] = useState(true)
    const [campaign, setCampaign] = useState<(Campaign & { scripts: Script[] }) | null>(null)
    const [allScripts, setAllScripts] = useState<Script[]>([])
    const [selectedScript, setSelectedScript] = useState<string>('')
    const [attaching, setAttaching] = useState(false)

    useEffect(() => {
        loadData()
    }, [id])

    async function loadData() {
        try {
            setLoading(true)
            const [campaignData, scriptsData] = await Promise.all([
                api.campaigns.get(id),
                api.scripts.list(),
            ])
            setCampaign(campaignData)
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
            await api.campaigns.attachScript(id, selectedScript)
            await loadData()
            setSelectedScript('')
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to attach script')
        } finally {
            setAttaching(false)
        }
    }

    async function handleDetachScript(scriptId: string) {
        if (!confirm('Remove this script from the campaign?')) return

        try {
            await api.campaigns.detachScript(id, scriptId)
            await loadData()
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to detach script')
        }
    }

    async function handleStatusChange(newStatus: Campaign['status']) {
        try {
            await api.campaigns.update(id, { status: newStatus })
            if (campaign) {
                setCampaign({ ...campaign, status: newStatus })
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update status')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        )
    }

    if (!campaign) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-destructive">Campaign not found</div>
            </div>
        )
    }

    const attachedScriptIds = campaign.scripts.map(s => s.id)
    const availableScripts = allScripts.filter(s => !attachedScriptIds.includes(s.id))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/campaigns">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{campaign.name}</h1>
                        {campaign.description && (
                            <p className="text-muted-foreground">{campaign.description}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant={statusVariants[campaign.status]}>{campaign.status}</Badge>
                    <Select value={campaign.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="paused">Paused</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Target Pages</CardTitle>
                        <CardDescription>Pages this campaign applies to</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {campaign.target_pages.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No target pages</div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {campaign.target_pages.map((page) => (
                                    <Badge key={page} variant="outline">{page}</Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Target Keywords</CardTitle>
                        <CardDescription>Keywords for campaign matching</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {campaign.target_keywords.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No target keywords</div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {campaign.target_keywords.map((keyword) => (
                                    <Badge key={keyword} variant="secondary">{keyword}</Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Campaign Scripts</CardTitle>
                    <CardDescription>
                        Scripts injected when this campaign is active
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {campaign.scripts.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-4 text-center">
                            No scripts attached to this campaign
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {campaign.scripts.map((script) => (
                                <div
                                    key={script.id}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div>
                                        <div className="font-medium">{script.name}</div>
                                        <Badge variant="outline" className="text-xs mt-1">
                                            {positionLabels[script.position]}
                                        </Badge>
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
