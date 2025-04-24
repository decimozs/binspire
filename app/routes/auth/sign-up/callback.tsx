import { useEffect } from "react";

export default function CallbackPage() {
  useEffect(() => {
    window.location.href = "/auth/google/signup";
  }, []);

  return <p>Redirecting to google signup...</p>;
}
