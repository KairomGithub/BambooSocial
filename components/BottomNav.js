import Link from 'next/link';
import { useRouter } from 'next/router';

export default function BottomNav() {
  const router = useRouter();
  if (router.pathname === '/auth') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-t-md flex justify-around p-2">
      <Link href="/" className="text-gray-600 hover:text-blue-500">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7h2v9h16V7h2L12 2zm0 2.21L18 7H6l6-2.79zM6 9v7h12V9H6z" />
        </svg>
      </Link>
      <Link href="/shorts" className="text-gray-600 hover:text-blue-500">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 14H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V7h8v2z" />
        </svg>
      </Link>
      <Link href="/upload" className="text-gray-600 hover:text-blue-500">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13h-3v3h-2v-3H7v-2h3V7h2v4h3v2z" />
        </svg>
      </Link>
      <Link href={`/profile/${supabase.auth.user()?.username || ''}`} className="text-gray-600 hover:text-blue-500">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </Link>
    </nav>
  );
}