import { useState } from 'react';
import type { AppProps } from 'next/app';
import useTaskStore from '@/lib/store/task-store';
import Layout from '@/components/layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const [activeComponent, setActiveComponent] = useState('calendar');

  const enhancedPageProps = {
    ...pageProps,
    activeComponent,
    setActiveComponent,
  };

  return (
    <Layout
      activeComponent={activeComponent}
      onComponentChange={setActiveComponent}
    >
      <Component {...enhancedPageProps} />
    </Layout>
  );
}
