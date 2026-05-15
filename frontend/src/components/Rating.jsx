import React from "react";

import { Star } from "lucide-react";

export default function Rating({ value = 0, interactive = false, onChange, size = 18 }) {
  return (
    <div className="rating" aria-label={`${Number(value).toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= Math.round(value);
        const className = active ? "star star-active" : "star";
        if (interactive) {
          return (
            <button
              className="rating-button"
              key={star}
              type="button"
              onClick={() => onChange(star)}
              aria-label={`Set rating to ${star}`}
            >
              <Star className={className} size={size} fill={active ? "currentColor" : "none"} />
            </button>
          );
        }

        return (
          <Star
            className={className}
            key={star}
            size={size}
            fill={active ? "currentColor" : "none"}
          />
        );
      })}
    </div>
  );
}
