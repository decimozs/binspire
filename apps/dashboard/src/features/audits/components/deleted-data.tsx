import { formatCamelCase } from "@binspire/shared";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface DeletedDataProps {
  deletedValues: Record<string, any>;
  excludeKeys?: string[];
  formatLabel?: (key: string) => string;
}

export default function DeletedData({
  deletedValues,
  excludeKeys = ["createdAt", "updatedAt"],
}: DeletedDataProps) {
  const keys = Object.keys(deletedValues).filter(
    (key) => !excludeKeys.includes(key),
  );

  return (
    <div className="border-dashed rounded-md border-[1px]">
      {keys.length === 0 ? (
        <p className="text-sm text-gray-500 px-4 py-2">No deleted data</p>
      ) : (
        <div>
          {keys.map((key, index) => (
            <div
              key={key}
              className={`grid grid-cols-[200px_1fr] border-dashed ${
                index !== keys.length - 1 ? "border-b-[1px]" : ""
              }`}
            >
              <div className="flex flex-row items-center px-4 py-2 text-red-500">
                <span className="font-bold">
                  {key === "email" ? "Email" : formatCamelCase(key)}:
                </span>
              </div>
              <div className="flex flex-row items-center px-4 py-2 text-red-500">
                <p className="capitalize truncate max-w-[250px]">
                  {String(deletedValues[key])}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
