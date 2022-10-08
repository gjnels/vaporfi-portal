import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

const animations = {
  top: { enter: "animate-enter-top", leave: "animate-leave-top" },
  bottom: { enter: "animate-enter-bottom", leave: "animate-leave-bottom" },
  left: { enter: "animate-enter-left", leave: "animate-leave-left" },
  right: { enter: "animate-enter-right", leave: "animate-leave-right" },
};

export const showToast = (msg, options) => {
  const { type, ...toastOptions } = {
    type: "notify",
    position: "top-right",
    duration: 3000,
    ...options,
  };
  toast.custom(
    (t) => (
      <div
        className={twMerge(
          "max-w-md rounded-md p-3 font-semibold text-gray-100 shadow-lg",
          t.visible
            ? animations[toastOptions.position.split("-")[1]]?.enter ||
                animations[toastOptions.position.split("-")[0]]?.enter
            : animations[toastOptions.position.split("-")[1]]?.leave ||
                animations[toastOptions.position.split("-")[0]]?.leave,
          type === "notify" && "bg-violet-500",
          type === "success" && "bg-green-500 text-gray-900",
          type === "error" && "bg-rose-500"
        )}
      >
        <p className="whitespace-pre-wrap">{msg}</p>
      </div>
    ),
    toastOptions
  );
};
