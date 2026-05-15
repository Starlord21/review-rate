import React from "react";
import { Heart, Share2 } from "lucide-react";
import Rating from "./Rating.jsx";

export default function ReviewCard({ review, onLike }) {
  function formatDate(date) {
    if (!date) return "01-01-2022, 14:33";
    const value = new Date(date);
    return `${value.toLocaleDateString("en-GB").replaceAll("/", "-")}, ${value.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
  }

  async function handleShare() {
    const text = `${review.fullName} rated ${review.rating}/5: ${review.reviewText}`;
    if (navigator.share) {
      await navigator.share({
        title: review.subject || "Company review",
        text
      });
      return;
    }

    await navigator.clipboard.writeText(text);
  }

  return (
    <article className="review-card">
      <div className="review-avatar">{review.fullName?.slice(0, 1) || "R"}</div>
      <div className="review-content">
        <h3>{review.fullName}</h3>
        <p className="review-date">{formatDate(review.createdAt)}</p>
        <p className="review-text">{review.reviewText}</p>
        <div className="review-actions">
          <button type="button" onClick={() => onLike(review._id)}>
            <Heart size={15} />
            Like {review.likes || 0}
          </button>
          <button type="button" onClick={handleShare}>
            <Share2 size={15} />
            Share
          </button>
        </div>
      </div>
      <div className="review-rating">
        <Rating value={review.rating} />
      </div>
    </article>
  );
}
