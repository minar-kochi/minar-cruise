"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/**
 * A row in the editor. `rowId` is a stable client-side key — a brand-new item
 * has no database id yet, and using the array index as the key would make dnd-kit
 * reorder the wrong row.
 */
type EditorItem = {
  rowId: string;
  id?: string;
  label: string;
  isVisible: boolean;
};

let rowCounter = 0;
const nextRowId = () => `new-${rowCounter++}`;

function SortableRow({
  item,
  onChange,
  onRemove,
}: {
  item: EditorItem;
  onChange: (patch: Partial<EditorItem>) => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.rowId });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 rounded-lg border bg-background p-3",
        { "opacity-60 shadow-lg": isDragging },
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        aria-label={`Reorder ${item.label || "amenity"}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-5" />
      </button>

      <Input
        value={item.label}
        placeholder="e.g. Live music performances"
        onChange={(e) => onChange({ label: e.target.value })}
        className={cn("flex-1", { "opacity-50": !item.isVisible })}
      />

      <div className="flex shrink-0 items-center gap-2">
        <Checkbox
          id={`vis-${item.rowId}`}
          checked={item.isVisible}
          onCheckedChange={(checked) =>
            onChange({ isVisible: checked === true })
          }
        />
        <Label htmlFor={`vis-${item.rowId}`} className="text-sm font-normal">
          Show
        </Label>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        aria-label={`Remove ${item.label || "amenity"}`}
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
    </div>
  );
}

export default function PackageAmenitiesEditor({
  packageId,
}: {
  packageId: string;
}) {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.packages.getPackageContent.useQuery({
    id: packageId,
  });

  const [items, setItems] = useState<EditorItem[]>([]);

  useEffect(() => {
    if (!data) return;
    setItems(
      data.amenities.items.map((item) => ({
        rowId: item.id,
        id: item.id,
        label: item.label,
        isVisible: item.isVisible,
      })),
    );
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { mutate: save, isPending } =
    trpc.admin.packages.updateAmenityItems.useMutation({
      onError(error) {
        toast.error(error.message, { duration: 6000 });
      },
      async onSuccess() {
        toast.success("Amenities updated — public pages revalidated");
        await utils.admin.packages.getPackageContent.invalidate({
          id: packageId,
        });
      },
    });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((current) => {
      const from = current.findIndex((i) => i.rowId === active.id);
      const to = current.findIndex((i) => i.rowId === over.id);
      if (from === -1 || to === -1) return current;
      return arrayMove(current, from, to);
    });
  }

  function handleSave() {
    const cleaned = items
      .map((item) => ({ ...item, label: item.label.trim() }))
      .filter((item) => item.label.length > 0);

    if (cleaned.length !== items.length) {
      toast.error("Remove or fill in the blank amenities first.");
      return;
    }

    save({
      packageId,
      items: cleaned.map(({ id, label, isVisible }) => ({
        id,
        label,
        isVisible,
      })),
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Amenities</CardTitle>
        <CardDescription>
          Drag to reorder — this is the order customers see. Unticking{" "}
          <span className="font-medium">Show</span> hides a bullet from the site
          without deleting it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No amenities yet. Add the first one below.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items.map((i) => i.rowId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {items.map((item, index) => (
                  <SortableRow
                    key={item.rowId}
                    item={item}
                    onChange={(patch) =>
                      setItems((current) =>
                        current.map((row, i) =>
                          i === index ? { ...row, ...patch } : row,
                        ),
                      )
                    }
                    onRemove={() =>
                      setItems((current) =>
                        current.filter((_, i) => i !== index),
                      )
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() =>
            setItems((current) => [
              ...current,
              { rowId: nextRowId(), label: "", isVisible: true },
            ])
          }
        >
          <Plus className="mr-2 size-4" />
          Add amenity
        </Button>

        <Button
          type="button"
          className="w-full"
          disabled={isPending}
          onClick={handleSave}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Saving
            </>
          ) : (
            "Save amenities"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
