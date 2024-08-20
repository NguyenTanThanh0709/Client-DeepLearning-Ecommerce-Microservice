import React from 'react'

interface SelectProps {
  className?: string;
  name: string;
  options: { value: string, label: string }[];
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: React.FC<SelectProps> = ({ className, name, options, value, onChange }) => {
  return (
    <select
      name={name}
      className={`block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 ${className}`}
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default Select
