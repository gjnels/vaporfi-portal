import toast from "react-hot-toast";

export const showToast = (msg, duration = 3000) =>
  toast.custom(
    (t) => (
      <div
        className={`rounded-md bg-gray-600 p-3 text-gray-100 shadow-md dark:bg-gray-300 dark:text-gray-900 ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        {msg}
      </div>
    ),
    {
      duration,
    }
  );
