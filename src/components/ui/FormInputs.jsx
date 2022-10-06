import { twMerge } from "tailwind-merge";

export const Select = ({
  notSelectedValue,
  optionGroups,
  options,
  id,
  label,
  className,
  labelClassName,
  selectClassName,
  ...props
}) => {
  return (
    options && (
      <div className={className}>
        {label && (
          <label
            className={twMerge("ml-1 cursor-pointer", labelClassName)}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <select
          id={id}
          className={twMerge(
            "w-full cursor-pointer rounded-md border border-gray-400 bg-transparent py-2 px-3 pr-10 text-sm shadow transition hover:border-gray-800 focus:border-green-500 focus:outline-none focus:ring-0 focus-visible:outline-none dark:border-gray-500 hover:dark:border-gray-100 focus:dark:border-green-400 lg:text-base",
            selectClassName
          )}
          {...props}
        >
          <option value="">{notSelectedValue}</option>
          {optionGroups == null
            ? options.map((option) => (
                <option key={option.id} value={option.value}>
                  {option?.label ?? option.value}
                </option>
              ))
            : optionGroups.map((group) => (
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
      </div>
    )
  );
};

export const Input = ({
  type = "text",
  unit,
  id,
  label,
  className,
  labelClassName,
  inputClassName,
  inputGroupClassname,
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className={twMerge("ml-1 cursor-pointer", labelClassName)}>
          {label}
        </label>
      )}
      <div
        className={twMerge(
          "flex overflow-hidden rounded-md border border-gray-400 shadow transition focus-within:border-green-500 hover:border-gray-800 dark:border-gray-500 focus-within:dark:border-green-400 hover:dark:border-gray-100",
          inputGroupClassname
        )}
      >
        <input
          type={type}
          className={twMerge(
            "w-full appearance-none border-none bg-transparent py-2 px-3 text-sm autofill:bg-transparent focus:outline-none focus:ring-0 focus-visible:outline-none lg:text-base",
            inputClassName
          )}
          {...props}
        />
        {unit && (
          <span className="pointer-events-none flex items-center justify-center bg-gray-300 px-4 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};
