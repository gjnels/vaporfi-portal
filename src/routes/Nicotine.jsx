import { Button } from "../components/ui/Button";
import { PageTitle } from "../components/PageTitle";
import { Spinner } from "../components/ui/Spinner";
import { Toggle } from "../components/ui/Toggle";
import { useNicotine } from "../contexts/nicotineContext";
import { capitalize } from "../lib/strings";
import { useMemo, useState } from "react";
import { Input, Select } from "../components/ui/FormInputs";
import { calculatePackets } from "../lib/nicotine";

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
  const { packets, togglePreference, savePreferences, loading } = useNicotine();
  const [neededPackets, setNeededPackets] = useState([]);
  const [formData, setFormData] = useState({
    bottleSize: 30,
    initialNic: 0,
    desiredNic: "",
    salt: false,
  });
  const [desiredNic, setDesiredNic] = useState(0);

  const higherPacket = useMemo(
    () => neededPackets.find((packet) => packet.type === "higher"),
    [neededPackets]
  );
  const lowerPackets = useMemo(
    () => neededPackets.find((packet) => packet.type === "lower"),
    [neededPackets]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(
      Object.entries(formData).map(([key, value]) =>
        key === "salt" ? [key, value] : [key, +value]
      )
    );
    setDesiredNic(data.desiredNic);
    setNeededPackets(calculatePackets(data, packets) ?? []);
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <PageTitle title="Nicotine Calculator" />
      <div className="grid grid-cols-1 gap-16 xl:grid-cols-2">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="mb-1 text-base lg:text-lg">
                Available Nicotine Packets
              </h3>
              {packets.map((packet) => (
                <Toggle
                  key={packet.id}
                  enabled={packet.available}
                  onChange={(enabled) => {
                    togglePreference(packet.id, enabled);
                  }}
                  title={`${capitalize(packet.color)} - ${packet.nic_level}mg${
                    packet.salt ? " (salt)" : ""
                  }`}
                  titleClassName="whitespace-pre-wrap text-xs lg:text-sm"
                />
              ))}
              <Button
                className="mt-2 self-center"
                variant="small secondary"
                onClick={savePreferences}
              >
                Save
              </Button>
            </div>
            <form
              className="flex flex-1 flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <h3 className="mb-1 text-center text-lg font-semibold lg:text-xl">
                Options
              </h3>
              <Select
                required={true}
                label="Bottle Size"
                id="bottle_size"
                notSelectedValue={"Select a bottle size"}
                options={[
                  { id: 30, value: 30, label: "30 mL" },
                  { id: 50, value: 50, label: "50 mL" },
                  { id: 60, value: 60, label: "60 mL" },
                  { id: 100, value: 100, label: "100 mL" },
                  { id: 120, value: 120, label: "120 mL" },
                ]}
                value={formData.bottleSize}
                onChange={(e) =>
                  handleInputChange("bottleSize", e.target.value)
                }
              />
              <Input
                label="Initial Nicotine Level"
                id="initial_nic"
                required={true}
                type="number"
                step="any"
                min={0}
                unit="mg"
                value={formData.initialNic}
                onChange={(e) => {
                  const nic =
                    e.target.value === "" ||
                    isNaN(+e.target.value) ||
                    +e.target.value < 0
                      ? ""
                      : +e.target.value;
                  handleInputChange("initialNic", nic);
                }}
              />
              <Input
                label="Desired Nicotine Level"
                id="desired_nic"
                unit="mg"
                type="number"
                step="any"
                min={1}
                required={true}
                value={formData.desiredNic}
                onChange={(e) => {
                  const nic =
                    e.target.value === "" ||
                    isNaN(+e.target.value) ||
                    +e.target.value < 0
                      ? ""
                      : +e.target.value;
                  handleInputChange("desiredNic", nic);
                }}
              />
              <Toggle
                enabled={formData.salt}
                onChange={(enabled) => handleInputChange("salt", enabled)}
                title="Salt Nicotine"
              />
              <div className="flex gap-4 self-center">
                <Button type="submit">Calculate</Button>
                <Button
                  type="reset"
                  variant="danger"
                  onClick={() => {
                    setFormData({
                      bottleSize: 30,
                      initialNic: 0,
                      desiredNic: "",
                      salt: false,
                    });
                    setDesiredNic(0);
                    setNeededPackets([]);
                  }}
                >
                  Reset
                </Button>
              </div>
            </form>
          </div>
        )}
        <div>
          <h3 className="mb-4 text-center text-lg font-semibold lg:text-xl">
            Results
          </h3>
          <div className="flex justify-center gap-12 justify-self-center">
            {neededPackets?.length > 0 ? (
              <>
                {lowerPackets && (
                  <PacketResult
                    {...lowerPackets}
                    title={
                      lowerPackets?.finalNicLevel !== desiredNic
                        ? "Closest Below Desired Level"
                        : null
                    }
                  />
                )}
                {higherPacket && lowerPackets?.finalNicLevel !== desiredNic && (
                  <PacketResult
                    {...higherPacket}
                    title={"Closest Above Desired Level"}
                  />
                )}
              </>
            ) : (
              <i className="text-gray-500">
                Fill out the form to see the resulting packets.
              </i>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const PacketResult = ({ finalNicLevel, packets, title }) => {
  return (
    <div className="flex flex-col gap-3 text-center">
      {title && (
        <span className="border-b border-current text-base font-semibold lg:text-lg">
          {title}
        </span>
      )}
      <div className="mb-2">
        Final Nicotine Level
        <span className="block text-xl font-bold lg:text-2xl">
          {finalNicLevel} mg
        </span>
      </div>
      {packets.map((packet) => {
        return (
          <div
            key={packet.id}
            className={`grid rounded-lg border-4 p-2 ${
              packetColors[packet.color].border
            }`}
          >
            <span>
              Qty: <span className="font-bold">{packet.count}</span>
            </span>
            <span>
              {capitalize(packet.color)} - {packet.nic_level} mg
            </span>
          </div>
        );
      })}
    </div>
  );
};
