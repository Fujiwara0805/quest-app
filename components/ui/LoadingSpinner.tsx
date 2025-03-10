interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "読み込み中..." }: LoadingSpinnerProps) {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      <p className="ml-3 text-white">{message}</p>
    </div>
  );
}