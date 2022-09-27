import { useState } from "react";
import { PageTitle } from "../components/PageTitle";
import { Select } from "../components/ui/Select";
import { useFlavors } from "../contexts/flavorsContext";

export const FlavorPicker = () => {
  const {
    flavors: [flavors, flavorsLoading],
    categories: [categories, categoriesLoading],
    namedBlends: [namedBlends, namedBlendsLoading],
  } = useFlavors();
  const [selected, setSelected] = useState("");
  return (
    <>
      <PageTitle title="Flavor Picker" />
      <div className="grid grid-cols-1 justify-items-center lg:grid-cols-2">
        <div>
          <Select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            optionGroups={categories}
            options={flavors.map((flavor) => ({
              id: flavor.id,
              value: flavor.flavor,
              group: flavor.category.name,
            }))}
          />
        </div>
        <div>created blends</div>
      </div>
    </>
  );
};
