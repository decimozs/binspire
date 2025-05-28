import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

const translations = {
  en: { greeting: "Hello!", settings: "Settings" },
  fr: { greeting: "Bonjour!", settings: "Paramètres" },
  de: { greeting: "Hallo!", settings: "Einstellungen" },
  es: { greeting: "¡Hola!", settings: "Configuración" },
  pt: { greeting: "Olá!", settings: "Configurações" },
  ru: { greeting: "Привет!", settings: "Настройки" },
  ja: { greeting: "こんにちは!", settings: "設定" },
  ko: { greeting: "안녕하세요!", settings: "설정" },
  zh: { greeting: "你好！", settings: "设置" },
};

export default function LanguageSettings() {
  const [selected, setSelected] = useState<string>("en");
  const [open, setOpen] = useState(false);
  const current = translations[selected];

  const handleSelect = (value: string) => {
    setSelected(value);
    setOpen(false); // ✅ close the popover
  };

  return (
    <div className="p-4 space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={`w-full justify-between ${
              !selected ? "text-muted-foreground" : ""
            }`}
          >
            {languages.find((language) => language.value === selected)?.label ||
              "Select language"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search language..." className="h-9" />
            <CommandList>
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                {languages.map((language) => (
                  <CommandItem
                    key={language.value}
                    value={language.label}
                    onSelect={() => handleSelect(language.value)}
                  >
                    {language.label}
                    <Check
                      className={`ml-auto ${
                        language.value === selected
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="text-center">
        <h1 className="text-2xl font-bold">{current.greeting}</h1>
        <p className="text-muted-foreground">{current.settings}</p>
      </div>
    </div>
  );
}
