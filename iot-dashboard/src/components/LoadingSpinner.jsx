import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'w-6 h-6', className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${size} animate-spin text-blue-500`} />
    </div>
  );
};

export default LoadingSpinner;