export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn't find the page you're looking for.
        </p>
        
        <a href="/"
          className="inline-block px-6 py-3 text-white bg-orange-300 dark:bg-orange-200 rounded-sm hover:bg-orange-400 dark:hover:bg-orange-300 transition-colors"
        >
          Go back home
        </a>
      </div>
    </div>
  )
}