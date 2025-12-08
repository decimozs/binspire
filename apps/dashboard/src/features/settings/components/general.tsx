import {
  MessagingApi,
  useGetOrganizationById,
  useGetOrganizationSettingsById,
  useUpdateOrganization,
  useUpdateOrganizationSettings,
} from "@binspire/query";
import { generateSlug } from "@binspire/shared";
import { Input } from "@binspire/ui/components/input";
import { Skeleton } from "@binspire/ui/components/skeleton";
import { Slider } from "@binspire/ui/components/slider";
import { Switch } from "@binspire/ui/components/switch";
import { FormFieldError } from "@binspire/ui/forms";
import { useForm } from "@tanstack/react-form";
import { getToken } from "firebase/messaging";
import { useEffect, useState } from "react";
import z from "zod";
import { ShowToast } from "@/components/core/toast-notification";
import SettingsLayout from "@/components/layout/settings-layout";
import WarningSign from "@/components/sign/warnings";
import { messaging } from "@/features/firebase";
import MaintenanceMode from "@/features/maintenance";
import DraggableMap from "@/features/map/components/draggable-map";
import GenerateQRCode from "@/features/qrcode";
import { authClient } from "@/lib/auth-client";
import { usePermissionStore } from "@/store/permission-store";
import GenerateKeySecretButton from "./button/key-secret-button";
import SaveChangesButton from "./button/save-changes";

