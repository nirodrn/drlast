export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-blue-500 font-semibold text-lg tracking-wide">Loading...</span>
      </div>
    </div>
  );
}