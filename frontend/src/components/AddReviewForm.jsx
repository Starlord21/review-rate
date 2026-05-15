import React, { useState } from "react";
import { X } from "lucide-react";
import FormField from "./FormField.jsx";
import Rating from "./Rating.jsx";

const initialForm = {
  fullName: "",
  subject: "",
  reviewText: "",
  rating: 0
};

export default function AddReviewForm({ onClose, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.rating) {
      setError("Please select a rating.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (requestError) {
      setError(requestError.response?.data?.details?.[0] || requestError.response?.data?.message || "Could not add review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="figma-form-panel add-review-panel" onSubmit={handleSubmit}>
      <button className="form-close" type="button" onClick={onClose} aria-label="Close">
        <X size={24} />
      </button>
      <span className="orb orb-primary" />
      <span className="orb orb-soft" />
      <h1>Add Review</h1>
      {error ? <p className="error-banner">{error}</p> : null}
      <FormField label="Full name">
        <input name="fullName" value={form.fullName} onChange={updateField} placeholder="Enter" required />
      </FormField>
      <FormField label="Subject">
        <input name="subject" value={form.subject} onChange={updateField} placeholder="Enter" required />
      </FormField>
      <FormField label="Enter your Review">
        <textarea name="reviewText" rows="5" value={form.reviewText} onChange={updateField} placeholder="Description" required />
      </FormField>
      <div className="form-rating-row">
        <h2>Rating</h2>
        <Rating
          interactive
          value={form.rating}
          onChange={(rating) => setForm((current) => ({ ...current, rating }))}
          size={43}
        />
        <span>Satisfied</span>
      </div>
      <button className="button button-primary" disabled={submitting} type="submit">
        {submitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
