import { AppHeader, AppFooter } from '@/components/layout';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-8rem)] bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
          {children}
        </div>
      </main>
      <AppFooter />
    </>
  );
}