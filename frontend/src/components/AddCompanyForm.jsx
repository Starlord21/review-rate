import React, { useRef, useState } from "react";
import { CalendarDays, ImagePlus, MapPin, X } from "lucide-react";
import FormField from "./FormField.jsx";

const initialForm = {
  name: "",
  location: "",
  city: "",
  foundedOn: "",
  logo: "",
  description: "",
};

export default function AddCompanyForm({ onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const foundedOnRef = useRef(null);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function updateLogo(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setLogoFile(null);
      setLogoPreview("");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await onSubmit(form, logoFile);
    } catch (requestError) {
      setError(
        requestError.response?.data?.details?.[0] ||
          requestError.response?.data?.message ||
          "Could not add company.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="figma-form-panel add-company-panel"
      onSubmit={handleSubmit}
    >
      <button
        className="form-close"
        type="button"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={24} />
      </button>
      <span className="orb orb-primary" />
      <span className="orb orb-soft" />
      <h1>Add Company</h1>
      {error ? <p className="error-banner">{error}</p> : null}
      <FormField label="Company name">
        <input
          name="name"
          value={form.name}
          onChange={updateField}
          placeholder="Enter..."
          required
        />
      </FormField>
      <FormField label="Location">
        <span className="input-with-icon">
          <input
            name="location"
            value={form.location}
            onChange={updateField}
            placeholder="Select Location"
            required
          />
          <MapPin size={21} />
        </span>
      </FormField>
      <FormField label="Founded on">
        <span className="input-with-icon date-field">
          <input
            className="date-display-input"
            type="text"
            value={form.foundedOn}
            placeholder="DD/MM/YYYY"
            onClick={() => foundedOnRef.current?.showPicker?.()}
            readOnly
          />
          <input
            className="hidden-date-input"
            name="foundedOn"
            ref={foundedOnRef}
            type="date"
            tabIndex={-1}
            value={form.foundedOn}
            onChange={updateField}
            required
          />
          <button
            className="date-picker-button"
            type="button"
            aria-label="Open founded date picker"
            onClick={() => foundedOnRef.current?.showPicker?.()}
          >
            <CalendarDays size={21} />
          </button>
        </span>
      </FormField>
      <FormField label="City">
        <input
          name="city"
          value={form.city}
          onChange={updateField}
          placeholder="Enter city"
          required
        />
      </FormField>
      <FormField label="Logo">
        <label className="logo-upload-control">
          <input type="file" accept="image/*" onChange={updateLogo} />
          {logoPreview ? (
            <img src={logoPreview} alt="Selected logo preview" />
          ) : (
            <span>
              <ImagePlus size={20} />
              Upload logo
            </span>
          )}
        </label>
      </FormField>
      <button
        className="button button-primary"
        disabled={submitting}
        type="submit"
      >
        {submitting ? "Uploading..." : "Save"}
      </button>
    </form>
  );
}
