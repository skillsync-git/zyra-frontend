import { Suspense } from "react";
import AdmincoClientClient from "./AdmincoClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <AdmincoClientClient />
    </Suspense>
  );
}
