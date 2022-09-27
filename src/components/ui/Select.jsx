export const Select = ({ value, onChange, optionGroups, options }) => {
  console.log(optionGroups);
  return (
    <select
      value={value}
      onChange={onChange}
      className="focus-visible:outline-opacity-75 bg-gray-300 p-2 shadow focus:outline-none focus-visible:outline-2 focus-visible:outline-gray-800 dark:bg-gray-700 focus-visible:dark:outline-gray-100"
    >
      {optionGroups.map((group) => (
        <optgroup key={group.id} label={group.name}>
          {options
            .filter((option) => option.group === group.name)
            .map((option) => (
              <option key={option.id} value={option.value}>
                {option?.label ?? option.value}
              </option>
            ))}
        </optgroup>
      ))}
    </select>
  );
};
