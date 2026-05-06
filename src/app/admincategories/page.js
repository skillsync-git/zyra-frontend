import { Suspense } from "react";
import AdminCategoriesClient from "./AdminCategoriesClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <AdminCategoriesClient />
    </Suspense>
  );
}
