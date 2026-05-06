import { Suspense } from "react";
import AdminOrdersClient from "./AdminOrdersClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <AdminOrdersClient />
    </Suspense>
  );
}
