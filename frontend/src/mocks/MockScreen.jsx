import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { variants, mockLoaders, mockKey } from './registry.js';

export default function MockScreen() {
  const { screen, variant } = useParams();
  const [searchParams] = useSearchParams();
  const [theme, setTheme] = useState(
    () => searchParams.get('theme') || document.body.dataset.bsTheme || 'light');
  const key = mockKey(screen, variant);
  const Comp = useMemo(() => (key in mockLoaders ? lazy(mockLoaders[key]) : null), [key]);

  useEffect(() => { document.body.dataset.bsTheme = theme; }, [theme]);

  if (!Comp) {
    return <div className="p-6 text-foreground">missing mock: {screen}/{variant}</div>;
  }

  const i = variants.indexOf(variant);
  const prev = variants[(i - 1 + variants.length) % variants.length];
  const next = variants[(i + 1) % variants.length];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {searchParams.get('bare') !== '1' && (
        <div className="fixed bottom-3 right-3 z-50 flex items-center gap-2 rounded-md border border-border bg-card p-2 text-sm text-card-foreground shadow-md">
          <Button variant="outline" size="sm" asChild><a href="/mock">Index</a></Button>
          <Button variant="outline" size="sm" asChild><a href={`/mock/${screen}/${prev}`}>&larr;</a></Button>
          <span className="px-1 font-mono">{screen}/{variant}</span>
          <Button variant="outline" size="sm" asChild><a href={`/mock/${screen}/${next}`}>&rarr;</a></Button>
          <Button size="sm" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
        </div>
      )}
      <Suspense fallback={<div className="p-6">loading...</div>}>
        <Comp />
      </Suspense>
    </div>
  );
}
