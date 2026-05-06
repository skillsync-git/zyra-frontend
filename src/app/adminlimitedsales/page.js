import { Suspense } from "react";
import AdminlimitedsaleClient from "./AdminlimitedsalesClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <AdminlimitedsaleClient />
    </Suspense>
  );
}
