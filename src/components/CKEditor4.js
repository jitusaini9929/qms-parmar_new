"use client";

import { CKEditor } from "ckeditor4-react";
import { useRef } from 'react';

export default function CKEditorComponent({
  initialData = "",
  onChange,
  config = {},
}) {
    const mathJaxTimeout = useRef(null);

  const defaultConfig = {
    height: 400,
    versionCheck: false,
    extraPlugins: "mathjax",
    mathJaxLib:
      "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-AMS_HTML",
    toolbar: "Full",
    notification: false,
    ...config,
  };

  const handleChange = (event) => {
    const data = event.editor.getData();

    onChange(data);

    // debounce MathJax
    if (window.MathJax?.Hub) {
      if (mathJaxTimeout.current) {
        clearTimeout(mathJaxTimeout.current);
      }

      mathJaxTimeout.current = setTimeout(() => {
        window.MathJax?.Hub.Queue(['Typeset', window.MathJax?.Hub]);
      }, 500); // ⏱ adjust delay if needed
    }
  };

  return (
    <CKEditor
      initData={initialData}
      config={defaultConfig}
      onChange={handleChange}
    />
  );
}
