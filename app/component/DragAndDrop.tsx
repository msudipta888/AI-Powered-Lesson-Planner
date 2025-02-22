import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { SortableBlock } from './SortableBlock';

interface DndEditorProps {
  contentBlocks: string[];
  setContentBlocks: React.Dispatch<React.SetStateAction<string[]>>;
  handleBlockUpdate: (index: number, newContent: string) => void;
  cleanText: (text: string) => string;
}

export const DndEditor: React.FC<DndEditorProps> = ({
  contentBlocks,
  setContentBlocks,
  handleBlockUpdate,
  cleanText,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    setContentBlocks((prev) => {
      const oldIndex = prev.findIndex((_, idx) => `block-${idx}` === active.id);
      const newIndex = prev.findIndex((_, idx) => `block-${idx}` === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={contentBlocks.map((_, idx) => `block-${idx}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {contentBlocks.map((block, index) => (
            <SortableBlock
              key={`block-${index}`}
              id={`block-${index}`}
              index={index}
              content={cleanText(block)}
              onChange={handleBlockUpdate}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};