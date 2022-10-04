import { useCallback, useEffect, useState } from "react";
import { useFlavors } from "../../contexts/flavorsContext";
import { Input, Select } from "../ui/FormInputs";
import { QuantityInput } from "../ui/QuantityInput";
import { Spinner } from "../ui/Spinner";
import { Button } from "../ui/Button";

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

export const BlendForm = ({ title, mix, onSubmit, onCancel }) => {
  const {
    categories: [categories, categoriesLoading],
    flavors: [flavors, flavorsLoading],
  } = useFlavors();

  const [flavorCount, setFlavorCount] = useState(1);
  const [bottleCount, setBottleCount] = useState(1);
  const [nicotine, setNicotine] = useState("");
  const [selections, setSelections] = useState([{ flavor: "", shots: "" }]);

  // const [flavorCount, setFlavorCount] = useState(mix ? mix.blend.length : 1);
  // const [bottleCount, setBottleCount] = useState(mix ? mix.bottleCount : 1);
  // const [nicotine, setNicotine] = useState(mix ? mix.nicotine : "");
  // const [selections, setSelections] = useState(
  //   mix ? mix.blend : [{ flavor: "", shots: "" }]
  // );

  useEffect(() => {
    setFlavorCount((prev) => (mix ? mix.blend.length : 1));
    setBottleCount((prev) => (mix ? mix.bottleCount : 1));
    setNicotine((prev) => (mix ? mix.nicotine : ""));
    setSelections((prev) => (mix ? mix.blend : [{ flavor: "", shots: "" }]));
  }, [mix]);

  useEffect(() => {
    setSelections((prev) =>
      prev.map((selection) => ({
        ...selection,
        shots: flavorCount === 3 ? 1 : "",
      }))
    );
  }, [flavorCount]);

  const availableFlavors = useCallback(
    (index) =>
      flavors.filter(({ flavor }) =>
        selections
          .filter((_, i) => i !== index)
          .every(({ flavor: selectedFlavor }) => flavor !== selectedFlavor)
      ),
    [selections, flavors]
  );

  const availableShots = useCallback(
    (index) => {
      switch (flavorCount) {
        case 1:
          return shots;
        case 2:
          return selections.find((_, i) => i !== index).shots === 2
            ? shots.slice(0, 1)
            : shots.slice(0, 2);
        case 3:
          return shots.slice(0, 1);
      }
    },
    [selections, flavorCount]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMix = { ...mix, bottleCount, blend: selections, nicotine };
    onSubmit(newMix);
  };

  return (
    <div>
      <h2 className="mb-4 text-center text-xl font-semibold lg:text-2xl">
        {title}
      </h2>
      {categoriesLoading || flavorsLoading ? (
        <Spinner />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-lg flex-col gap-6 rounded-md"
        >
          <div className="flex flex-col gap-3">
            <QuantityInput
              className="-mb-2"
              title="Number of Flavors"
              count={flavorCount}
              decrease={() => {
                if (flavorCount > 1) {
                  setFlavorCount((prev) => prev - 1);
                  setSelections((prev) => prev.slice(0, -1));
                }
              }}
              increase={() => {
                if (flavorCount < 3) {
                  setFlavorCount((prev) => prev + 1);
                  setSelections((prev) => [...prev, { flavor: "", shots: "" }]);
                }
              }}
            />
            {selections.map((selection, index) => (
              <div key={index} className="flex gap-2">
                <Select
                  required={true}
                  notSelectedValue="Select a flavor"
                  optionGroups={categories}
                  options={createSelectOptions(availableFlavors(index))}
                  value={selection.flavor}
                  onChange={(e) =>
                    setSelections((prev) =>
                      prev.map((p, i) =>
                        i === index ? { ...p, flavor: e.target.value } : p
                      )
                    )
                  }
                  label={`Flavor ${index + 1}`}
                  id={`flavor_${index + 1}`}
                  className="flex-1"
                />
                <Select
                  required={true}
                  notSelectedValue="Select shots"
                  options={availableShots(index)}
                  value={selection.shots}
                  onChange={(e) => {
                    setSelections((prev) =>
                      prev.map((p, i) =>
                        i === index ? { ...p, shots: +e.target.value || "" } : p
                      )
                    );
                  }}
                  label={`Shots`}
                  id={`shots_${index + 1}`}
                />
              </div>
            ))}
          </div>
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
              console.log(nic);
              setNicotine(nic);
            }}
            // pattern="\d+"
            unit="mg"
            id="nicotine"
            label="Nicotine Level"
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
          <div className="flex gap-4 self-center">
            <Button type="submit">{mix ? "Update" : "Create"}</Button>
            {mix && (
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              type="reset"
              variant="danger"
              onClick={() => {
                setFlavorCount((prev) => 1);
                setBottleCount((prev) => 1);
                setNicotine((prev) => "");
                setSelections((prev) => [{ flavor: "", shots: "" }]);
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
