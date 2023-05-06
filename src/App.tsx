import React, { FC, ReactNode, useRef, useState, ChangeEvent, useCallback } from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import './App.css';

interface MarkdownComponentProps {
  node: ReactNode;
  [key: string]: any;
}

const markdownComponents: {
  [key: string]: React.FC<MarkdownComponentProps>;
} = {
  h1: ({ node, ...props }: MarkdownComponentProps) => <h1 className="text-2xl" {...props} />,
  h2: ({ node, ...props }: MarkdownComponentProps) => <h2 className="text-xl" {...props} />,
  h3: ({ node, ...props }: MarkdownComponentProps) => <h3 className="text-lg" {...props} />,
  h4: ({ node, ...props }: MarkdownComponentProps) => <h4 className="text-base" {...props} />,
  h5: ({ node, ...props }: MarkdownComponentProps) => <h5 className="text-sm" {...props} />,
  h6: ({ node, ...props }: MarkdownComponentProps) => <h6 className="text-xs" {...props} />,
  p: ({ node, ...props }: MarkdownComponentProps) => <p className="text-base" {...props} />,
  ul: ({ node, ...props }: MarkdownComponentProps) => <ul className="list-disc" {...props} />,
  ol: ({ node, ...props }: MarkdownComponentProps) => <ol className="list-decimal" {...props} />,
  li: ({ node, ...props }: MarkdownComponentProps) => <li className="text-base" {...props} />,
  blockquote: ({ node, ...props }: MarkdownComponentProps) => (
    <blockquote className="border-l-4 border-gray-300 pl-4" {...props} />
  ),
  table: ({ node, ...props }: MarkdownComponentProps) => (
    <table className="table-auto border-collapse border border-gray-300" {...props} />
  ),
  thead: ({ node, ...props }: MarkdownComponentProps) => (
    <thead className="border border-gray-300" {...props} />
  ),
  tbody: ({ node, ...props }: MarkdownComponentProps) => (
    <tbody className="border border-gray-300" {...props} />
  ),
  tr: ({ node, ...props }: MarkdownComponentProps) => (
    <tr className="border border-gray-300" {...props} />
  ),
  th: ({ node, ...props }: MarkdownComponentProps) => (
    <th className="border border-gray-300" {...props} />
  ),
  td: ({ node, ...props }: MarkdownComponentProps) => (
    <td className="border border-gray-300" {...props} />
  ),
  pre: ({ node, ...props }: MarkdownComponentProps) => (
    <pre className="bg-gray-100 p-2" {...props} />
  ),
  code: ({ node, ...props }: MarkdownComponentProps) => (
    <code className="rounded-md bg-gray-100 p-0.5" {...props} />
  ),
  inlineCode: ({ node, ...props }: MarkdownComponentProps) => (
    <code className="rounded-md bg-gray-100 p-0.5" {...props} />
  ),
  del: ({ node, ...props }: MarkdownComponentProps) => <del className="line-through" {...props} />,
  em: ({ node, ...props }: MarkdownComponentProps) => <em className="italic" {...props} />,
  strong: ({ node, ...props }: MarkdownComponentProps) => (
    <strong className="font-bold" {...props} />
  ),
  hr: ({ node, ...props }: MarkdownComponentProps) => <hr className="border-gray-300" {...props} />,
  a: ({ node, ...props }: MarkdownComponentProps) => (
    <a className="text-blue-600" {...props} target="_blank" rel="noopener noreferrer" />
  ),
  img: ({ node, ...props }: MarkdownComponentProps) => <img className="max-w-full" {...props} />,
};

