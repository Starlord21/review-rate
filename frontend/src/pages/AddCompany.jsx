import React from "react";
import { useNavigate } from "react-router-dom";
import AddCompanyForm from "../components/AddCompanyForm.jsx";
import { createCompany } from "../services/api.js";

export default function AddCompany() {
  const navigate = useNavigate();

  async function handleSubmit(form, logoFile) {
    const company = await createCompany(form, logoFile);
    navigate(`/companies/${company._id}`);
  }

  return (
    <div className="form-page">
      <AddCompanyForm
        onClose={() => navigate("/companies")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
