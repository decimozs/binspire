import { useUpdateOrgSecret } from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@binspire/ui/components/dialog";
import { Input } from "@binspire/ui/components/input";
import { Check, Copy, Loader2 } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { ShowToast } from "@/components/core/toast-notification";
import { authClient } from "@/lib/auth-client";

function generateSecureSecret(length = 48) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  const base64 = btoa(String.fromCharCode(...array))
    .replace(/\+/g, "_")
    .replace(/\//g, "-")
    .replace(/=+$/, "");
  return `sk_${base64.slice(0, 10)}_${base64.slice(10, 26)}_${base64.slice(26, 42)}_${base64.slice(42)}`;
}

export default function GenerateKeySecret() {
  const [open, setOpen] = useQueryState(
    "generate_secret",
    parseAsBoolean.withDefault(false),
  );
  const { data: session } = authClient.useSession();
  const updateOrgSecret = useUpdateOrgSecret();

  const [secret, setSecret] = useState<string>("");
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const newSecret = generateSecureSecret();
    setSecret(newSecret);
    setShowSecret(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      ShowToast("error", "Failed to copy to clipboard");
    }
  };

  const handleSaveSecret = async () => {
    await updateOrgSecret.mutateAsync({
      orgId: session?.user.orgId!,
      secret,
    });
    ShowToast("success", "Secret saved successfully");
    setOpen(false);
    window.location.href = "/";
  };

  useEffect(() => {
    if (!secret) {
      const newSecret = generateSecureSecret();
      setSecret(newSecret);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Secret</DialogTitle>
          <DialogDescription>
            Generate a new key secret for your organization. Make sure to store
            it securely as it will be required for API access.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Input
            type={showSecret ? "text" : "password"}
            value={secret}
            readOnly
            className="pr-20"
          />

          <button
            type="button"
            onClick={handleCopy}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <div
              className={`transition-all duration-300 ${
                copied ? "scale-110 text-emerald-500" : "scale-100"
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </div>
          </button>
        </div>

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowSecret((v) => !v)}
            >
              {showSecret ? "Hide Secret" : "Show Secret"}
            </Button>
            <Button size="sm" variant="secondary" onClick={handleGenerate}>
              Generate
            </Button>
          </div>
          <Button
            size="sm"
            onClick={handleSaveSecret}
            disabled={updateOrgSecret.isPending}
          >
            {updateOrgSecret.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Update Secret"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
