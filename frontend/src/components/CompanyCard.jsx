import React from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Rating from "./Rating.jsx";

function logoFallback(name) {
  if (name.toLowerCase().includes("code")) return "<CT>";
  if (name.toLowerCase().includes("innogent")) return "i";
  if (name.toLowerCase().includes("pixel")) return "P";
  return "G";
}

function logoTheme(name) {
  if (name.toLowerCase().includes("code")) return "company-logo logo-green";
  if (name.toLowerCase().includes("innogent")) return "company-logo logo-orange";
  if (name.toLowerCase().includes("pixel")) return "company-logo logo-blue";
  return "company-logo logo-navy";
}

export default function CompanyCard({ company }) {
  return (
    <article className="company-card">
      <div className={logoTheme(company.name)}>
        {company.logo ? <img src={company.logo} alt={`${company.name} logo`} /> : logoFallback(company.name)}
      </div>
      <div className="company-card-body">
        <div className="company-card-head">
          <div>
            <h2>{company.name}</h2>
            <p className="company-location">
              <MapPin size={15} />
              {company.location}, {company.city}
            </p>
          </div>
        </div>
        <div className="card-meta">
          <Rating value={company.averageRating || 0} />
          <strong>{Number(company.averageRating || 0).toFixed(1)}</strong>
          <span>{company.reviewCount ? `${company.reviewCount} Reviews` : ""}</span>
        </div>
      </div>
      <div className="company-card-actions">
        <span className="founded-date">
          {company.foundedOn ? `Founded on ${new Date(company.foundedOn).toLocaleDateString("en-GB").replaceAll("/", "-")}` : "Reg. Date 01-01-2016"}
        </span>
        <Link className="detail-button" to={`/companies/${company._id}`}>Detail Review</Link>
      </div>
    </article>
  );
}
