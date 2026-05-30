import Link from "next/link";

export default function NotFound(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8 text-center">
      <p className="font-mono text-6xl text-red">404</p>
      <h1 className="mt-4 font-mono text-xl text-green">process not found</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        The requested process could not be located in AshishOS memory. It may have
        been terminated or never existed.
      </p>
      <pre className="mt-6 rounded border border-glass bg-glass p-4 font-mono text-xs text-muted backdrop-blur-glass">
        {`Error: ENOENT — no such file or directory
  at AshishOS.router (/kernel/routes.ts:404)
  at process.main (node:internal/main/run_main_module:404)`}
      </pre>
      <Link
        href="/"
        className="mt-8 rounded border border-green/30 bg-green/10 px-6 py-2 font-mono text-sm text-green transition-colors hover:bg-green/20"
      >
        Return to Desktop
      </Link>
    </div>
  );
}
