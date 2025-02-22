import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface EditableSectionProps {
  content: string;
  onChange: (newContent: string) => void;
  isHeader: boolean;
}

export const EditableSection: React.FC<EditableSectionProps> = ({
  content,
  onChange,
  isHeader,
}) => {
  const [value, setValue] = useState(content);

  useEffect(() => {
    setValue(content);
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <Textarea
      value={value}
      onChange={handleChange}
      className={`w-full bg-transparent resize-none ${
        isHeader ? 'font-bold' : ''
      }`}
      rows={Math.max(2, value.split('\n').length)}
    />
  );
};