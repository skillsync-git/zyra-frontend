import { Suspense } from "react";
import AdminmessagesClient from "./AdminmessagesClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <AdminmessagesClient />
    </Suspense>
  );
}
