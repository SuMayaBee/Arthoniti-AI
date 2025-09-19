

const Loader = () => {
  
  return (
    <div className="flex min-h-[calc(100vh-40px)] w-full items-center justify-center bg-white">
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
};
export default Loader;
