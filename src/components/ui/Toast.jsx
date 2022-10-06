import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

const animations = {
  top: { enter: "animate-enter-top", leave: "animate-leave-top" },
  bottom: { enter: "animate-enter-bottom", leave: "animate-leave-bottom" },
  left: { enter: "animate-enter-left", leave: "animate-leave-left" },
  right: { enter: "animate-enter-right", leave: "animate-leave-right" },
};

export const showToast = (
  msg,
  type = "notify",
  position = "top-right",
  duration = 3000
) =>
  toast.custom(
    (t) => (
      <div
        className={twMerge(
          "rounded-md p-3 font-semibold text-gray-900 shadow-lg",
          t.visible
            ? animations[position.split("-")[1]]?.enter ||
                animations[position.split("-")[0]]?.enter
            : animations[position.split("-")[1]]?.leave ||
                animations[position.split("-")[0]]?.leave,
          type === "notify" && "bg-violet-400",
          type === "success" && "bg-green-400",
          type === "error" && "bg-rose-400"
        )}
      >
        {msg}
      </div>
    ),
    {
      duration,
      position,
    }
  );
