import { useMemo, useState } from "react";
import { PageTitle } from "../components/ui/PageTitle";
import { Input } from "../components/ui/FormInputs";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import { createBlendString, createDisplayBlendString } from "../lib/strings";
import { BlendForm } from "../components/forms/BlendForm";
import { Modal } from "../components/ui/Modal";
import { showToast } from "../components/ui/Toast";
import { useSupabaseContext } from "../contexts/supabaseContext";
import { Pagination } from "../components/ui/Pagination";
import { useAccess } from "../hooks/useAccess";

export const NamedBlends = () => {
  const {
    namedMixes: mixes,
    loading,
    insertRow,
    updateRow,
    deleteRow,
  } = useSupabaseContext();

  const { accessByLevel } = useAccess();

  const [search, setSearch] = useState("");
  const [mixModalIsOpen, setMixModalIsOpen] = useState(false);
  const [editMixId, setEditMixId] = useState(null);
  const [copyModalIsOpen, setCopyModalIsOpen] = useState(false);
  const [copyMixId, setCopyMixId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const pageIndeces = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return [firstPageIndex, lastPageIndex];
  }, [currentPage]);

  const filteredMixes = useMemo(() => {
    const searchTerms = search.trim().toLowerCase().split(" ");

    return loading || mixes == null
      ? []
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
          .filter((mix) => (!accessByLevel(3) ? mix.approved : true))
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
    if (id) setEditMixId(id);
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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex w-full justify-between gap-8 self-center">
          {accessByLevel(2) && (
            <Button
              variant="small secondary"
              className="shrink-0"
              onClick={() => {
                openMixModal();
              }}
            >
              Create New Mix
            </Button>
          )}
          <Input
            type="search"
            autoFocus
            placeholder="Search blends..."
            className="w-full"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalCount={filteredMixes.length}
          onPageChange={setCurrentPage}
        />
        <ul className="flex w-full flex-col divide-y divide-gray-600 self-center">
          {filteredMixes.slice(...pageIndeces).map((mix) => (
            <li
              key={mix.id}
              className="flex items-center justify-between gap-8 py-2 px-1"
            >
              <div>
                {accessByLevel(3) && (
                  <p
                    className={`font-semibold ${
                      mix.approved ? "text-green-400" : "text-rose-400"
                    }`}
                  >
                    {mix.approved ? "Approved" : "Not Approved"}
                  </p>
                )}
                <p className="text-lg lg:text-xl">{mix.name}</p>
                <p className="ml-1 text-gray-400">
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
                {accessByLevel(2) && (
                  <Button
                    variant="small secondary"
                    onClick={() => {
                      openMixModal(mix.id);
                    }}
                  >
                    Edit
                  </Button>
                )}
                {accessByLevel(3) && (
                  <Button
                    variant="small danger"
                    onClick={async () => {
                      console.log(
                        confirm(`Are you sure you want to delete ${mix.name}?`)
                      );
                      return;
                      const error = await deleteRow("named_mixes", mix.id);
                      if (error) {
                        showToast("Could not delete blend.", { type: "error" });
                      } else {
                        showToast("Blend deleted successfully.", {
                          type: "success",
                        });
                      }
                    }}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* edit/create named blend form */}
      <Modal isOpen={mixModalIsOpen} onClose={closeMixModal}>
        <BlendForm
          title={`${editMixId ? "Update" : "Create"} Named Blend`}
          namedMix={true}
          showSpinner={false}
          editMix={mixes.find((mix) => mix.id === editMixId)}
          admin={accessByLevel(3)}
          onCancel={closeMixModal}
          onSubmit={async (mix) => {
            // if there is no editMixId, a mix is being created, not updated
            const error = editMixId
              ? await updateRow("named_mixes", mix)
              : await insertRow("named_mixes", mix);
            if (error) {
              showToast(
                error.code === "23505"
                  ? "This name already exists."
                  : editMixId
                  ? "Error updating blend."
                  : "Error creating blend.",
                { type: "error" }
              );
            } else {
              // mixes created without admin access are not approved and must wait approval by an admin
              showToast(
                editMixId
                  ? "Blend updated successfully."
                  : `Blend created successfully.${
                      !accessByLevel(3) ? "\nPending approval." : ""
                    }`,
                { type: "success" }
              );
              closeMixModal();
            }
          }}
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
              showToast("Copied to clipboard!", { type: "success" });
            } catch (error) {
              showToast("Error copying to clipboard. Try again.", {
                type: "error",
              });
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
