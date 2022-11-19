import { useState } from "react";

export function useForm(initialData = {}) {
  const [data, setData] = useState(initialData);

  function handleChange(e) {
    const { name, value } = e.target;
    setData((current) => {
      return { ...current, [name]: value };
    });
  }

  return [data, handleChange, setData];
}
