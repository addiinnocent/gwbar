'use client';

import React, { useState, useEffect } from 'react';

export default function DndWrapper({
  children,
}:{
  children: React.ReactNode,
}) {
  const [isClient, setIsClient] = useState(false);
 
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  return (
    isClient && (
      <>{children}</>
    )
  );
}
