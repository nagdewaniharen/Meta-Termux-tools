import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileCode2, Files, Target, Activity } from 'lucide-react'

const stats = [
    { label: 'Total Scripts', value: '12', icon: FileCode2, description: 'Active tracking scripts' },
    { label: 'Static Pages', value: '6', icon: Files, description: 'Published pages' },
    { label: 'Page Views', value: '24.5K', icon: Activity, description: 'Last 30 days' },
]

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage scripts, pages, and campaigns
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <a
                            href="/dashboard/scripts/new"
                            className="block rounded-lg border p-3 hover:bg-accent transition-colors"
                        >
                            <div className="font-medium">Add New Script</div>
                            <div className="text-sm text-muted-foreground">Create a tracking or analytics script</div>
                        </a>
                        <a
                            href="/dashboard/pages/new"
                            className="block rounded-lg border p-3 hover:bg-accent transition-colors"
                        >
                            <div className="font-medium">Create Static Page</div>
                            <div className="text-sm text-muted-foreground">Launch a new landing page</div>
                        </a>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest changes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-muted-foreground">Script &quot;Anura Fraud&quot; updated</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className="text-muted-foreground">Search page published</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                <span className="text-muted-foreground">Campaign &quot;FB Traffic&quot; created</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
