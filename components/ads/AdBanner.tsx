"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface AdBannerProps {
  dataAdSlot: string;
}

export default function AdBanner({ dataAdSlot }: AdBannerProps) {
  const pathname = usePathname();
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (adRef.current && adRef.current.offsetParent !== null) {
        // @ts-expect-error - adsbygoogle is added by the AdSense script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err: any) {
      if (
        err.message !==
        "adsbygoogle.push() error: All 'ins' elements in the DOM with class=adsbygoogle already have ads in them."
      ) {
        console.error("AdSense error:", err.message);
      }
    }
  }, [pathname]); // Refresh on route change

  return (
    <div className="my-8 text-center overflow-hidden w-full">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXX" // Replace with actual ID
        data-ad-slot={dataAdSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
