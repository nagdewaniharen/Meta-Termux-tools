'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Plus, Trash2, Loader2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface Creative {
    type: 'image' | 'video'
    url: string
    alt: string
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// ...

export default function NewLandingPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState('')
    const [keyword, setKeyword] = useState('')
    const [creatives, setCreatives] = useState<Creative[]>([
        { type: 'image', url: '', alt: '' }
    ])
    const [uploading, setUploading] = useState<Record<number, boolean>>({})

    function addCreative() {
        setCreatives([...creatives, { type: 'image', url: '', alt: '' }])
    }

    function removeCreative(index: number) {
        setCreatives(creatives.filter((_, i) => i !== index))
    }

    function updateCreative(index: number, field: keyof Creative, value: string) {
        const newCreatives = [...creatives]
        newCreatives[index] = { ...newCreatives[index], [field]: value }
        setCreatives(newCreatives)
    }

    async function handleFileUpload(index: number, file: File) {
        if (!file) return

        try {
            setUploading(prev => ({ ...prev, [index]: true }))
            const result = await api.upload(file)
            updateCreative(index, 'url', result.url)
            toast.success('File uploaded successfully')
        } catch (error: any) {
            toast.error('Upload failed: ' + error.message)
        } finally {
            setUploading(prev => ({ ...prev, [index]: false }))
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!title.trim() || !keyword.trim()) {
            toast.error('Title and keyword are required')
            return
        }

        const validCreatives = creatives.filter(c => c.url.trim())

        try {
            setLoading(true)
            const result = await api.landingPages.generate({
                title,
                keyword,
                template: 'landing',
                creatives: validCreatives
            })

            toast.success('Landing page generated successfully!')
            router.push(`/dashboard/landing-pages/${result.id}`)
        } catch (error: any) {
            toast.error(error.message || 'Failed to generate landing page')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/landing-pages">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create Landing Page</h1>
                    <p className="text-muted-foreground">
                        generate the content using AI
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Page Details</CardTitle>
                    <CardDescription>
                        Provide the core topic and assets for your landing page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Page Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Best Running Shoes 2025"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="keyword">Primary Keyword</Label>
                            <Input
                                id="keyword"
                                placeholder="e.g. running shoes"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Creatives (Images/Videos)</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addCreative}
                                    disabled={loading}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Creative
                                </Button>
                            </div>

                            {creatives.map((creative, index) => (
                                <div key={index} className="flex gap-3 items-start p-4 border rounded-lg bg-muted/40">
                                    <div className="grid gap-3 flex-1">
                                        <div className="flex gap-3">
                                            <div className="w-32">
                                                <Select
                                                    value={creative.type}
                                                    onValueChange={(val: 'image' | 'video') => updateCreative(index, 'type', val)}
                                                    disabled={loading}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="image">Image</SelectItem>
                                                        <SelectItem value="video">Video</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex-1">
                                                <Tabs defaultValue="url" className="w-full">
                                                    <TabsList className="grid w-full grid-cols-2 mb-2">
                                                        <TabsTrigger value="url">URL</TabsTrigger>
                                                        <TabsTrigger value="upload">Upload</TabsTrigger>
                                                    </TabsList>
                                                    <TabsContent value="url">
                                                        <Input
                                                            placeholder="Asset URL (https://...)"
                                                            value={creative.url}
                                                            onChange={(e) => updateCreative(index, 'url', e.target.value)}
                                                            disabled={loading || uploading[index]}
                                                        />
                                                    </TabsContent>
                                                    <TabsContent value="upload">
                                                        <div className="flex gap-2">
                                                            <Input
                                                                type="file"
                                                                accept={creative.type === 'image' ? "image/*" : "video/*"}
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0]
                                                                    if (file) handleFileUpload(index, file)
                                                                }}
                                                                disabled={loading || uploading[index]}
                                                            />
                                                            {uploading[index] && <Loader2 className="h-4 w-4 animate-spin my-auto" />}
                                                        </div>
                                                        {creative.url && (
                                                            <p className="text-xs text-muted-foreground mt-1 break-all line-clamp-2">
                                                                Uploaded: {creative.url.split('/').pop()}
                                                            </p>
                                                        )}
                                                    </TabsContent>
                                                </Tabs>
                                            </div>
                                        </div>
                                        <Input
                                            placeholder="Alt Text (optional)"
                                            value={creative.alt}
                                            onChange={(e) => updateCreative(index, 'alt', e.target.value)}
                                            disabled={loading}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={() => removeCreative(index)}
                                        disabled={loading || creatives.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" size="lg" disabled={loading} className="min-w-[150px]">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Generate Page
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
