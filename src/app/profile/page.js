import { Suspense } from "react";
import ProfileClient from "./ProfileClient";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Searching...</div>}>
      <ProfileClient />
    </Suspense>
  );
}
