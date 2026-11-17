'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '@/features/cms/media/media.css';

import MediaComponent from '@/features/cms/media/Mediacomponent';

export default function MediaPage() {

  return (
    <MediaComponent />
  );
} 