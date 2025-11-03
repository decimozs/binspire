import { formatLabel } from "@binspire/shared";
import { Minus, Plus } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props<T extends Record<string, any>> {
  prevValues?: T;
  newValues?: T;
  excludedKeys?: string[];
}

export default function ComparedChanges<T extends Record<string, any>>({
  prevValues,
  newValues,
  excludedKeys = ["createdAt", "updatedAt"],
}: Props<T>) {
  const changedKeys = Object.keys(newValues || {})
    .filter((key) => prevValues?.[key] !== newValues?.[key])
    .filter((key) => !excludedKeys.includes(key));

  return (
    <div className="border-dashed rounded-md border-[1px]">
      {changedKeys.length === 0 ? (
        <p className="text-sm text-gray-500 px-4 py-2">No changes detected</p>
      ) : (
        <div>
          {changedKeys.map((key, index) => (
            <div key={key} className="grid grid-cols-2 text-sm">
              <div
                className={`text-red-500 border-r-[1px] border-dashed ${
                  index !== changedKeys.length - 1 ? "border-b-[1px]" : ""
                }`}
              >
                <div className="grid grid-cols-[20px_1fr] items-center px-4 py-2">
                  <Minus size={15} className="mr-2 -ml-1" />
                  <p className="ml-2">
                    <span className="font-bold">{formatLabel(key)}:</span>{" "}
                    {key === "email"
                      ? String(prevValues?.[key])
                      : formatLabel(
                          String(prevValues?.[key]).replace(/_/g, " "),
                        )}
                  </p>
                </div>
              </div>

              <div
                className={`text-green-500 flex flex-row items-center gap-2 border-dashed ${
                  index !== changedKeys.length - 1 ? "border-b-[1px]" : ""
                }`}
              >
                <div className="grid grid-cols-[20px_1fr] items-center px-4 py-2">
                  <Plus size={15} className="-ml-1" />
                  <p className="ml-1">
                    <span className="font-bold">{formatLabel(key)}:</span>{" "}
                    {key === "email"
                      ? String(newValues?.[key])
                      : formatLabel(
                          String(newValues?.[key]).replace(/_/g, " "),
                        )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
