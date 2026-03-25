// File: src/components/MathJaxScript.js
'use client';

import Script from 'next/script';

export default function MathJaxScript() {
  return (
    <Script
      src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML"
      strategy="afterInteractive"
    />
  );
}