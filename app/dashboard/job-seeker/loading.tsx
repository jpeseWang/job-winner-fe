export default function JobSeekerDashboardLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Skeleton */}
            <header className="bg-white border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="hidden md:flex items-center space-x-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Welcome Section Skeleton */}
                <div className="mb-8">
                    <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="w-96 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="w-16 h-8 bg-gray-200 rounded"></div>
                                </div>
                                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column Skeleton */}
                    <div className="lg:col-span-2 space-y-8">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white rounded-lg border animate-pulse">
                                <div className="p-6 border-b">
                                    <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
                                    <div className="w-64 h-4 bg-gray-200 rounded"></div>
                                </div>
                                <div className="p-6 space-y-4">
                                    {[1, 2, 3].map((j) => (
                                        <div key={j} className="p-4 border rounded-lg">
                                            <div className="w-48 h-5 bg-gray-200 rounded mb-2"></div>
                                            <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                                            <div className="flex space-x-4">
                                                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                                                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Column Skeleton */}
                    <div className="space-y-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-lg border animate-pulse">
                                <div className="p-6 border-b">
                                    <div className="w-32 h-6 bg-gray-200 rounded"></div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {[1, 2].map((j) => (
                                            <div key={j} className="w-full h-16 bg-gray-200 rounded"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
