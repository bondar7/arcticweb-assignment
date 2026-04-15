import { LeadNotFoundState } from '@/components/leads/detail/lead-detail-states';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <LeadNotFoundState
          title="Page not found"
          description="The page you opened does not exist or is no longer available."
          actionLabel="Back to leads"
          href="/leads"
          centered
          showContext={false}
        />
      </div>
    </main>
  );
}
