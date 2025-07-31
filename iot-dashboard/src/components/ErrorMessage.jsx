import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-2 text-red-700">
        <AlertCircle className="w-5 h-5" />
        <span className="font-medium">Error</span>
      </div>
      <p className="text-red-600 mt-1 text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 inline-flex items-center space-x-2 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;