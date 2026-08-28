export default function LoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-32 animate-pulse rounded-xl bg-gray-100"
        />
      ))}
    </div>
  );
}