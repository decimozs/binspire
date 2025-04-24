import { Link } from "react-router";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

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
  value,
  disabled,
  option,
  optionLabel,
  optionHref,
  optional,
  readOnly,
  ...rest
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  value?: string;
  disabled?: boolean;
  name: string;
  option?: "field-with-sub-link";
  readOnly?: boolean;
  optionLabel?: string;
  optionHref?: string;
  optional?: boolean;
}) => {
  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        <Label htmlFor={id} className={error ? "text-red-500" : ""}>
          {label}
        </Label>
        {optional && (
          <Label className="text-sm text-muted-foreground ml-auto">
            Optional
          </Label>
        )}
        {readOnly && (
          <Label className="text-sm text-muted-foreground ml-auto">
            Read only
          </Label>
        )}
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
        value={value}
        disabled={disabled}
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

const FormTextArea = ({
  id,
  label,
  type = "text",
  placeholder,
  error,
  className,
  ...rest
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  name: string;
  className?: string;
}) => {
  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        <Label htmlFor={id} className={error ? "text-red-500" : ""}>
          {label}
        </Label>
      </div>
      <Textarea
        id={id}
        placeholder={placeholder}
        className={`p-4 max-w-[475px] ${className} ${error ? "border-red-600" : ""}`}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "0px";
          target.style.height = target.scrollHeight + "px";
        }}
        {...rest}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

const FormRoleToggle = ({ error }: { error?: string }) => {
  const [role, setRole] = useState("");

  return (
    <>
      <Label htmlFor="role" className={error ? "text-red-500" : ""}>
        Role
      </Label>
      <ToggleGroup
        type="single"
        id="role"
        value={role}
        onValueChange={(val) => {
          if (val) setRole(val);
        }}
        className="grid grid-cols-2 w-full gap-2 mt-[-1rem]"
      >
        <ToggleGroupItem
          value="admin"
          aria-label="Toggle admin"
          className="border-[1px] border-input p-4 rounded-md h-15 cursor-pointer"
        >
          <p>Admin</p>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="collector"
          aria-label="Toggle collector"
          className="border-[1px] border-input p-4 rounded-md h-15 cursor-pointer"
        >
          <p>Collector</p>
        </ToggleGroupItem>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </ToggleGroup>
      <input type="hidden" name="role" value={role} />
    </>
  );
};

export {
  FormHeader,
  FormField,
  FormFooter,
  FormDivider,
  FormTextArea,
  FormRoleToggle,
};
