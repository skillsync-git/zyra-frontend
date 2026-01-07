import { Suspense } from "react";
import AdmingiftClient from "./AdmingiftClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading admin gift page...</div>}>
      <AdmingiftClient />
    </Suspense>
  );
}
