import { Suspense } from "react";
import SucessClient from "./SuccessClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <SucessClient />
    </Suspense>
  );
}
