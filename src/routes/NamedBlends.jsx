import { useEffect, useMemo, useState } from "react";
import { PageTitle } from "../components/ui/PageTitle";
import { Input } from "../components/ui/FormInputs";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import { createBlendString, createDisplayBlendString } from "../lib/strings";
import { BlendForm } from "../components/forms/BlendForm";
import { Modal } from "../components/ui/Modal";
import { QuantityInput } from "../components/ui/QuantityInput";
import { showToast } from "../components/ui/Toast";
import { useSupabaseContext } from "../contexts/supabaseContext";

export const NamedBlends = () => {
  const {
    profile,
    namedMixes: mixes,
    loading,
    insertRow,
    updateRow,
    deleteRow,
  } = useSupabaseContext();

  const [search, setSearch] = useState("");
  const [mixModalIsOpen, setMixModalIsOpen] = useState(false);
  const [editMixId, setEditMixId] = useState(null);
  const [copyModalIsOpen, setCopyModalIsOpen] = useState(false);
  const [copyMixId, setCopyMixId] = useState(null);

  const access = useMemo(() => profile?.role?.name ?? null, [profile]);

  const filteredMixes = useMemo(() => {
    const searchTerms = search.trim().toLowerCase().split(" ");

    return loading || mixes == null
      ? null
      : mixes
          .sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            if (aName < bName) {
              return -1;
            }
            if (aName > bName) {
              return 1;
            }
            return 0;
          })
          .sort((a, b) => {
            if (!a.approved && b.approved) {
              return -1;
            }
            if (a.approved && !b.approved) {
              return 1;
            }
            return 0;
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
          autoFocus
          placeholder="Search blends..."
          className="w-full max-w-xl self-center"
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="flex w-full max-w-6xl flex-col divide-y divide-gray-400 self-center dark:divide-gray-600">
          {filteredMixes ? (
            filteredMixes.map((mix) => (
              <li
                key={mix.id}
                className="flex items-center justify-between gap-8 py-2 px-1"
              >
                <div>
                  {access === "admin" && (
                    <p
                      className={`font-semibold ${
                        mix.approved
                          ? "text-green-500 dark:text-green-400"
                          : "text-rose-500 dark:text-rose-400"
                      }`}
                    >
                      {mix.approved ? "Approved" : "Not Approved"}
                    </p>
                  )}
                  <p className="text-lg lg:text-xl">{mix.name}</p>
                  <p className="ml-1 text-gray-700 dark:text-gray-300">
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
                  {access === "manager" ||
                    (access === "admin" && (
                      <Button
                        variant="small secondary"
                        onClick={() => {
                          openMixModal(mix.id);
                        }}
                      >
                        Edit
                      </Button>
                    ))}
                  {access === "admin" && (
                    <Button
                      variant="small danger"
                      onClick={async () => {
                        const error = await deleteRow("named_mixes", mix.id);
                        if (error) {
                          showToast(
                            "Could not delete mix.",
                            "error",
                            "top-center"
                          );
                        }
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </li>
            ))
          ) : (
            <Spinner />
          )}
        </ul>
      </div>

      {/* edit/create named blend form */}
      <Modal isOpen={mixModalIsOpen} onClose={closeMixModal}>
        <BlendForm
          title={`${editMixId == null ? "Create" : "Update"} Named Blend`}
          onCancel={closeMixModal}
          onSubmit={async (mix) => {
            const error = await updateRow("named_mixes", mix);
            if (error) {
              showToast(
                error.code === "23505"
                  ? "This name already exists."
                  : "Error updating mix.",
                "error",
                "top-center"
              );
            } else {
              closeMixModal();
            }
          }}
          namedMix={true}
          showSpinner={false}
          editMix={mixes.find((mix) => mix.id === editMixId)}
        />
      </Modal>

      {/* copy blend form to get bottle count and nicotine level */}
      <Modal isOpen={copyModalIsOpen} onClose={closeCopyModal}>
        <BlendForm
          title="Copy Named Blend"
          onCancel={closeCopyModal}
          onSubmit={async (mix) => {
            try {
              await navigator.clipboard.writeText(createBlendString(mix));
              showToast("Copied to clipboard!", "success");
            } catch (error) {
              showToast("Error copying to clipboard. Try again.", "error");
            }
            closeCopyModal();
          }}
          namedMix={true}
          copyNamedMix={true}
          showSpinner={false}
          editMix={mixes.find((mix) => mix.id === copyMixId)}
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
