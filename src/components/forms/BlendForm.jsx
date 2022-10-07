import { useCallback, useEffect, useMemo, useState } from "react";
import { Input, Select } from "../ui/FormInputs";
import { QuantityInput } from "../ui/QuantityInput";
import { Spinner } from "../ui/Spinner";
import { Button } from "../ui/Button";
import { Toggle } from "../ui/Toggle";
import { useSupabaseContext } from "../../contexts/supabaseContext";

const createSelectOptions = (flavors = []) =>
  flavors.map((flavor) => ({
    id: flavor.id,
    value: flavor.flavor,
    group: flavor.category.name,
  }));

const shots = [
  { id: 1, value: 1, label: "Single Shot" },
  { id: 2, value: 2, label: "Double Shot" },
  { id: 3, value: 3, label: "Triple Shot" },
];

export const BlendForm = ({
  title,
  editMix,
  onSubmit,
  onCancel,
  showSpinner = true,
  namedMix = false,
  copyNamedMix = false,
  admin = false,
}) => {
  const {
    flavors,
    flavorCategories: categories,
    loading,
  } = useSupabaseContext();

  const [bottleCount, setBottleCount] = useState(1);
  const [nicotine, setNicotine] = useState("");
  const [mix, setMix] = useState({
    name: "",
    blend: [{ flavor: "", shots: "" }],
  });

  useEffect(() => {
    setBottleCount((prev) => editMix?.bottleCount ?? 1);
    setNicotine((prev) => editMix?.nicotine ?? "");
    setMix(
      (prev) =>
        editMix ?? {
          name: "",
          blend: [{ flavor: "", shots: "" }],
        }
    );
  }, [editMix]);

  const flavorCount = useMemo(() => mix.blend.length, [mix]);

  useEffect(() => {
    if (flavorCount === 3) {
      setMix((prev) => ({
        ...prev,
        blend: prev.blend.map((value) => ({ ...value, shots: 1 })),
      }));
    }
  }, [flavorCount]);

  const availableFlavors = useCallback(
    (index) =>
      flavors.filter(({ flavor }) =>
        mix.blend
          .filter((_, i) => i !== index)
          .every(({ flavor: selectedFlavor }) => flavor !== selectedFlavor)
      ),
    [mix, flavors]
  );

  const availableShots = useCallback(
    (index) => {
      switch (flavorCount) {
        case 1:
          return shots;
        case 2:
          return mix.blend.find((_, i) => i !== index).shots === 2
            ? shots.slice(0, 1)
            : shots.slice(0, 2);
        case 3:
          return shots.slice(0, 1);
      }
    },
    [mix, flavorCount]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMix =
      namedMix && !copyNamedMix
        ? { ...editMix, ...mix }
        : { ...editMix, ...mix, bottleCount, nicotine };
    if (onSubmit != null) onSubmit(newMix);
  };

  return (
    <div>
      <h2 className="mb-4 text-center text-xl font-semibold lg:text-2xl">
        {title}
      </h2>
      {loading ? (
        showSpinner && <Spinner />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-lg flex-col gap-6 rounded-md"
        >
          {namedMix && (
            <Input
              id="name"
              label="Name"
              disabled={copyNamedMix}
              value={mix.name}
              onChange={(e) => setMix({ ...mix, name: e.target.value })}
            />
          )}
          <div className="flex flex-col gap-3">
            {!copyNamedMix && (
              <QuantityInput
                className="-mb-2"
                title="Number of Flavors"
                count={flavorCount}
                decrease={() => {
                  if (flavorCount > 1) {
                    setMix((prev) => ({
                      ...prev,
                      blend: prev.blend.slice(0, -1),
                    }));
                  }
                }}
                increase={() => {
                  if (flavorCount < 3) {
                    setMix((prev) => ({
                      ...prev,
                      blend: [...prev.blend, { flavor: "", shots: "" }],
                    }));
                  }
                }}
              />
            )}
            {mix.blend.map(({ flavor, shots }, index) => (
              <div key={index} className="flex gap-2">
                <Select
                  required={true}
                  disabled={copyNamedMix}
                  notSelectedValue="Select a flavor"
                  optionGroups={categories}
                  options={createSelectOptions(availableFlavors(index))}
                  value={flavor}
                  onChange={(e) =>
                    setMix((prev) => ({
                      ...prev,
                      blend: prev.blend.map((p, i) =>
                        i === index ? { ...p, flavor: e.target.value } : p
                      ),
                    }))
                  }
                  label={`Flavor ${index + 1}`}
                  id={`flavor_${index + 1}`}
                  className="flex-1"
                />
                <Select
                  required={true}
                  disabled={copyNamedMix}
                  notSelectedValue="Select shots"
                  options={availableShots(index)}
                  value={shots}
                  onChange={(e) => {
                    setMix((prev) => ({
                      ...prev,
                      blend: prev.blend.map((p, i) =>
                        i === index ? { ...p, shots: +e.target.value || "" } : p
                      ),
                    }));
                  }}
                  label={`Shots`}
                  id={`shots_${index + 1}`}
                />
              </div>
            ))}
          </div>
          {namedMix && !copyNamedMix ? (
            admin && (
              <Toggle
                enabled={mix.approved}
                onChange={(enabled) =>
                  setMix((prev) => ({ ...prev, approved: enabled }))
                }
                title="Approved"
              />
            )
          ) : (
            <>
              <Input
                required={true}
                value={nicotine}
                onChange={(e) => {
                  const nic =
                    e.target.value === "" ||
                    isNaN(+e.target.value) ||
                    +e.target.value < 0
                      ? ""
                      : +e.target.value;
                  setNicotine(nic);
                }}
                unit="mg"
                id="nicotine"
                label="Nicotine Level"
                type="number"
                step="any"
                min={0}
              />
              <QuantityInput
                title="Number of Bottles"
                count={bottleCount}
                decrease={() => {
                  bottleCount > 1 && setBottleCount((prev) => prev - 1);
                }}
                increase={() => {
                  bottleCount < 99 && setBottleCount((prev) => prev + 1);
                }}
              />
            </>
          )}
          <div className="flex gap-4 self-center">
            <Button type="submit">
              {copyNamedMix ? "Submit" : editMix ? "Update" : "Create"}
            </Button>
            {onCancel && (
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              variant="danger"
              onClick={() => {
                setBottleCount((prev) => 1);
                setNicotine((prev) => "");
                if (!copyNamedMix) {
                  setMix((prev) => ({
                    ...mix,
                    name: "",
                    blend: [{ flavor: "", shots: "" }],
                  }));
                }
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
