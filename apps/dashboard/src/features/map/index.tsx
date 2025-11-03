import GlobalMap from "./components/global-map";
import ViewTrashbin from "./components/view-trashbin";

export default function Map() {
  return (
    <div className="w-full h-screen fixed top-0 left-0 z-0">
      <GlobalMap />
      <ViewTrashbin />
    </div>
  );
}