const App: FC = () => {
  const [columns, setColumns] = useState<string[]>(['', '', '']);

  const handleColumnChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>, columnIndex: number) => {
      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];
        newColumns[columnIndex] = e.target.value;
        return newColumns;
      });
    },
    []
  );

  const handleAddColumn = useCallback(() => {
    setColumns((prevColumns) => [...prevColumns, '']);
  }, []);

  const handleRemoveColumn = useCallback(() => {
    setColumns((prevColumns) => {
      if (prevColumns.length > 1) {
        return prevColumns.slice(0, prevColumns.length - 1);
      }
      return prevColumns;
    });
  }, []);

  const markdownContainerRef = useRef<HTMLDivElement>(null);

  const generatePDF = useCallback(() => {
    if (!markdownContainerRef.current) return;

    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'absolute';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    document.body.appendChild(printIframe);

    const katexCSS = `
    <link rel="stylesheet" 
      href="https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css" 
      integrity="sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC" 
      crossorigin="anonymous">`;

    const appCSS = `
  <style>
    /* Add your CSS styling here or link to your App.css */
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
    .markdown-container {
      display: flex;
      justify-content: space-between;
    }
    .markdown-column {
      flex: 1;
      padding: 0 8px;
    }
    h1.text-2xl,
    h2.text-xl,
    h3.text-lg,
    h4.text-base,
    h5.text-sm,
    h6.text-xs {
      font-weight: bold;
    }
    p.text-base {
      font-size: 16px;
      line-height: 1.5;
    }
    ul.list-disc {
      list-style-type: disc;
      margin-left: 2em;
    }
    ol.list-decimal {
      list-style-type: decimal;
      margin-left: 2em;
    }
    li.text-base {
      font-size: 16px;
      line-height: 1.5;
    }
    blockquote {
      border-left: 4px solid #d1d5db;
      padding-left: 1rem;
    }
    table {
      border-collapse: collapse;
      border: 1px solid #d1d5db;
      width: 100%;
    }
    thead,
    tbody,
    tr,
    th,
    td {
      border: 1px solid #d1d5db;
      padding: 0.5rem;
      text-align: left;
    }
    code,
    pre {
      background-color: #f1f1f1;
      border-radius: 4px;
      padding: 0.25rem;
    }
    a {
      color: #3b82f6;
      text-decoration: none;
    }
    img.max-w-full {
      max-width: 100%;
    }
  </style>`;

    // Get the HTML content of the Markdown preview
    const markdownHTML = markdownContainerRef.current.innerHTML;

    console.log(markdownHTML);

    // Combine the HTML content with the necessary CSS
    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        ${katexCSS}
        ${appCSS}
      </head>
      <body>
        <div class="markdown-container">
          ${columns
            .map(
              (column) =>
                `<div class="markdown-column">
                  ${ReactDOMServer.renderToStaticMarkup(
                    <ReactMarkdown
                      children={column}
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                      components={markdownComponents}
                    />
                  )}
                </div>`
            )
            .join('')}
        </div>
      </body>
      </html>`;

    // Write the content to the iframe
    if (printIframe.contentWindow) {
      printIframe.contentWindow.document.write(printContent);
      printIframe.contentWindow.document.close();

      // Wait for the iframe to load, then trigger the print dialog
      printIframe.contentWindow.onload = () => {
        if (printIframe.contentWindow) {
          printIframe.contentWindow.print();
        }
        setTimeout(() => {
          document.body.removeChild(printIframe);
        }, 100);
      };
    }
  }, [columns]);

  return (
    <main className="flex w-full flex-row items-stretch">
      <div className="flex h-screen w-1/2 flex-col">
        {columns.map((_, index) => (
          <textarea
            key={index}
            className="m-2 h-1/3 border-2 border-red-300 p-2"
            onChange={(e) => handleColumnChange(e, index)}
            placeholder="Type your markdown here..."
          />
        ))}
      </div>

      <div className=" flex h-screen w-1/2 flex-col" id="paper">
        <p className="mt-1 text-stone-700">Preview: </p>
        <div
          ref={markdownContainerRef}
          className="mb-2 mr-2 flex h-full flex-row border-2 border-indigo-300"
        >
          {columns.map((column, index) => (
            <ReactMarkdown
              key={index}
              children={column}
              remarkPlugins={[remarkMath, remarkGfm]}
              rehypePlugins={[rehypeKatex]}
              className="h-full w-1/3 overflow-auto hyphens-auto p-2"
              components={markdownComponents}
            />
          ))}
        </div>
        <div className="inline-flex">
          <button
            className="mb-2 mr-2 w-1/4 rounded-md border-2 border-red-500 bg-red-500 px-4 py-2 font-bold text-white hover:border-red-700 hover:bg-red-700"
            onClick={handleAddColumn}
          >
            Add Column
          </button>
          <button
            className="mb-2 mr-2 w-1/4 rounded-md border-2 border-red-500 bg-red-500 px-4 py-2 font-bold text-white hover:border-red-700 hover:bg-red-700"
            onClick={handleRemoveColumn}
          >
            Delete Column
          </button>

          <button
            className="mb-2 mr-2 w-1/2 rounded-md border-2 border-indigo-500 bg-indigo-500 px-4 py-2 font-bold text-white hover:border-indigo-700 hover:bg-indigo-700"
            onClick={generatePDF}
          >
            Generate PDF!
          </button>
          <a
            className="mb-2 mr-2 inline-flex w-1/2 items-center justify-center rounded-md border-2 border-indigo-500 bg-indigo-500 px-4 py-2 font-bold text-white hover:border-indigo-700 hover:bg-indigo-700"
            href={'https://github.com/spabolu/cheatsheet-generator'}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="github"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 496 512"
              height={20}
              className="mr-2"
            >
              <path
                fill="currentColor"
                d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
              ></path>
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </main>
  );
};

export default App;
