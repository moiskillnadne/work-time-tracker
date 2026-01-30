import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-xl text-muted-foreground">Page not found</p>
        <Link
          to="/"
          className="mt-6 inline-block text-primary hover:underline"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
