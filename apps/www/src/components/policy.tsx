export default function Policy() {
  return (
    <div className="flex items-center justify-center">
      <p className="text-xs text-center text-muted-foreground w-[250px]">
        By clicking continue, you agree to our{" "}
        <a
          href="/terms-of-services.pdf"
          className="underline"
          target="_blank"
          rel="noopener"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy-policy.pdf"
          className="underline"
          target="_blank"
          rel="noopener"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
