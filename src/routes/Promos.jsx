import { PageTitle } from "../components/PageTitle";
import { Promo } from "../components/Promo";
import { Spinner } from "../components/ui/Spinner";
import { usePromos } from "../contexts/promosContext";

export const Promos = () => {
  const { promos, loading } = usePromos();

  return (
    <>
      <PageTitle title="Current Promotions" />
      {loading ? (
        <Spinner />
      ) : promos.length > 0 ? (
        <div className="grid grid-cols-1 justify-items-center gap-8 lg:grid-cols-2">
          {promos.map((promo) => (
            <Promo key={promo.id} promo={promo} />
          ))}
        </div>
      ) : (
        <i className="text-gray-500">No current promotions.</i>
      )}
    </>
  );
};
