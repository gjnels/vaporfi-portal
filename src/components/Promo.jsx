import { createDisplayBlendString } from "../lib/strings";

export const Promo = ({ promo }) => (
  <div className="max-w-lg overflow-hidden rounded-lg border border-gray-600 bg-gray-900 shadow-md">
    {promo.img_url && (
      <img className="w-full" src={promo.img_url} alt={promo.title} />
    )}
    <div className="space-y-3 p-6">
      <h2 className="text-xl font-bold tracking-wide lg:text-2xl">
        {promo.title}
      </h2>
      {promo.blend
        ? promo?.mix && (
            <div>
              <p className="text-lg font-semibold lg:text-xl">
                {promo.mix.name}
              </p>
              <p className="text-base text-green-300 lg:text-lg">
                {createDisplayBlendString(promo.mix.blend)}
              </p>
            </div>
          )
        : promo?.brand && (
            <p className="text-lg font-semibold lg:text-xl">{promo.brand}</p>
          )}
      <p className="flex gap-2 text-base lg:text-lg">
        <span>Sale:</span>
        <span className="whitespace-pre-wrap">{promo.sale}</span>
      </p>
      {promo.notes && <p className="italic text-gray-400">{promo.notes}</p>}
    </div>
  </div>
);
