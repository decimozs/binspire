import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import { ActiveUsersLevels } from "@/components/charts/active-users-levels";
import CollectionLevels from "@/components/charts/collection-levels";
import type {
  Trashbin,
  TrashbinCollection,
  TrashbinIssue,
  User,
} from "@/lib/types";
import { TrashbinActivesLevels } from "../charts/trashbin-actives-levels";

function DraggableChart({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function AnalyticsCharts({
  users,
  trashbins,
  collections,
  issues,
}: {
  users: User[];
  trashbins: Trashbin[];
  collections: TrashbinCollection;
  issues: TrashbinIssue;
}) {
  const [items, setItems] = useState(["active1", "active2", "trashbin"]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over?.id && over) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const renderChart = (id: string) => {
    switch (id) {
      case "active1":
        return <ActiveUsersLevels users={users} role="collector" />;
      case "active2":
        return <ActiveUsersLevels users={users} role="admin" />;
      case "trashbin":
        return <TrashbinActivesLevels trashbins={trashbins} />;
      default:
        return null;
    }
  };

  return (
    <main className="grid gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[300px_300px_1fr] gap-4">
            {items.map((id) => (
              <DraggableChart key={id} id={id}>
                {renderChart(id)}
              </DraggableChart>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <CollectionLevels collections={collections} issues={issues} />
    </main>
  );
}
