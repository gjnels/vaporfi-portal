import { createDisplayBlendString } from "../lib/strings";

export const Promo = ({ promo }) => (
  <div className="max-w-xl flex-1 overflow-hidden rounded-lg border border-gray-600 bg-gray-900 shadow-md">
    {/* Temporarily removing images, the cards look nicer without images since not every promotion has an image */}
    {/* {promo.img_url && (
        <img className="w-full" src={promo.img_url} alt={promo.title} />
      )} */}
    <div className="flex flex-col gap-3 p-6">
      <h2 className="text-2xl font-bold tracking-wide lg:text-3xl">
        {promo.title}
      </h2>
      {promo.blend
        ? promo?.mix && (
            <div>
              <p className="text-lg font-semibold text-green-300 lg:text-xl">
                {promo.mix.name}
              </p>
              <p className="ml-1 text-base text-violet-200 lg:text-lg">
                {createDisplayBlendString(promo.mix.blend)}
              </p>
            </div>
          )
        : promo?.brand && (
            <p className="text-lg font-semibold text-green-300 lg:text-xl">
              {promo.brand}
            </p>
          )}
      <p className="flex gap-2 text-base lg:text-lg">
        <span>Sale:</span>
        <span className="whitespace-pre-wrap">{promo.sale}</span>
      </p>
      {promo.notes && (
        <p className="whitespace-pre-wrap italic text-gray-400">
          {promo.notes}
        </p>
      )}
    </div>
  </div>
);
