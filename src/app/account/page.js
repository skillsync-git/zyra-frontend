import { Suspense } from "react";
import AccountClient from "./AccountClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <AccountClient />
    </Suspense>
  );
}
