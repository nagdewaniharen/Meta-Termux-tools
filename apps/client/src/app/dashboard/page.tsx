import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'


export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage scripts, pages, and campaigns
                </p>
            </div>

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
        </div>
    )
}
