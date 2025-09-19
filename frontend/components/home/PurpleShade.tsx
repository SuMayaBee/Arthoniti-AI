const PurpleShade = () => {
  return (
    <>
      {/* Right glow */}
      <div className="pointer-events-none absolute top-40 right-[5rem] z-0 h-44 w-44 rotate-12 rounded-3xl bg-purple-400 opacity-50 blur-3xl filter lg:top-40 lg:right-[3rem] lg:h-56 lg:w-56 xl:h-72 xl:w-72" />

      {/* Center-top wide glow */}
      <div className="-translate-x-1/2 -top-5 pointer-events-none absolute -lg:top-5 left-1/2 z-0 h-40 w-[20rem] rounded-full bg-purple-400 opacity-50 blur-3xl filter sm:w-[48rem] lg:h-[25rem] lg:w-[25rem]" />

      {/* Left glow */}
      <div className="-translate-y-1/2 -rotate-12 -left-[5rem] pointer-events-none absolute top-[40rem] z-0 h-44 w-44 rounded-3xl bg-purple-400 opacity-50 blur-3xl filter lg:left-[6rem] lg:h-56 lg:w-56 xl:h-72 xl:w-72" />
    </>
  );
};

export default PurpleShade;
