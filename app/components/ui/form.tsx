import { Link } from "react-router";
import { Input } from "./input";
import { Label } from "./label";

interface FormHeaderProps {
  title: string;
  description?: string;
}

const FormHeader = ({ title, description }: FormHeaderProps) => {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

const FormField = ({
  id,
  label,
  type = "text",
  placeholder,
  error,
  option,
  optionLabel,
  optionHref,
  ...rest
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  name: string;
  option?: "field-with-sub-link";
  optionLabel?: string;
  optionHref?: string;
}) => {
  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        <Label htmlFor={id}>{label}</Label>
        {option === "field-with-sub-link" && option && optionHref && (
          <Link
            to={optionHref}
            className="ml-auto text-sm underline-offset-4 hover:underline"
          >
            {optionLabel}
          </Link>
        )}
      </div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`h-12 p-4 ${error ? "border-red-600" : ""}`}
        {...rest}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

interface FormFooterLinkProps {
  message: string;
  linkText: string;
  href: string;
}

const FormDivider = ({ label }: { label: string }) => {
  return (
    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
      <span className="relative z-10 bg-background px-2 text-muted-foreground">
        {label}
      </span>
    </div>
  );
};

const FormFooter = ({ message, linkText, href }: FormFooterLinkProps) => {
  return (
    <div className="text-center text-sm">
      {message}{" "}
      <Link to={href} className="underline underline-offset-4">
        {linkText}
      </Link>
    </div>
  );
};

export { FormHeader, FormField, FormFooter, FormDivider };
