import React from "react";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import Rating from "../components/Rating.jsx";
import ReviewCard from "../components/ReviewCard.jsx";
import { fetchCompany, fetchReviews, likeReview } from "../services/api.js";

function formatDate(date) {
  if (!date) return "Not provided";
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, reviewCount: 0 });
  const [sort, setSort] = useState("relevance");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([fetchCompany(id), fetchReviews(id, { sort })])
      .then(([companyData, reviewData]) => {
        if (!active) return;
        setCompany(companyData);
        setReviews(reviewData.reviews);
        setReviewStats({
          averageRating: reviewData.averageRating,
          reviewCount: reviewData.reviewCount
        });
      })
      .catch(() => {
        if (active) setError("Could not load company details.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, sort]);

  async function handleLike(reviewId) {
    const updated = await likeReview(reviewId);
    setReviews((current) => current.map((review) => (review._id === updated._id ? updated : review)));
  }

  if (loading) {
    return <Layout><p className="state-text">Loading profile...</p></Layout>;
  }

  if (error || !company) {
    return <Layout><p className="error-banner">{error || "Company not found."}</p></Layout>;
  }

  return (
    <Layout>
      <div className="figma-divider profile-divider" />
      <section className="profile-card">
        <div className="profile-top">
          <div className="profile-logo logo-navy">
            {company.logo ? <img src={company.logo} alt={`${company.name} logo`} /> : "G"}
          </div>
          <div className="profile-copy">
            <h1>{company.name}</h1>
            <p><MapPin size={13} />{company.location}, {company.city}</p>
            <div className="profile-rating-row">
              <strong>{Number(reviewStats.averageRating || 0).toFixed(1)}</strong>
              <Rating value={reviewStats.averageRating || 0} />
              <span>{reviewStats.reviewCount} Reviews</span>
            </div>
          </div>
          <div className="profile-actions">
            <span className="profile-founded">Founded on {formatDate(company.foundedOn)}</span>
            <Link className="button button-primary profile-add-review" to={`/companies/${id}/reviews/new`}>
              + Add Review
            </Link>
          </div>
        </div>
        <div className="profile-card-divider" />
        <section className="section-title-row">
          <label className="review-sort-control">
            <span>Sort:</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="rating">Rating</option>
            </select>
          </label>
        </section>
      

      {reviews.length === 0 ? (
        <div className="empty-state">
          <h2>No reviews yet</h2>
          <p>Add the first review for this company.</p>
        </div>
      ) : (
        <section className="review-list">
          {reviews.map((review) => (
            <ReviewCard review={review} key={review._id} onLike={handleLike} />
          ))}
        </section>
      )}
      </section>
    </Layout>
  );
}
