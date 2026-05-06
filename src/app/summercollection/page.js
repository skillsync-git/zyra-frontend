import { Suspense } from "react";
import SummercollectionClient from "./SummercollectionClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <SummercollectionClient />
    </Suspense>
  );
}
