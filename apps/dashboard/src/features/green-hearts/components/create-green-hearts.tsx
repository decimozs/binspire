import { ShowToast } from "@/components/core/toast-notification";
import { updateUserGreenHeartSchema } from "@binspire/db/schema";
import {
  useGetAllUsers,
  UserGreenHeartApi,
  useUpdateUserGreenHeart,
} from "@binspire/query";
import { Button } from "@binspire/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@binspire/ui/components/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@binspire/ui/components/dialog";
import { Input } from "@binspire/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@binspire/ui/components/popover";
import { FormFieldError } from "@binspire/ui/forms";
import { cn } from "@binspire/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { Check, ChevronsUpDown, HeartPlus, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@binspire/ui/components/avatar";
import { formatLabel, getInitial } from "@binspire/shared";

const schema = updateUserGreenHeartSchema
  .pick({ totalKg: true, userId: true })
  .required({ totalKg: true, userId: true });

const categories = ["Plastic", "Paper", "Metal", "Glass"] as const;
type Category = (typeof categories)[number];

export default function CreateGreenHearts() {
  const action = useUpdateUserGreenHeart();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    "Plastic",
  );
  const { data: users } = useGetAllUsers();
  const { mutateAsync, isPending } = action;

  const [plasticKg, setPlasticKg] = useState(0);
  const [paperKg, setPaperKg] = useState(0);
  const [metalKg, setMetalKg] = useState(0);
  const [glassKg, setGlassKg] = useState(0);

  const form = useForm({
    defaultValues: { totalKg: 0, userId: "" },
    validators: { onSubmit: schema },
    onSubmit: async ({ value, formApi }) => {
      try {
        const total = plasticKg + paperKg + metalKg + glassKg;
        const userGreenHearts = await UserGreenHeartApi.getByUserId(
          value.userId,
        );

        if (userGreenHearts) {
          const currentPoints = userGreenHearts.points || 0;
          const currentTotalKg = userGreenHearts.totalKg || 0;

          const POINTS_PER_KG = {
            Plastic: 10,
            Paper: 5,
            Metal: 25,
            Glass: 8,
          };

          const earnedPoints =
            plasticKg * POINTS_PER_KG.Plastic +
            paperKg * POINTS_PER_KG.Paper +
            metalKg * POINTS_PER_KG.Metal +
            glassKg * POINTS_PER_KG.Glass;

          const newTotalKg = currentTotalKg + total;
          const newPoints = currentPoints + earnedPoints;

          await mutateAsync({
            userId: value.userId,
            data: {
              totalKg: newTotalKg,
              points: newPoints,
            },
          });
        }

        formApi.reset();
        setPlasticKg(0);
        setPaperKg(0);
        setMetalKg(0);
        setGlassKg(0);
        setSelectedCategory("Plastic");
        setValue("");
        ShowToast("success", "Donated successfully!");
      } catch {
        ShowToast("error", "Failed to donate. Please try again.");
      }
    },
  });

  const handleCategoryKgChange = (category: Category, value: number) => {
    switch (category) {
      case "Plastic":
        setPlasticKg(value);
        break;
      case "Paper":
        setPaperKg(value);
        break;
      case "Metal":
        setMetalKg(value);
        break;
      case "Glass":
        setGlassKg(value);
        break;
    }
  };

  const getCurrentKg = () => {
    switch (selectedCategory) {
      case "Plastic":
        return plasticKg;
      case "Paper":
        return paperKg;
      case "Metal":
        return metalKg;
      case "Glass":
        return glassKg;
      default:
        return 0;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="font-bold">
          <HeartPlus />
          Donate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          className="grid grid-cols-1 gap-4 w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Green Hearts Donation</DialogTitle>
            <DialogDescription>
              Here you can create green hearts to support our cause.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            <p>Name</p>
            <form.Field name="userId">
              {(field) => (
                <>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {value
                          ? users?.find((u) => u.id === value)?.name
                          : "Select User"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search user..."
                          className="h-9 w-[410px]"
                        />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {users?.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.name}
                                onSelect={() => {
                                  setValue(user.id);
                                  field.setValue(user.id);
                                  setOpen(false);
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar>
                                    <AvatarImage src={user.image || ""} />
                                    <AvatarFallback>
                                      {getInitial(user.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  {user.name}
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    value === user.id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormFieldError field={field} />
                </>
              )}
            </form.Field>
          </div>

          <div className="flex flex-col gap-2">
            <p>Category</p>
            <div className="flex flex-row gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  size="sm"
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  className="grow"
                >
                  {formatLabel(cat)}
                </Button>
              ))}
            </div>
          </div>

          {selectedCategory && (
            <div className="flex flex-col gap-2">
              <p>{selectedCategory} KG</p>
              <Input
                type="number"
                placeholder={`Enter ${selectedCategory.toLowerCase()} kilograms`}
                value={getCurrentKg() || ""}
                onChange={(e) =>
                  handleCategoryKgChange(
                    selectedCategory,
                    Number(e.target.value) || 0,
                  )
                }
                disabled={isPending}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="sm"
            disabled={isPending}
            onClick={() => form.handleSubmit()}
          >
            {isPending ? <Loader2 className="animate-spin" /> : "Donate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
