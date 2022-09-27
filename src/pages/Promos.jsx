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
        <Spinner className="text-2xl" />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {promos.map((promo) => (
            <Promo key={promo.id} promo={promo} />
          ))}
        </div>
      )}
    </>
  );
};
