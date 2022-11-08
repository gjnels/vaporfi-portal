import { Button } from "../ui/Button";
import { Input, Select, TextBox } from "../../components/ui/FormInputs";
import { Toggle } from "../ui/Toggle";
import { useRef, useState } from "react";
import { useSupabaseContext } from "../../contexts/supabaseContext";
import { createDisplayBlendString } from "../../lib/strings";
import { twMerge } from "tailwind-merge";

const defaultPromo = {
  title: "",
  blend: false,
  brand: "",
  mix: "",
  img_url: "",
  priority: 2,
  sale: "",
  notes: "",
};

export function PromoForm({ onSubmit, onCancel, promo, title }) {
  const { priorities, namedMixes } = useSupabaseContext();

  const [formData, setFormData] = useState(promo || defaultPromo);
  const [validUrl, setValidUrl] = useState(false);
  const [imageError, setImageError] = useState(undefined);
  const [submitting, setSubmitting] = useState(false);

  const imageInputRef = useRef(undefined);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const data = { ...formData };

    if (data.img_url && !validUrl) {
      imageInputRef.current.focus();
      setSubmitting(false);
      return;
    }

    if (data.blend) {
      data.mix = data.mix?.id || data.mix; // make sure the mix is an id, not the entire mix object
      delete data.brand;
    } else {
      delete data.mix;
    }

    data.priority = data.priority?.id || data.priority; // make sure priority is an id, not the entire priority object

    onSubmit(data);
    setSubmitting(false);
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <h2 className="mb-4 text-center text-xl font-semibold lg:text-2xl">
        {title}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-md">
        <Input
          id="title"
          label="Title"
          required
          autoFocus
          value={formData.title}
          onChange={(e) =>
            setFormData((currentData) => ({
              ...currentData,
              title: e.target.value,
            }))
          }
        />
        <Toggle
          enabled={formData.blend}
          onChange={(enabled) =>
            setFormData((currentData) => ({ ...currentData, blend: enabled }))
          }
          title="Custom Blend"
        />
        {formData.blend ? (
          <div>
            <Select
              id="mix"
              label="Custom Blend Mix"
              required
              notSelectedValue="Select a Mix"
              options={namedMixes
                .sort((a, b) => (a.name < b.name ? -1 : 1))
                .map((mix) => ({
                  id: mix.id,
                  value: mix.id,
                  label: mix.name,
                }))}
              value={formData.mix?.id ?? formData.mix ?? ""}
              onChange={(e) =>
                setFormData((currentData) => ({
                  ...currentData,
                  mix: +e.target.value,
                }))
              }
            />
            {formData.mix && (
              <p className="mt-2 ml-2">
                {createDisplayBlendString(
                  formData.mix?.blend ??
                    namedMixes.find((mix) => formData.mix === mix.id).blend
                )}
              </p>
            )}
          </div>
        ) : (
          <Input
            id="brand"
            label="Brand"
            required
            value={formData.brand}
            onChange={(e) =>
              setFormData((currentData) => ({
                ...currentData,
                brand: e.target.value,
              }))
            }
          />
        )}
        <div className="flex gap-2">
          <div className="flex grow flex-col gap-1">
            <Input
              ref={imageInputRef}
              id="img_url"
              label="Image URL"
              value={formData.img_url || ""}
              onChange={(e) => {
                const url = e.target.value.match(/\https\S+(.jpg|.jpeg|.png)/);
                const newUrl = e.target.value.includes("supabase")
                  ? e.target.value
                  : url
                  ? url[0]
                  : e.target.value;
                setFormData((currentData) => ({
                  ...currentData,
                  img_url: newUrl,
                }));
              }}
            />
            {imageError && <span className="text-rose-400">{imageError}</span>}
          </div>
          {formData.img_url && (
            <img
              src={formData.img_url}
              alt="promotion"
              className={twMerge(
                "w-1/4 rounded-md object-cover",
                !validUrl && "hidden"
              )}
              onLoad={() => {
                setValidUrl(true);
                setImageError(undefined);
              }}
              onError={() => {
                setValidUrl(false);
                setImageError("Image URL is not valid.");
              }}
            />
          )}
        </div>
        <TextBox
          id="sale"
          label="Sale"
          required
          defaultValue={formData.sale}
          onChange={(e) =>
            setFormData((currentData) => ({
              ...currentData,
              sale: e.target.value,
            }))
          }
          rows={3}
        />
        <TextBox
          id="notes"
          label="Notes"
          defaultValue={formData.notes}
          onChange={(e) =>
            setFormData((currentData) => ({
              ...currentData,
              notes: e.target.value,
            }))
          }
          rows={3}
        />
        <Select
          id="priority"
          label="Priority"
          required
          notSelectedValue="Select a Priority Level"
          options={priorities.map((p) => ({
            id: p.id,
            value: p.id,
            label: p.name,
          }))}
          value={formData.priority?.id ?? formData.priority ?? ""}
          onChange={(e) =>
            setFormData((currentData) => ({
              ...currentData,
              priority: +e.target.value,
            }))
          }
        />
        <div className="flex gap-4 self-center">
          <Button type="submit" disabled={submitting}>
            Submit
          </Button>
          <Button variant="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
