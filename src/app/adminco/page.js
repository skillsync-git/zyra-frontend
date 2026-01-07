import { Suspense } from "react";
import AdmincoClient from "./AdmincoClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <AdmincoClient />
    </Suspense>
  );
}
