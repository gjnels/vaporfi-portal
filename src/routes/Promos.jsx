import { useSupabaseContext } from "../contexts/supabaseContext";
import { PageTitle } from "../components/ui/PageTitle";
import { Promo } from "../components/Promo";
import { Spinner } from "../components/ui/Spinner";
import { twMerge } from "tailwind-merge";

export const Promos = () => {
  const { promos, loading } = useSupabaseContext();

  return (
    <>
      <PageTitle title="Current Promotions" />
      {loading ? (
        <Spinner />
      ) : promos.length > 0 ? (
        <div
          className={twMerge(
            "mx-auto grid w-fit gap-8 self-center",
            promos.length >= 2 && "lg:grid-cols-2",
            promos.length >= 3 && "2xl:grid-cols-3"
          )}
        >
          {promos
            .sort((a, b) => {
              if (a.priority.level > b.priority.level) {
                return -1;
              } else if (a.priority.level < b.priority.level) {
                return 1;
              } else {
                return a.updated_at < b.updated_at ? 1 : -1;
              }
            })
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
