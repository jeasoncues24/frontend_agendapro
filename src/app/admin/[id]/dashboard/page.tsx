import DashboardComponent from "./_components/DashboardComponent";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="px-8 py-4">
                <h2 className="text-4xl font-bold">Dashboard</h2>
            </div>
            <div>
                <DashboardComponent />
            </div>
        </div>
    )
}