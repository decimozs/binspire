import type { Route } from "./+types/failed-verification";
import { useLoaderData } from "react-router";
import { useEffect } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const type = searchParams.get("tp");
  const email = searchParams.get("e");
  const error = searchParams.get("err");

  return {
    email,
    type,
    error,
  };
}

export default function FailedVerificationPage() {
  const loaderData = useLoaderData<typeof loader>();
  const email = loaderData.email as string;

  useEffect(() => {
    const channel = new BroadcastChannel("email-verification");
    channel.postMessage({ type: "failed", email });
    channel.close();
    window.close();
  }, []);

  return null;
}
