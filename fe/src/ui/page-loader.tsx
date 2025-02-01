import { Loader } from 'lucide-react';

export const PageLoader = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader className="animate-spin duration-1000 text-white" size={80} />
    </div>
  );
};
