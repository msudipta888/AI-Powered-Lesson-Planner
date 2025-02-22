import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { EditableSection } from './EditableSection';

interface SortableBlockProps {
  id: string;
  index: number;
  content: string;
  onChange: (index: number, newContent: string) => void;
}

export const SortableBlock: React.FC<SortableBlockProps> = ({
  id,
  index,
  content,
  onChange,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const handleContentChange = (newContent: string) => {
    onChange(index, newContent);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-2 p-3 bg-background rounded-md shadow-sm border transition-all group hover:shadow-md"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <EditableSection
          content={content}
          onChange={handleContentChange}
          isHeader={content.includes(':')}
        />
      </div>
    </div>
  );
};