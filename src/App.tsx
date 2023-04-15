import React, { ReactNode, useState, ChangeEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import './App.css';

const App: React.FC = () => {
  const [columns, setColumns] = useState<string[]>(['', '', '']);

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
    del: ({ node, ...props }: MarkdownComponentProps) => (
      <del className="line-through" {...props} />
    ),
    em: ({ node, ...props }: MarkdownComponentProps) => <em className="italic" {...props} />,
    strong: ({ node, ...props }: MarkdownComponentProps) => (
      <strong className="font-bold" {...props} />
    ),
    hr: ({ node, ...props }: MarkdownComponentProps) => (
      <hr className="border-gray-300" {...props} />
    ),
    a: ({ node, ...props }: MarkdownComponentProps) => <a className="text-blue-600" {...props} />,
    img: ({ node, ...props }: MarkdownComponentProps) => <img className="max-w-full" {...props} />,
  };

  const handleColumnChange = (e: ChangeEvent<HTMLTextAreaElement>, columnIndex: number) => {
    const newColumns = [...columns];
    newColumns[columnIndex] = e.target.value;
    setColumns(newColumns);
  };

  const generatePDF = () => {
    console.log('PDF generated!');
  };

  return (
    <main className="flex w-full flex-row items-stretch">
      <div className="flex h-screen w-1/2 flex-col">
        {columns.map((_, index) => (
          <textarea
            key={index}
            className="m-2 h-1/3 border-2 border-red-300 p-2"
            onChange={(e) => handleColumnChange(e, index)}
          />
        ))}
      </div>

      <div className="flex h-screen w-1/2 flex-col">
        <div className="my-2 flex h-full flex-row border-2 border-indigo-300">
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
        <button
          className="my-2 rounded-md border-2 border-indigo-500 bg-indigo-500 px-4 py-2 font-bold text-white hover:border-indigo-700 hover:bg-indigo-700"
          onClick={generatePDF}
        >
          Generate PDF!
        </button>
      </div>
    </main>
  );
};

export default App;
