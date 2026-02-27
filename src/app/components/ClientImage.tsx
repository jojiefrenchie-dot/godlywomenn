"use client";

import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

type Props = Omit<ImageProps, 'priority'> & { priority?: boolean };

export default function ClientImage(props: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a simple placeholder div during SSR to avoid emitting <img> server-side
    // Preserve classes so layout remains consistent.
    return <div className={props.className} style={{ backgroundColor: '#e5e7eb' }} />;
  }

  return <Image {...(props as ImageProps)} alt={props.alt || 'image'} />;
}
