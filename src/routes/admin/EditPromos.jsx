import { useSupabaseContext } from "../../contexts/supabaseContext";
import { PageTitle } from "../../components/ui/PageTitle";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { createDisplayBlendString } from "../../lib/strings";
import { useMemo, useState } from "react";
import { PromoForm } from "../../components/forms/PromoForm";
import { Input } from "../../components/ui/FormInputs";
import { showToast } from "../../components/ui/Toast";

export const EditPromos = () => {
  const { promos, insertRow, updateRow, deleteRow } = useSupabaseContext();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editPromoId, setEditPromoId] = useState();
  const [query, setQuery] = useState("");
  const searchTerms = useMemo(
    () => query.trim().toLowerCase().split(" "),
    [query]
  );

  function openModal(id) {
    setEditPromoId(id);
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
    setTimeout(() => setEditPromoId(undefined), 150);
  }

  async function createPromo(promo) {
    console.log("Creating promo:", promo);
    return await insertRow("promos", promo);
  }

  async function updatePromo(promo) {
    console.log("Updating promo:", promo);
    const { id, ...newData } = promo;
    return await updateRow("promos", newData, id);
  }

  async function deletePromo(id) {
    const promo = promos.find((p) => p.id === id);
    if (
      !confirm("Are you sure you want to delete the promotion:\n" + promo.title)
    )
      return;
    console.log("Deleting promo", promo.title);
    const error = await deleteRow("promos", id);
    if (error) {
      showToast("Error deleting promotion.", { type: "error" });
    } else {
      showToast("Promotion deleted successfully.", { type: "success" });
    }
  }

  return (
    <>
      <PageTitle title="Edit Promotions" />
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex gap-8">
          <Button
            variant="small"
            onClick={() => {
              setModalIsOpen(true);
            }}
          >
            Create New Promotion
          </Button>
          <Input
            type="search"
            id="query"
            autoFocus
            placeholder="Search promotions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-500 text-left text-base lg:text-lg">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Sale</th>
              <th className="px-4 py-2">Notes</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos
              .filter((promo) =>
                searchTerms.every(
                  (q) =>
                    promo.title.toLowerCase().includes(q) ||
                    promo.brand?.toLowerCase()?.includes(q) ||
                    promo.mix?.name?.toLowerCase()?.includes(q) ||
                    promo.mix?.blend?.some(({ flavor }) =>
                      flavor.toLowerCase().includes(q)
                    ) ||
                    promo.sale?.toLowerCase()?.includes(q) ||
                    promo.notes?.toLowerCase()?.includes(q)
                )
              )
              .sort((a, b) => (a.updated_at > b.updated_at ? -1 : 1))
              .map((promo) => (
                <tr key={promo.id} className="border-b border-gray-500">
                  <td className="px-4 py-2 font-semibold">
                    <p className="text-base lg:text-lg">{promo.title}</p>
                  </td>
                  <td className="px-4 py-2">
                    {promo.blend ? (
                      <div>
                        <p className="text-base lg:text-lg">{promo.mix.name}</p>
                        <p className="text-gray-300">
                          {createDisplayBlendString(promo.mix.blend)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-base lg:text-lg">{promo.brand}</p>
                    )}
                  </td>
                  <td className="whitespace-pre-wrap px-4 py-2">
                    <p>{promo.sale}</p>
                  </td>
                  <td className="whitespace-pre-wrap px-4 py-2">
                    <p>{promo.notes}</p>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col gap-4 md:flex-row">
                      <Button
                        variant="small secondary"
                        onClick={() => openModal(promo.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="small danger"
                        onClick={() => deletePromo(promo.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <PromoForm
          promo={promos.find((promo) => promo.id === editPromoId)}
          onCancel={closeModal}
          onSubmit={async (promo) => {
            const error = editPromoId
              ? await updatePromo(promo)
              : await createPromo(promo);
            console.log(error);
            if (error) {
              showToast(
                error.code == "23505"
                  ? "A promotion with this title already exists."
                  : editPromoId
                  ? "Error updating promotion."
                  : "Error creating promotion.",
                { type: "error" }
              );
            } else {
              showToast(
                editPromoId
                  ? "Promotion updated successfully."
                  : "Promotion created successfully.",
                { type: "success" }
              );
              closeModal();
            }
          }}
          title={editPromoId ? "Edit Promotion" : "Create Promotion"}
        />
      </Modal>
    </>
  );
};
