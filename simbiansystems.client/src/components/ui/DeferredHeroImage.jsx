import { useEffect, useState } from "react";

const hiddenAlt = { color: "transparent", fontSize: 0 };

export default function DeferredHeroImage({ src, imgClassName = "" }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!src) return undefined;
    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (!cancelled) setReady(true);
    };
    image.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div className="min-h-[220px] w-full">
      {ready ? (
        <img
          src={src}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable={false}
          style={hiddenAlt}
          className={imgClassName}
        />
      ) : null}
    </div>
  );
}
