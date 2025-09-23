"use client";

import { useEffect, useState } from "react";

export function useDeviceRestriction(minWidth = 1000) {
  const [restricted, setRestricted] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth < minWidth) {
        setRestricted(true);
      } else {
        setRestricted(false);
      }
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, [minWidth]);

  return restricted;
}
