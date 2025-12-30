'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  className?: string;
}

export default function ClientOnly({ children, className }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      suppressHydrationWarning 
      className={className}
      style={!mounted ? { visibility: 'hidden' } : undefined}
      data-hydrated={mounted ? 'true' : 'false'}
    >
      {children}
    </div>
  );
}