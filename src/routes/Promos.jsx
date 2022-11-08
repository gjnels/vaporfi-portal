import { useSupabaseContext } from "../contexts/supabaseContext";
import { PageTitle } from "../components/ui/PageTitle";
import { Promo } from "../components/Promo";
import { Spinner } from "../components/ui/Spinner";

export const Promos = () => {
  const { promos, loading } = useSupabaseContext();

  return (
    <>
      <PageTitle title="Current Promotions" />
      {loading ? (
        <Spinner />
      ) : promos.length > 0 ? (
        <div className="grid grid-cols-1 justify-items-center gap-8 lg:grid-cols-2">
          {promos
            .sort((a, b) => (a.updated_at > b.updated_at ? -1 : 1))
            .sort((a, b) =>
              a.priority.level === b.priority.level
                ? 0
                : a.priority.level > b.priority.level
                ? -1
                : 1
            )
            .map((promo) => (
              <Promo key={promo.id} promo={promo} />
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No current promotions.</p>
      )}
    </>
  );
};
