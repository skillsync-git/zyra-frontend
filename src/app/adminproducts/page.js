import { Suspense } from "react";
import AdminProductsClient from "./AdminProducts";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <AdminProductsClient />
    </Suspense>
  );
}
