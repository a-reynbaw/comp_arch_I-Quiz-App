import { useState } from 'react';

interface PDFViewerProps {
  file: string;
  title: string;
}

export default function PDFViewer({ file, title }: PDFViewerProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(file);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex h-40 w-full max-w-full flex-col items-center justify-between rounded-xl bg-gray-900 p-4 shadow-xl sm:p-6">
      <h3 className="px-2 text-center text-lg font-bold text-gray-100 sm:text-xl">{title}</h3>

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="h-12 rounded-lg bg-purple-700 px-4 py-2 text-white transition-colors hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isDownloading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span>Downloading...</span>
          </div>
        ) : (
          'Download PDF'
        )}
      </button>
    </div>
  );
}
