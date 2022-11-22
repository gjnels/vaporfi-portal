import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createDisplayBlendString } from "../../lib/strings";
import { PromoForm } from "../../components/forms/PromoForm";
import { PageTitle } from "../../components/ui/PageTitle";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/FormInputs";
import { showToast } from "../../components/ui/Toast";
import { Spinner } from "../../components/ui/Spinner";
import { useSupabaseContext } from "../../contexts/supabaseContext";

export function Promotions() {
  const {
    promos: { data: promos, loading, remove },
  } = useSupabaseContext();

  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const searchTerms = useMemo(
    () => query.trim().toLowerCase().split(" "),
    [query]
  );

  async function deletePromo(promo) {
    if (
      !confirm("Are you sure you want to delete the promotion:\n" + promo.title)
    )
      return;
    const { error } = await remove(promo.id);
    if (error) {
      showToast("Error deleting promotion.", { type: "error" });
    } else {
      showToast("Promotion deleted successfully.", { type: "success" });
    }
  }

  return loading ? (
    <Spinner />
  ) : (
    <>
      <PageTitle title="Edit Promotions" />
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex gap-8">
          <Button
            variant="small"
            onClick={() => {
              navigate("new");
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
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Sale</th>
              <th className="px-3 py-2">Priority</th>
              {/* <th className="px-4 py-2"></th> */}
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
                  <td className="px-4 py-2">
                    <p>{promo.priority.name}</p>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex flex-col gap-4 md:flex-row">
                      <Button
                        variant="small secondary"
                        onClick={() => {
                          navigate(`${promo.id}`);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="small danger"
                        onClick={() => {
                          deletePromo(promo);
                        }}
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
    </>
  );
}

export function CreatePromo() {
  const navigate = useNavigate();
  const {
    promos: { insert },
  } = useSupabaseContext();

  async function handleSubmit(data) {
    try {
      const { error } = await insert(data);
      if (error) throw error;
      navigate("..");
    } catch (error) {
      showToast(
        error.code == 23505
          ? "This name already exists."
          : "Error creating promotion.",
        { type: "error" }
      );
    }
  }

  return (
    <PromoForm
      onSubmit={handleSubmit}
      onCancel={() => navigate("..")}
      title="Create New Promotion"
    />
  );
}

export function EditPromo() {
  const { id } = useParams();
  const {
    promos: { data: promos, update, loading },
  } = useSupabaseContext();
  const navigate = useNavigate();

  async function handleSubmit(data) {
    try {
      const { error } = await update(data);
      if (error) throw error;
      navigate("..");
    } catch (error) {
      showToast(
        error.code == 23505
          ? "This title already exists."
          : "Error updating promotion.",
        { type: "error" }
      );
    }
  }

  const promo = promos.find((promo) => promo.id == id);

  return loading ? (
    <Spinner />
  ) : (
    <PromoForm
      title="Edit Promotion"
      promo={promo}
      onCancel={() => navigate("..")}
      onSubmit={handleSubmit}
    />
  );
}
