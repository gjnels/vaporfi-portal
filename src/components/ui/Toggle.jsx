import { Switch } from "@headlessui/react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export const Toggle = ({
  enabled,
  onChange,
  title,
  titleClassName,
  divClassName,
}) => {
  return (
    <div className={twMerge("flex items-center gap-2", divClassName)}>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={twMerge(
          "focus-visible:outline-opacity-80 inline-flex h-[1.25em] w-[2.25em] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow transition  focus:outline-none focus-visible:outline-2 focus-visible:outline-gray-800 active:bg-opacity-75 focus-visible:dark:outline-gray-100",
          enabled ? "bg-green-500" : "bg-gray-400 dark:bg-gray-500"
        )}
      >
        <span className="sr-only">{`Toggle ${title} ${
          enabled ? "off" : "on"
        }`}</span>
        <span
          aria-hidden="true"
          className={twMerge(
            "h-[1em] w-[1em] rounded-full bg-gray-100 shadow transition",
            enabled && "translate-x-[1em]"
          )}
        ></span>
      </Switch>
      <span className={twMerge(titleClassName)}>{title}</span>
    </div>
  );
};
