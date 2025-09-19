'use client';

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <video
        autoPlay
        className=""
        loop
        muted
        /* biome-ignore lint/nursery/useSortedClasses: Preserve this order for clarity */
        playsInline
      >
        <source src="/Loader.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
