import React, { useState, ChangeEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import './App.css';

const App: React.FC = () => {
  const [columnOne, setColumnOne] = useState<string>('');
  const [columnTwo, setColumnTwo] = useState<string>('');
  const [columnThree, setColumnThree] = useState<string>('');

  const handleColumnOneChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setColumnOne(e.target.value);
  };

  const handleColumnTwoChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setColumnTwo(e.target.value);
  };

  const handleColumnThreeChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setColumnThree(e.target.value);
  };

  const generatePDF = () => {
    console.log('PDF generated!');
  };

  return (
    <main className="flex flex-row items-stretch w-full">
      <div className="w-1/2 h-screen flex flex-col">
        <textarea
          className="h-1/3 border-2 border-red-300 m-2 p-2"
          onChange={handleColumnOneChange}
        />

        <textarea
          className="h-1/3 border-2 border-red-300 m-2 p-2"
          onChange={handleColumnTwoChange}
        />

        <textarea
          className="h-1/3 border-2 border-red-300 m-2 p-2"
          onChange={handleColumnThreeChange}
        />
      </div>

      <div className="w-1/2 h-screen flex flex-col">
        <div className="h-full border-2 my-2 border-cyan-600 flex flex-row">
          <ReactMarkdown
            children={columnOne}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            className="p-2 w-1/3 h-full overflow-auto"
          />

          <ReactMarkdown
            children={columnTwo}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            className="p-2 w-1/3 h-full overflow-auto"
          />

          <ReactMarkdown
            children={columnThree}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            className="p-2 w-1/3 h-full overflow-auto"
          />
        </div>
        <button
          className="my-2 py-2 px-4 bg-cyan-500 hover:bg-cyan-700 text-white font-bold border-2 rounded-md border-cyan-500 hover:border-cyan-700"
          onClick={generatePDF}
        >
          Generate PDF!
        </button>
      </div>
    </main>
  );
};

export default App;
