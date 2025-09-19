const HistoryLoader = () => {
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center bg-white">
      <video
        autoPlay
        className="h-44 w-44"
        loop
        muted
        /* biome-ignore lint/nursery/useSortedClasses: Preserve this order for clarity */
        playsInline
      >
        <source src="/logo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
export default HistoryLoader;
