import { Suspense } from "react";
import AdmingiftCategoryClient from "./AdmingiftCategoryClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading gift category...</div>}>
      <AdmingiftCategoryClient />
    </Suspense>
  );
}
