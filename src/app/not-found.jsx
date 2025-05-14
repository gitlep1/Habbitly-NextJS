"use client";

import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1>404</h1>
      <p>Page not found</p>
      <Button variant="primary" onClick={handleGoBack}>
        Go back
      </Button>
    </div>
  );
}
