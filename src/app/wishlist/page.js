import { Suspense } from "react";
import WishlistClient from "./WishlistClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <WishlistClient />
    </Suspense>
  );
}
