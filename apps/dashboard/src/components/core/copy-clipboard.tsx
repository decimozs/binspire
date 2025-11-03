import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@binspire/ui/components/button";

interface CopyToClipboardButtonProps {
  text: string;
}

export default function CopyToClipboardButton({
  text,
}: CopyToClipboardButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCopy}
      className="relative"
    >
      {copied ? (
        <Check className="h-4 w-4 text-emerald-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
}
