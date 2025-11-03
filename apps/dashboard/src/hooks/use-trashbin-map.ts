import { parseAsBoolean, parseAsJson, useQueryState } from "nuqs";
import { useCallback, useState } from "react";
import z from "zod";

const schema = z.object({
  type: z.string().nullable(),
  id: z.union([z.string(), z.null()]),
});

const CLOSE_DELAY = 400;

export function useTrashbinMap() {
  const [viewFromMap, setViewFromMap] = useQueryState(
    "view_from_map",
    parseAsJson(schema).withDefault({ type: null, id: null }),
  );

  const [availableCollectors, setAvailableCollectors] = useQueryState(
    "available_collectors",
    parseAsBoolean.withDefault(false),
  );

  const [isClosing, setIsClosing] = useState(false);
  const [isClosingCollectors, setIsClosingCollectors] = useState(false);

  const open =
    viewFromMap.type === "trashbin" && !!viewFromMap.id && !isClosing;

  const collectorsOpen = availableCollectors || isClosingCollectors;

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setIsClosingCollectors(true);
    setTimeout(() => {
      setViewFromMap({ type: null, id: null });
      setAvailableCollectors(false);
      setIsClosingCollectors(false);
      setIsClosing(false);
    }, CLOSE_DELAY);
  }, [setViewFromMap]);

  const handleOpen = useCallback(
    (id: string) => {
      setViewFromMap({ type: "trashbin", id });
    },
    [setViewFromMap],
  );

  const clearAll = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setViewFromMap({ type: null, id: null });
      setIsClosing(false);
    }, CLOSE_DELAY);
  }, [setViewFromMap]);

  const handleOpenAvailableCollectors = useCallback(() => {
    setAvailableCollectors(true);
  }, [setAvailableCollectors]);

  const handleCloseAvailableCollectors = useCallback(() => {
    setIsClosingCollectors(true);
    setTimeout(() => {
      setAvailableCollectors(false);
      setIsClosingCollectors(false);
    }, CLOSE_DELAY);
  }, [setAvailableCollectors]);

  const toggleAvailableCollectors = useCallback(() => {
    if (collectorsOpen) {
      handleCloseAvailableCollectors();
    } else {
      handleOpenAvailableCollectors();
    }
  }, [
    collectorsOpen,
    handleCloseAvailableCollectors,
    handleOpenAvailableCollectors,
  ]);

  return {
    open,
    viewFromMap,
    setViewFromMap,
    handleOpen,
    handleClose,
    clearAll,
    isClosing,
    collectorsOpen,
    availableCollectors,
    isClosingCollectors,
    setAvailableCollectors,
    handleOpenAvailableCollectors,
    handleCloseAvailableCollectors,
    toggleAvailableCollectors,
  };
}
