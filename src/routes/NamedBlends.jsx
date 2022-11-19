import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { PageTitle } from "../components/ui/PageTitle";
import { Input } from "../components/ui/FormInputs";
import { Button } from "../components/ui/Button";
import { createBlendString, createDisplayBlendString } from "../lib/strings";
import { BlendForm, CopyBlendForm } from "../components/forms/BlendForm";
import { Modal } from "../components/ui/Modal";
import { showToast } from "../components/ui/Toast";
import { Pagination } from "../components/ui/Pagination";
import { useSupabaseRealtime } from "../hooks/useSupabaseRealtime";
import { Spinner } from "../components/ui/Spinner";

export function NamedBlends() {
  const { data: promos, loading: promosLoading } = useSupabaseRealtime(
    "promos",
    ["mix"]
  );
  const {
    data: mixes,
    loading: mixesLoading,
    remove: deleteMix,
  } = useSupabaseRealtime("named_mixes");

  const { canAccess } = useAuthContext();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [copyModalIsOpen, setCopyModalIsOpen] = useState(false);
  const [copyMixId, setCopyMixId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  const pageIndeces = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return [firstPageIndex, lastPageIndex];
  }, [currentPage]);

  const loading = promosLoading || mixesLoading;

  const filteredMixes = useMemo(() => {
    const searchTerms = search.trim().toLowerCase().split(" ");

    return loading || mixes == null
      ? []
      : mixes
          .map((mix) => {
            const promo = promos.find((promo) => promo?.mix?.id === mix.id);
            return { ...mix, promo };
          })
          // Sort alphabetically by name
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
          // Put unapproved blends at the top
          .sort((a, b) => {
            if (!a.approved && b.approved) {
              return -1;
            }
            if (a.approved && !b.approved) {
              return 1;
            }
            return 0;
          })
          // Put promotion blends at the top
          .sort((a, b) => {
            if (a.promo && !b.promo) {
              return -1;
            }
            if (!a.promo && b.promo) {
              return 1;
            }
            return 0;
          })
          // Change to new access function
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

  function openCopyModal(id) {
    setCopyMixId(id);
    setCopyModalIsOpen(true);
  }

  function closeCopyModal() {
    setCopyModalIsOpen(false);
    // timeout runs while modal is animating closing and prevents user from seeing the form update with no mix
    setTimeout(
      () => setCopyMixId(null),
      import.meta.env.VITE_MODAL_CLOSE_TIMEOUT ?? 150
    );
  }

  return (
    <>
      <PageTitle title="Named Custom Blends" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="flex w-full justify-between gap-8 self-center">
          {canAccess(2) && (
            <Button
              variant="small secondary"
              className="shrink-0"
              onClick={() => {
                navigate("new");
              }}
            >
              Create New Blend
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
          {filteredMixes
            .filter((mix) => (canAccess(3) ? true : mix.approved))
            .slice(...pageIndeces)
            .map((mix) => (
              <li
                key={mix.id}
                className="flex items-center justify-between gap-8 py-2 px-1"
              >
                <div>
                  {canAccess(3) && (
                    <p
                      className={`font-semibold ${
                        mix.approved ? "text-green-400" : "text-rose-400"
                      }`}
                    >
                      {mix.approved ? "Approved" : "Not Approved"}
                    </p>
                  )}
                  {mix.promo && (
                    <p className="text-base font-semibold text-violet-300 lg:text-lg">
                      Current Promotion: {mix.promo.title}
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
                  {(mix.promo ? canAccess(3) : canAccess(2)) && (
                    <Button
                      variant="small secondary"
                      onClick={() => {
                        navigate(`${mix.id}`);
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  {canAccess(3) && (
                    <Button
                      variant="small danger"
                      onClick={() => {
                        if (
                          !confirm(
                            `Are you sure you want to delete ${mix.name}?`
                          )
                        )
                          return;

                        deleteMix(mix.id)
                          .then(({ error }) => {
                            if (error) throw error;
                            showToast("Blend deleted successfully.", {
                              type: "success",
                            });
                          })
                          .catch((error) => {
                            showToast("Could not delete blend.", {
                              type: "error",
                            });
                          });
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

      {/* copy blend form to get bottle count and nicotine level */}
      <Modal isOpen={copyModalIsOpen} onClose={closeCopyModal}>
        <CopyBlendForm
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
          mix={mixes.find((mix) => mix.id === copyMixId)}
        />
      </Modal>
    </>
  );
}

export function CreateNamedBlend() {
  const { insert } = useSupabaseRealtime("named_mixes");
  const { canAccess } = useAuthContext();
  const navigate = useNavigate();

  return (
    <BlendForm
      title={"Create Named Blend"}
      namedMix={true}
      admin={canAccess(3)}
      onCancel={() => navigate("..")}
      onSubmit={async (mix) => {
        insert(mix).then(({ error }) => {
          if (error) {
            showToast(
              error.code === "23505"
                ? "This name already exists."
                : "Error creating blend.",
              { type: "error" }
            );
          } else {
            showToast("Blend created successfully.", { type: "success" });
            navigate("..");
          }
        });
      }}
    />
  );
}

export function EditNamedBlend() {
  const { id } = useParams();
  const { data: mixes, loading, update } = useSupabaseRealtime("named_mixes");
  const { canAccess } = useAuthContext();
  const navigate = useNavigate();

  const mix = useMemo(() => {
    return mixes.find((mix) => mix.id == id);
  }, [mixes]);

  async function handleSubmit(mix) {
    try {
      const { error } = await update(mix);
      if (error) throw error;
      showToast("Blend updated successfully.", { type: "success" });
      navigate("..");
    } catch (error) {
      showToast(
        error.code === "23505"
          ? "This name already exists."
          : "Error updating blend.",
        { type: "error" }
      );
    }
  }

  return loading ? (
    <Spinner />
  ) : mix == null ? (
    <Navigate to=".." replace />
  ) : (
    <BlendForm
      title={"Update Named Blend"}
      namedMix={true}
      editMix={mix}
      admin={canAccess(3)}
      onCancel={() => navigate("..")}
      onSubmit={handleSubmit}
    />
  );
}
