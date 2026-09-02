export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm">
      <img src="/cat.gif" alt="Loading..." className="w-24 h-24 object-contain" />
    </div>
  );
}
