import { useMemo, useState } from "react";
import { useFlavors } from "../contexts/flavorsContext";
import { PageTitle } from "../components/ui/PageTitle";
import { Input } from "../components/ui/FormInputs";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import { createBlendString, createDisplayBlendString } from "../lib/strings";
import { useProfile } from "../contexts/profileContext";
import { BlendForm } from "../components/forms/BlendForm";
import { Modal } from "../components/ui/Modal";
import { QuantityInput } from "../components/ui/QuantityInput";
import { showToast } from "../components/ui/Toast";

export const NamedBlends = () => {
  const { profile, profileLoading } = useProfile();
  const {
    namedBlends: {
      namedBlends: mixes,
      namedBlendsLoading: loading,
      updateNamedBlend: update,
    },
  } = useFlavors();

  const [search, setSearch] = useState("");
  const [mixModalIsOpen, setMixModalIsOpen] = useState(false);
  const [editMixId, setEditMixId] = useState(null);
  const [copyModalIsOpen, setCopyModalIsOpen] = useState(false);
  const [copyMixId, setCopyMixId] = useState(null);

  const filteredMixes = useMemo(() => {
    const searchTerms = search.trim().toLowerCase().split(" ");

    return loading || mixes == null
      ? []
      : mixes
          .sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
          })
          .filter((mix) =>
            searchTerms.every(
              (term) =>
                mix.name.toLowerCase().includes(term) ||
                mix.blend.some(({ flavor }) =>
                  flavor.toLowerCase().includes(term)
                )
            )
          );
  }, [search, mixes]);

  const openMixModal = (id) => {
    setEditMixId(id);
    setMixModalIsOpen(true);
  };

  const closeMixModal = () => {
    setMixModalIsOpen(false);
    // timeout runs while modal is animating closing and prevents user from seeing the form update with no mix
    setTimeout(
      () => setEditMixId(null),
      import.meta.env.VITE_MODAL_CLOSE_TIMEOUT
    );
  };

  const openCopyModal = (id) => {
    setCopyMixId(id);
    setCopyModalIsOpen(true);
  };

  const closeCopyModal = () => {
    setCopyModalIsOpen(false);
    // timeout runs while modal is animating closing and prevents user from seeing the form update with no mix
    setTimeout(
      () => setCopyMixId(null),
      import.meta.env.VITE_MODAL_CLOSE_TIMEOUT
    );
  };

  return (
    <>
      <PageTitle title="Named Custom Blends" />
      <div className="flex flex-col gap-8">
        <Input
          type="search"
          placeholder="Search blends..."
          className="w-full max-w-xl self-center"
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="flex w-full max-w-6xl flex-col divide-y divide-gray-400 self-center dark:divide-gray-600">
          {loading ? (
            <Spinner />
          ) : (
            filteredMixes.map((mix) => (
              <li key={mix.id} className="flex items-center gap-4 py-2 px-1">
                {profile?.role?.name === "admin" && (
                  <Button
                    variant={`small ${mix.approved ? "danger" : ""}`}
                    onClick={async () => {
                      const error = await update({
                        ...mix,
                        approved: !mix.approved,
                      });
                      console.log(error);
                    }}
                  >
                    {mix.approved ? "Un-approve" : "Approve"}
                  </Button>
                )}
                <div className="flex-1">
                  <p className="text-lg lg:text-xl">{mix.name}</p>
                  <p className="ml-2 opacity-75">
                    {createDisplayBlendString(mix.blend)}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="small"
                    onClick={() => {
                      openCopyModal(mix.id);
                    }}
                  >
                    Copy
                  </Button>
                  <Button
                    variant="small secondary"
                    onClick={() => {
                      openMixModal(mix.id);
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="small danger">Delete</Button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* edit/create named blend form */}
      <Modal isOpen={mixModalIsOpen} onClose={closeMixModal}>
        <BlendForm
          title={`${editMixId == null ? "Create" : "Update"} Named Blend`}
          onCancel={closeMixModal}
          namedMix={true}
          showSpinner={false}
          mix={mixes.find((mix) => mix.id === editMixId)}
        />
      </Modal>

      {/* copy blend form to get bottle count and nicotine level */}
      <Modal isOpen={copyModalIsOpen} onClose={closeCopyModal}>
        <CopyMixForm
          mix={mixes.find((mix) => mix.id === copyMixId)}
          closeModal={closeCopyModal}
        />
      </Modal>
    </>
  );
};

const CopyMixForm = ({ mix, closeModal }) => {
  const [bottleCount, setBottleCount] = useState(1);
  const [nicotine, setNicotine] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const copyMix = { ...mix, bottleCount, nicotine };
    try {
      await navigator.clipboard.writeText(createBlendString(copyMix));
      showToast("Copied to clipboard!");
    } catch (error) {
      showToast("Error copying to clipboard. Try again.");
    }
    closeModal();
  };

  return (
    mix && (
      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <div>
          <p>{mix.name}</p>
          <p>{createDisplayBlendString(mix.blend)}</p>
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
            setNicotine(nic);
          }}
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
          <Button type="submit">Submit</Button>
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            type="reset"
            variant="danger"
            onClick={() => {
              setFlavorCount((prev) => 1);
              setNicotine((prev) => "");
            }}
          >
            Reset
          </Button>
        </div>
      </form>
    )
  );
};
