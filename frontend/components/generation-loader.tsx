type GenerationLoaderProps = {
  fullscreen?: boolean;
};

const GenerationLoader = ({ fullscreen = true }: GenerationLoaderProps) => {
  const sizing = fullscreen ? "h-svh min-h-svh" : "h-full min-h-full";
  return (
    <div
      className={`flex w-full items-center justify-center bg-white ${sizing}`}
    >
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
export default GenerationLoader;
