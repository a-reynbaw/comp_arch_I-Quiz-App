import { Document, Page } from 'react-pdf';
import { useState } from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

interface PDFViewerProps {
  file: string;
  title: string;
}

export default function PDFViewer({ file, title }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error, 'File:', file);
  }

  return (
    <div className="flex flex-col items-center bg-gray-900 rounded-xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-gray-100 mb-4">{title}</h3>
      
      <div className="relative w-full max-w-2xl">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="text-white">Loading PDF...</div>}
          error={<div className="text-red-500">Error loading PDF!</div>}
        >
          <Page 
            pageNumber={pageNumber} 
            width={600}
            className="shadow-xl"
          />
        </Document>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => setPageNumber(page => Math.max(1, page - 1))}
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-purple-700 text-white rounded-lg disabled:opacity-50 hover:bg-purple-800"
        >
          Previous
        </button>
        <p className="text-gray-100">
          Page {pageNumber} of {numPages}
        </p>
        <button
          onClick={() => setPageNumber(page => Math.min(numPages || page, page + 1))}
          disabled={pageNumber >= (numPages || 1)}
          className="px-4 py-2 bg-purple-700 text-white rounded-lg disabled:opacity-50 hover:bg-purple-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}