import React from 'react';
import { TaskCategory } from '../enum/TaskCategory.enum';

export const TaskCategorySelect: React.FC<{
  className?: string;
  value?: TaskCategory | '';
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}> = ({ className = '', value, onChange = () => {} }) => {
  return (
    <select
      className={`select select-bordered font-normal ${className}`}
      name="category"
      id="category"
      required
      value={value}
      onChange={onChange}
      defaultValue=""
    >
      <option disabled value="">Please choose a category</option>
      {Object.keys(TaskCategory).map((category) => (
        <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
      ))}
    </select>
  )
}
