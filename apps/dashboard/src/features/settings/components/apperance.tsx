import { useEffect, useState } from "react";
import { Skeleton } from "@binspire/ui/components/skeleton";
import { useForm } from "@tanstack/react-form";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@binspire/ui/components/radio-group";
import SaveChangesButton from "./button/save-changes";
import { ShowToast } from "@/components/core/toast-notification";
import { useFont } from "@/context/font-provider";
import SettingsLayout from "@/components/layout/settings-layout";
import { fonts, themes } from "../lib/constants";
import type { Font, Theme } from "../lib/types";
import {
  useGetUserSettingsByUserId,
  useUpdateUserSettings,
} from "@binspire/query";
import { FormFieldError } from "@binspire/ui/forms";
import { useTheme } from "@/hooks/use-theme";

const appearanceFormSchema = z.object({
  theme: z.enum(themes.map((t) => t.value)),
  font: z.enum(fonts.map((f) => f.value)),
});

export default function AppearanceSettings() {
  const session = authClient.useSession();
  const currentUser = session.data?.user;
  const updateUserSettings = useUpdateUserSettings();
  const [confirmation, setConfirmationOpen] = useState(false);
  const { setTheme } = useTheme();
  const { setFont } = useFont();
  const { data: settings, isPending } = useGetUserSettingsByUserId(
    currentUser?.id as string,
  );
  const [selectedTheme, setSelectedTheme] = useState<Theme>("system");

  const currentSettings = settings?.settings;

  const form = useForm({
    defaultValues: {
      theme: selectedTheme,
      font: currentSettings?.appearance.font || "manrope",
    },
    validators: {
      onSubmit: appearanceFormSchema,
      onChange: appearanceFormSchema,
      onBlur: appearanceFormSchema,
    },
    onSubmit: async ({ value }) => {
      await updateUserSettings.mutateAsync({
        userId: currentUser?.id as string,
        data: {
          settings: {
            ...currentSettings,
            appearance: {
              theme: value.theme,
              font: value.font,
            },
          },
        },
      });
      setTheme(value.theme);
      setFont(value.font as Font);
      ShowToast("success", "Appearance settings updated.");
      setConfirmationOpen(false);
    },
  });

  useEffect(() => {
    const theme = currentSettings?.appearance.theme;
    if (theme) {
      queueMicrotask(() => {
        setSelectedTheme(theme as Theme);
      });
    }
  }, [currentSettings?.appearance.theme]);

  return (
    <SettingsLayout
      label="Appearance"
      description="Customize the appearance of your interface with theme and font options."
    >
      <form
        id="appearance-form"
        className="flex flex-col gap-6 md:w-md"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-2">
          <p>Font</p>
          <form.Field name="font">
            {(field) => (
              <>
                <Select
                  value={field.state.value}
                  onValueChange={(val: Font) => field.setValue(val)}
                >
                  {isPending ? (
                    <Skeleton className="h-9 w-full rounded-md" />
                  ) : (
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  )}
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
          <p className="text-sm text-muted-foreground">
            Select the font used throughout the user interface.
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:w-fit">
          <p>Theme</p>
          {isPending ? (
            <Skeleton className="h-[268px] w-full rounded-md lg:h-[126px]" />
          ) : (
            <form.Field name="theme">
              {(field) => (
                <RadioGroup
                  value={selectedTheme}
                  className="md:flex flex-row gap-4"
                  onValueChange={(val: Theme) => {
                    setSelectedTheme(val);
                    field.setValue(val);
                  }}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm">Light</p>
                    <label
                      htmlFor="theme-light"
                      className={`cursor-pointer border-[2px] border-muted-foreground rounded-md ${
                        selectedTheme === "light" ? "border-primary" : ""
                      }`}
                    >
                      <RadioGroupItem
                        value="light"
                        id="theme-light"
                        className="sr-only"
                      />
                      <div className="space-y-2 rounded-sm bg-[#ecedef] p-2 border-[1px] border-muted-foreground rounded-md">
                        <div className="space-y-2 rounded-md bg-white p-2 shadow-xs">
                          <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                          <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                          <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm">Dark</p>
                    <label
                      htmlFor="theme-dark"
                      className={`cursor-pointer border-[2px] border-muted-foreground rounded-md ${
                        selectedTheme === "dark" ? "border-primary" : ""
                      }`}
                    >
                      <RadioGroupItem
                        value="dark"
                        id="theme-dark"
                        className="sr-only"
                      />
                      <div className="space-y-2 rounded-sm bg-slate-950 p-2 border-[1px] border-muted-foreground rounded-md">
                        <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-xs">
                          <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
                          <div className="h-4 w-4 rounded-full bg-slate-400" />
                          <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                        </div>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              )}
            </form.Field>
          )}
          <p className="text-sm text-muted-foreground">
            Choose between light, dark, or system default theme.
          </p>
        </div>

        <form.Subscribe
          selector={(state) => [state.canSubmit]}
          children={([canSubmit]) => (
            <SaveChangesButton
              id="appearance-form"
              action={updateUserSettings}
              disabled={!canSubmit}
              open={confirmation}
              onOpenChange={setConfirmationOpen}
            />
          )}
        />
      </form>
    </SettingsLayout>
  );
}
