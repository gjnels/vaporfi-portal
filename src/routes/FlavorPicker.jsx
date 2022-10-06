import { useState } from "react";
import { BlendForm } from "../components/forms/BlendForm";
import { PageTitle } from "../components/ui/PageTitle";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { v4 as uuid } from "uuid";
import { Button } from "../components/ui/Button";
import { createBlendString } from "../lib/strings";
import { showToast } from "../components/ui/Toast";

const MAX_MIXES = 10;

export const FlavorPicker = () => {
  const { get, set } = useLocalStorage("vf-custom-blends");
  const [mixes, setMixes] = useState(get());
  const [editMixId, setEditMixId] = useState(null);

  const onBlendSubmit = (mix) => {
    const newMix = editMixId === null ? { ...mix, id: uuid() } : mix;
    const updatedMixes = [
      newMix,
      ...mixes.filter((m) => m.id !== newMix.id),
    ].slice(0, MAX_MIXES);
    setMixes(updatedMixes);
    set(updatedMixes);
    setEditMixId(null);
  };

  const onBlendCancel = () => {
    setEditMixId(null);
  };

  return (
    <>
      <PageTitle title="Flavor Picker" />
      <div className="grid grid-cols-1 justify-items-center gap-12 xl:grid-cols-2 xl:gap-8">
        <BlendForm
          onSubmit={onBlendSubmit}
          onCancel={onBlendCancel}
          title={`${editMixId ? "Edit" : "Create"} Custom Mix`}
          editMix={mixes.find((mix) => mix.id === editMixId)}
        />
        <div className="flex w-full flex-col items-center gap-4">
          <h2 className="text-center text-lg font-semibold lg:text-xl">
            Your Custom Mixes
          </h2>
          {mixes.length ? (
            <ul className="w-full max-w-xl divide-y divide-gray-600">
              {mixes.map((mix) => (
                <li
                  key={mix.id}
                  className="flex w-full items-center justify-between gap-4 py-4"
                >
                  <p>{createBlendString(mix)}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="small"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(
                            createBlendString(mix)
                          );
                          showToast("Copied to clipboard!");
                        } catch (error) {
                          showToast("Error copying to clipboard. Try again.");
                        }
                      }}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="small secondary"
                      onClick={() => setEditMixId(mix.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="small danger"
                      onClick={() => {
                        const newMixes = mixes.filter((m) => m.id !== mix.id);
                        setMixes(newMixes);
                        set(newMixes);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <i className="text-gray-500">No created mixes.</i>
          )}
        </div>
      </div>
    </>
  );
};
