import React from "react";

const LAPTOP_BREAKPOINT = 1024;

export function useIsLaptop() {
  const [isLaptop, setIsLaptop] = React.useState(
    () => window.innerWidth >= LAPTOP_BREAKPOINT,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${LAPTOP_BREAKPOINT}px)`);
    const onChange = () => setIsLaptop(mql.matches);

    setIsLaptop(mql.matches);
    mql.addEventListener("change", onChange);

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isLaptop;
}
