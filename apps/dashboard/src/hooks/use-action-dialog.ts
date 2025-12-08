import type { ActionsTypeManagement } from "@binspire/shared";
import { parseAsBoolean, parseAsJson, useQueryState } from "nuqs";
import { useCallback, useState } from "react";
import z from "zod";

export type ActionType = "view" | "delete" | "update" | "create" | "review";

export const ActionTypeSchema = z.enum([
  "view",
  "delete",
  "update",
  "create",
  "review",
]);

export const ActionDialogQuerySchema = z.object({
  type: z.string().nullable(),
  id: z.union([z.string(), z.null()]),
  action: z.array(ActionTypeSchema).default([]),
});

const CLOSE_DELAY = 400;

interface Keys {
  queryKey: ActionsTypeManagement;
  actionKey: ActionType;
}

export function useActionDialog(keys: Keys) {
  const { queryKey, actionKey } = keys;

  const [query, setQuery] = useQueryState(
    `${queryKey}_actionDialog`,
    parseAsJson(ActionDialogQuerySchema).withDefault({
      type: null,
      id: null,
      action: [],
    }),
  );
  const [editMode, setEditMode] = useQueryState(
    `${queryKey}_is_editing`,
    parseAsBoolean.withDefault(false),
  );
  const [reviewMode, setReviewMode] = useQueryState(
    `${queryKey}_is_reviewing`,
    parseAsBoolean.withDefault(false),
  );

  const [isClosing, setIsClosing] = useState(false);

  const open =
    query.type === query.type &&
    !!query.action?.includes(actionKey) &&
    !isClosing;

  const resetQuery = useCallback(() => {
    setQuery({ type: null, id: null, action: [] });
    setEditMode(false);
  }, [setQuery, setEditMode]);

  const removeAction = useCallback(
    (action: ActionType) => {
      setQuery((prev) => {
        if (!prev) return { type: null, id: null, action: [] };

        const newActions = prev.action?.filter((a) => a !== action);
        return {
          ...prev,
          action: newActions,
          ...(newActions?.length === 0 ? { type: null, id: null } : {}),
        };
      });

      if (editMode && action !== "update") setEditMode(false);
      if (action === "review") setReviewMode(false);
    },
    [editMode, setQuery, setEditMode, setReviewMode],
  );

  const handleClose = useCallback(() => {
    setIsClosing(true);

    setTimeout(() => {
      removeAction(actionKey);
      if (editMode) setEditMode(false);
      setIsClosing(false);
    }, CLOSE_DELAY);
  }, [removeAction, actionKey, editMode, setEditMode]);

  const clearAll = useCallback(() => {
    setIsClosing(true);

    setTimeout(() => {
      resetQuery();
      setIsClosing(false);
    }, CLOSE_DELAY);
  }, [resetQuery]);

  return {
    open,
    queryId: query.id,
    query,
    handleClose,
    setQuery,
    removeAction,
    clearAll,
    editMode,
    setEditMode,
    reviewMode,
    setReviewMode,
  };
}
