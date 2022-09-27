import { Button } from "../components/ui/Button";
import { PageTitle } from "../components/PageTitle";
import { Spinner } from "../components/ui/Spinner";
import { Toggle } from "../components/ui/Toggle";
import { useNicotine } from "../contexts/nicotineContext";
import { capitalize } from "../lib/strings";

const packetColors = {
  yellow: {
    background: "bg-yellow-500",
    border: "border-yellow-500",
    text: "text-gray-800",
  },
  green: {
    background: "bg-green-500",
    border: "border-green-500",
    text: "text-gray-800",
  },
  blue: {
    background: "bg-sky-500",
    border: "border-sky-500",
    text: "text-gray-800",
  },
  red: {
    background: "bg-red-500",
    border: "border-red-500",
    text: "text-gray-100",
  },
  purple: {
    background: "bg-purple-600",
    border: "border-purple-600",
    text: "text-gray-100",
  },
  brown: {
    background: "bg-amber-800",
    border: "border-amber-800",
    text: "text-gray-100",
  },
  black: {
    background: "bg-black",
    border: "border-black",
    text: "text-gray-100",
  },
  orange: {
    background: "bg-orange-500",
    border: "border-orange-500",
    text: "text-gray-100",
  },
  pink: {
    background: "bg-pink-500",
    border: "border-pink-500",
    text: "text-gray-100",
  },
  grey: {
    background: "bg-gray-500",
    border: "border-gray-500",
    text: "text-gray-100",
  },
};

export const NicotineCalculator = () => {
  const { preferences, loading } = useNicotine();

  return (
    <>
      <PageTitle title="Nicotine Calculator" />
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex gap-4">
          {loading ? (
            <Spinner className="text-2xl" />
          ) : (
            <div className="flex w-max flex-col gap-2">
              <h3 className="mb-1 text-lg font-semibold lg:text-xl">
                Nicotine Packets
              </h3>
              <Packets />
              <Button className="mt-2">Save</Button>
            </div>
          )}
          <div className="grow">form</div>
        </div>
        <div className="justify-self-center">results</div>
      </div>
    </>
  );
};

const Packets = () => {
  const { packets, loading } = useNicotine();
  return loading ? (
    <Spinner />
  ) : (
    packets.map((packet) => (
      <Toggle
        key={packet.id}
        title={`${capitalize(packet.color)} - ${packet.nic_level}mg${
          packet.salt ? " (salt)" : ""
        }`}
      />
    ))
  );
};
