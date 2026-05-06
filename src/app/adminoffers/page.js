import { Suspense } from "react";
import AdminOffersClient from "./AdminOffersClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <AdminOffersClient />
    </Suspense>
  );
}
