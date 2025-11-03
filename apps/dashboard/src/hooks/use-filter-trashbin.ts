import { parseAsString, useQueryState } from "nuqs";

export function useFilterTrashbin() {
  const [departmentQuery, setDepartmentQuery] = useQueryState(
    "trashbin_department",
    parseAsString.withDefault("general"),
  );
  const [wasteLevelQuery, setWasteLevelQuery] = useQueryState(
    "waste_level",
    parseAsString.withDefault("all"),
  );
  const [weightLevelQuery, setWeightLevelQuery] = useQueryState(
    "weight_level",
    parseAsString.withDefault("all"),
  );
  const [batteryLevelQuery, setBatteryLevelQuery] = useQueryState(
    "battery_level",
    parseAsString.withDefault("all"),
  );
  const [collectedQuery, setCollectedQuery] = useQueryState(
    "collected_status",
    parseAsString.withDefault("all"),
  );
  const [scheduledQuery, setScheduledQuery] = useQueryState(
    "scheduled_status",
    parseAsString.withDefault("all"),
  );
  const [operationalQuery, setOperationalQuery] = useQueryState(
    "operational_status",
    parseAsString.withDefault("all"),
  );
  const [archivedQuery, setArchivedQuery] = useQueryState(
    "archived_status",
    parseAsString.withDefault("all"),
  );

  return {
    departmentQuery,
    setDepartmentQuery,
    wasteLevelQuery,
    setWasteLevelQuery,
    weightLevelQuery,
    setWeightLevelQuery,
    batteryLevelQuery,
    setBatteryLevelQuery,
    collectedQuery,
    setCollectedQuery,
    scheduledQuery,
    setScheduledQuery,
    operationalQuery,
    setOperationalQuery,
    archivedQuery,
    setArchivedQuery,
  };
}
