import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@binspire/ui/components/select";
import { Separator } from "@binspire/ui/components/separator";
import { Button } from "@binspire/ui/components/button";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import type { SettingType } from "./lib/types";
import { settingsConfig } from "./lib/constants";

export default function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSetting, setSelectedSetting] =
    useState<SettingType>("general");

  const handleSelectChange = (value: SettingType) => {
    setSelectedSetting(value);
    const selected = settingsConfig.find((s) => s.type === value);
    if (selected) navigate({ to: selected.url });
  };

  return (
    <MainLayout
      title="Settings"
      description="Configure your application preferences and settings."
    >
      <Separator className="mt-2" />
      <div className="mt-2">
        <div className="md:hidden">
          <Select value={selectedSetting} onValueChange={handleSelectChange}>
            <SelectTrigger className="w-full">
              <SelectValue className="text-xl font-medium" />
            </SelectTrigger>
            <SelectContent>
              {settingsConfig.map(({ type, label, icon: Icon }) => (
                <SelectItem
                  key={type}
                  value={type}
                  onClick={() => setSelectedSetting(type)}
                >
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="size-4" />}
                    <span>{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden md:flex flex-row items-center gap-4 lg:hidden">
          {settingsConfig.map(({ type, label, icon: Icon, url }) => (
            <Link key={type} to={url}>
              <Button
                size="sm"
                variant={location.pathname === url ? "secondary" : "outline"}
                className={location.pathname === url ? "text-primary" : ""}
              >
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="size-4" />}
                  <span>{label}</span>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="lg:grid grid-cols-[200px_1fr] gap-12">
        <div className="hidden lg:flex flex-col gap-2 mt-5">
          {settingsConfig.map(({ type, label, icon: Icon, url }) => (
            <Link key={type} to={url} className="w-full">
              <Button
                size="sm"
                variant={location.pathname === url ? "secondary" : "outline"}
                className={`w-full flex justify-start ${location.pathname === url ? "text-primary" : ""}`}
              >
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="size-4" />}
                  <span>{label}</span>
                </div>
              </Button>
            </Link>
          ))}
        </div>

        <Outlet />
      </div>
    </MainLayout>
  );
}