const generalFormSchema = z.object({
  organizationName: z
    .string()
    .min(2, "Organization name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  notification: z.boolean(),
  wasteLevelThreshold: z
    .string()
    .refine((val) => !isNaN(Number(val)), { message: "Must be a number" })
    .transform((val) => Number(val))
    .refine((val) => val >= 50, { message: "Threshold must be at least 50%" })
    .refine((val) => val <= 100, { message: "Threshold cannot exceed 100%" }),
});

export default function GeneralSettings() {
  const session = authClient.useSession();
  const { permission } = usePermissionStore();
  const updateOrgSettings = useUpdateOrganizationSettings();
  const updateOrg = useUpdateOrganization();

  const getDefaultNotificationValue = () => {
    const saved = localStorage.getItem("notification_enabled");
    if (saved !== null) return saved === "true";
    return Notification.permission === "granted";
  };

  const { data: org } = useGetOrganizationById(
    session.data?.user.orgId as string,
  );

  const [confirmation, setConfirmationOpen] = useState(false);
  const { data: settings, isPending } = useGetOrganizationSettingsById(
    session.data?.user.orgId as string,
  );
  const [, setToken] = useState<string | null>(null);

  const currentUser = session.data?.user;
  const currentSettings = settings?.settings;
  const hasPermission = permission.settingsManagement?.actions.update;

  const [markerPosition, setMarkerPosition] = useState(() => {
    const loc = currentSettings?.general?.location;
    return loc ? { lat: loc.lat, lng: loc.lng } : { lat: 40, lng: -100 };
  });

  useEffect(() => {
    const loc = currentSettings?.general?.location;
    if (loc) {
      queueMicrotask(() => {
        setMarkerPosition((prev) => {
          if (!prev || prev.lat !== loc.lat || prev.lng !== loc.lng) {
            return { lat: loc.lat, lng: loc.lng };
          }
          return prev;
        });
      });
    }
  }, [
    currentSettings?.general?.location?.lat,
    currentSettings?.general?.location?.lng,
  ]);

  const form = useForm({
    defaultValues: {
      organizationName: org?.name || "",
      email: org?.email || "",
      notification: getDefaultNotificationValue(),
      wasteLevelThreshold:
        currentSettings?.general?.wasteLevelThreshold || "80",
    },
    validators: {
      onSubmit: generalFormSchema,
      onChange: generalFormSchema,
      onBlur: generalFormSchema,
    },
    onSubmit: async ({ value }) => {
      await updateOrgSettings.mutateAsync({
        orgId: currentUser?.orgId as string,
        data: {
          ...currentSettings,
          general: {
            wasteLevelThreshold: value.wasteLevelThreshold,
            location: {
              lat: markerPosition?.lat || 40,
              lng: markerPosition?.lng || -100,
            },
          },
        },
      });

      await updateOrg.mutateAsync({
        id: currentUser?.orgId as string,
        data: {
          name: value.organizationName,
          email: value.email,
          slug: generateSlug(value.organizationName),
        },
      });

      ShowToast("success", "Organization settings updated.");
      setConfirmationOpen(false);
    },
  });

  return (
    <SettingsLayout
      label="General"
      description="Manage your organization details, system preferences, notifications, and data thresholds."
    >
      {!hasPermission && <WarningSign />}

      <form
        id="general-form"
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex flex-col gap-2 w-md">
          <div className="flex items-center justify-between">
            <p>Notification</p>
            <form.Field name="notification">
              {(field) => (
                <>
                  {isPending ? (
                    <Skeleton className="h-[20px] w-16 rounded-full" />
                  ) : (
                    <div className="flex flex-row items-center gap-2">
                      <p className="text-sm">
                        {field.state.value ? "On" : "Off"}
                      </p>
                      <Switch
                        checked={field.state.value}
                        onCheckedChange={async (checked) => {
                          field.setValue(checked);
                          localStorage.setItem(
                            "notification_enabled",
                            checked ? "true" : "false",
                          );

                          if (!currentUser) return;
                          const userId = currentUser.id;

                          try {
                            if (checked) {
                              if (!("Notification" in window)) {
                                ShowToast(
                                  "error",
                                  "This browser does not support notifications.",
                                );
                                field.setValue(false);
                                return;
                              }

                              const permission =
                                await Notification.requestPermission();
                              if (permission !== "granted") {
                                ShowToast(
                                  "error",
                                  "Notification permission denied.",
                                );
                                field.setValue(false);
                                localStorage.setItem(
                                  "notification_enabled",
                                  "false",
                                );
                                return;
                              }

                              const currentToken = await getToken(messaging, {
                                vapidKey: import.meta.env
                                  .VITE_FIREBASE_VAPID_KEY,
                              });

                              if (currentToken) {
                                await MessagingApi.register(
                                  userId,
                                  currentToken,
                                );
                                localStorage.setItem("fcm_token", currentToken);
                                setToken(currentToken);
                              }

                              ShowToast("success", "Notifications enabled!");
                            } else {
                              localStorage.removeItem("fcm_token");
                              ShowToast("info", "Notifications disabled.");
                            }
                          } catch (e) {
                            console.error(e);
                            ShowToast(
                              "error",
                              "Notification initialization failed.",
                            );
                            field.setValue(!checked);
                            localStorage.setItem(
                              "notification_enabled",
                              (!checked).toString(),
                            );
                          }
                        }}
                      />
                    </div>
                  )}
                  <FormFieldError field={field} />
                </>
              )}
            </form.Field>
          </div>
          <p className="text-sm text-muted-foreground">
            Enable or disable notifications for important system events and
            alerts.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-md">
          <p>Organization Name</p>
          <form.Field name="organizationName">
            {(field) => (
              <>
                {isPending ? (
                  <Skeleton className="h-12 w-full rounded-md" />
                ) : (
                  <Input
                    type="text"
                    placeholder="Enter your organization name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    field={field}
                    disabled={!hasPermission}
                  />
                )}
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
          <p className="text-sm text-muted-foreground">
            Set and update the name of your organization as it appears across
            your account and settings.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-md">
          <p>Organization Email</p>
          <form.Field name="email">
            {(field) => (
              <>
                {isPending ? (
                  <Skeleton className="h-12 w-full rounded-md" />
                ) : (
                  <Input
                    type="email"
                    placeholder="Enter your organization email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    field={field}
                    disabled={!hasPermission}
                  />
                )}
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
          <p className="text-sm text-muted-foreground">
            Set the email address where system notifications and alerts will be
            sent.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-md">
          <p>Generate new secret key</p>
          <GenerateKeySecretButton />
          <p className="text-sm text-muted-foreground">
            Generate a new secret key for secure API access and integration.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-md">
          <p>Register Trashbin</p>
          <GenerateQRCode label="Generate QR Code" />
          <p className="text-sm text-muted-foreground">
            Generate a QR code to register new trash bins to your organization.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-md">
          <p>Waste Level Threshold</p>
          <form.Field name="wasteLevelThreshold">
            {(field) => (
              <>
                {isPending ? (
                  <Skeleton className="h-12 w-full rounded-md" />
                ) : (
                  <div className="flex flex-col gap-2">
                    <Slider
                      value={[Number(field.state.value)]}
                      max={100}
                      step={1}
                      onValueChange={(value) =>
                        field.handleChange(value[0].toString())
                      }
                      disabled={!hasPermission}
                    />
                    <p className="text-right text-sm font-medium">
                      {field.state.value}%
                    </p>
                  </div>
                )}
                <FormFieldError field={field} />
              </>
            )}
          </form.Field>
          <p className="text-sm text-muted-foreground">
            Define the waste level percentage at which the system triggers a
            full-bin alert.
          </p>
        </div>

        {markerPosition ? (
          <div
            className="flex flex-col gap-2 w-full h-[500px]"
            aria-disabled={!hasPermission}
          >
            <p>Map Initial Position</p>
            <DraggableMap
              position={markerPosition}
              onPositionChange={setMarkerPosition}
            />
            <p className="text-sm text-muted-foreground">
              Set the default position of the map when accessed by users.
            </p>
          </div>
        ) : (
          <Skeleton className="h-[500px] w-full rounded-md" />
        )}

        <MaintenanceMode />

        {hasPermission && (
          <form.Subscribe
            selector={(state) => [state.canSubmit]}
            children={([canSubmit]) => (
              <SaveChangesButton
                id="general-form"
                action={updateOrgSettings}
                disabled={!canSubmit}
                open={confirmation}
                onOpenChange={setConfirmationOpen}
              />
            )}
          />
        )}
      </form>
    </SettingsLayout>
  );
}
