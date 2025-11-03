import { useReviewChangesStore } from "@/store/review-changes-store";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect } from "react";

interface UseEditDialogProps<T> {
  defaultValues: T;
  updatedValues: Partial<T>;
  isFormChange: boolean;
}

export const useEditDialog = <T>({
  defaultValues,
  updatedValues,
  isFormChange,
}: UseEditDialogProps<T>) => {
  const [editMode, setEditMode] = useQueryState(
    "is_editing",
    parseAsBoolean.withDefault(false),
  );
  const [isFormDirty, setIsFormDirty] = useQueryState(
    "is_form_dirty",
    parseAsBoolean.withDefault(false),
  );
  const { prevValue, setPrevValue, setNewValue, reset } =
    useReviewChangesStore();

  const handleResetEditState = () => {
    setEditMode(false);
    setIsFormDirty(false);

    const resetFn = reset;
    setTimeout(() => {
      resetFn();
    }, 400);
  };

  useEffect(() => {
    if (!prevValue) {
      setPrevValue(defaultValues);
    }
  }, [defaultValues]);

  useEffect(() => {
    setNewValue(updatedValues);
  }, [updatedValues]);

  useEffect(() => {
    setIsFormDirty(!isFormChange);
  }, [isFormChange]);

  return {
    editMode,
    setEditMode,
    isFormDirty,
    setIsFormDirty,
    handleResetEditState,
  };
};
