import { Link } from "@tanstack/react-router";

export default function Policy() {
  return (
    <div className="flex items-center justify-center">
      <p className="text-xs text-center text-muted-foreground w-[250px]">
        By clicking continue, you agree to our{" "}
        <Link to="/terms-of-service" className="underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy-policy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
