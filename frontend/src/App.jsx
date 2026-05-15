import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AddCompany from "./pages/AddCompany.jsx";
import AddReview from "./pages/AddReview.jsx";
import CompanyDetail from "./pages/CompanyDetail.jsx";
import CompanyListing from "./pages/CompanyListing.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/companies" replace />} />
      <Route path="/companies" element={<CompanyListing />} />
      <Route path="/companies/new" element={<AddCompany />} />
      <Route path="/companies/:id" element={<CompanyDetail />} />
      <Route path="/companies/:id/reviews/new" element={<AddReview />} />
    </Routes>
  );
}
