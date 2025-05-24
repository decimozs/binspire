export default function SecuritySettings() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium">Session Timeout (minutes)</label>
        <input
          type="number"
          defaultValue={30}
          min={1}
          className="mt-1 w-full border rounded-md p-2"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Password Minimum Length</label>
        <input
          type="number"
          defaultValue={8}
          min={6}
          className="mt-1 w-full border rounded-md p-2"
        />
      </div>
    </div>
  );
}
