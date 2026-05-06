import { Suspense } from "react";
import TrackClient from "./TrackClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <TrackClient />
    </Suspense>
  );
}
