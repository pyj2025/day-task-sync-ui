import type { AppProps } from 'next/app';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const { user, isLoading } = useAuth();
  const [activeComponent, setActiveComponent] = useState('calendar');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const enhancedPageProps = {
    ...pageProps,
    activeComponent,
    setActiveComponent,
  };

  return (
    <Layout
      user={user}
      activeComponent={activeComponent}
      onComponentChange={setActiveComponent}
    >
      <Component {...enhancedPageProps} />
    </Layout>
  );
}
