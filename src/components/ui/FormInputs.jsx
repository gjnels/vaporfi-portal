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
  inlineElement,
  ...props
}) => {
  return (
    options && (
      <div className={twMerge(props.disabled && "text-gray-400", className)}>
        {label && (
          <label
            className={twMerge(
              "ml-1",
              !props.disabled && "cursor-pointer",
              labelClassName
            )}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <div className="flex gap-2">
          <select
            id={id}
            className={twMerge(
              "w-full rounded-md border-2 border-gray-500 bg-gray-800 py-2 pl-3 pr-9 text-sm shadow transition lg:text-base",
              !props.disabled &&
                "cursor-pointer hover:border-gray-100 focus:border-green-400 focus:outline-none focus:ring-0 focus-visible:outline-none",
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
          {inlineElement}
        </div>
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
  inlineElement,
  ...props
}) => {
  return (
    <div
      className={twMerge("grow", props.disabled && "text-gray-400", className)}
    >
      {label && (
        <label
          className={twMerge(
            "ml-1",
            !props.disabled && "cursor-pointer",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <div
          className={twMerge(
            "flex grow overflow-hidden rounded-md border-2 border-gray-500 shadow transition",
            !props.disabled &&
              "focus-within:border-green-400 hover:border-gray-100",
            inputGroupClassname
          )}
        >
          <input
            type={type}
            className={twMerge(
              "w-full appearance-none border-none bg-gray-800 py-2 px-3 text-sm autofill:bg-transparent focus:outline-none focus:ring-0 focus-visible:outline-none lg:text-base",
              inputClassName
            )}
            {...props}
          />
          {unit && (
            <span className="pointer-events-none flex items-center justify-center bg-gray-700 px-4 text-gray-400">
              {unit}
            </span>
          )}
        </div>
        {inlineElement}
      </div>
    </div>
  );
};
