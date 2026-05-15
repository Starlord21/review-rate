import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddReviewForm from "../components/AddReviewForm.jsx";
import { createReview } from "../services/api.js";

export default function AddReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  async function handleSubmit(form) {
    await createReview(id, form);
    navigate(`/companies/${id}`);
  }

  return (
    <div className="form-page">
      <AddReviewForm
        onClose={() => navigate(`/companies/${id}`)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
