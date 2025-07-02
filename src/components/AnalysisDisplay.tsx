import React from 'react';

interface AnalysisProps {
  text: string;
}

const parseInlineFormatting = (text: string) => {
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-blue-600">
          {part.slice(2, -2)}
        </strong>
      );
    } else if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={idx} className="italic text-gray-400">
          {part.slice(1, -1)}
        </em>
      );
    } else {
      return part;
    }
  });
};

const AnalysisRenderer: React.FC<AnalysisProps> = ({ text }) => {
  const lines = text.split('\n');

  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushListBuffer = () => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside mb-2 text-gray-300">
          {listBuffer.map((item, idx) => (
            <li key={idx}>{parseInlineFormatting(item)}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  lines.forEach((line, index) => {
    if (line.startsWith('### ')) {
      flushListBuffer();
      elements.push(
        <h3
          key={index}
          className="text-2xl font-extrabold uppercase mt-6 mb-3 border-b border-blue-600 pb-1 text-blue-400"
        >
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      flushListBuffer();
      elements.push(
        <h4 key={index} className="text-lg font-bold mt-4 mb-2 text-green-400">
          {line.replace('## ', '')}
        </h4>
      );
    } else if (line.startsWith('- ')) {
      listBuffer.push(line.substring(2));
    } else if (line.trim() === '') {
      flushListBuffer();
      elements.push(<br key={index} />);
    } else {
      flushListBuffer();
      elements.push(
        <p key={index} className="mb-2 text-gray-300">
          {parseInlineFormatting(line)}
        </p>
      );
    }
  });

  flushListBuffer();

  return <div className="leading-relaxed whitespace-pre-wrap">{elements}</div>;
};

export default AnalysisRenderer;
