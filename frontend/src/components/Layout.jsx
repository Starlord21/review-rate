import React from "react";
import { Search, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function Layout({ children, searchValue = "", onSearchChange }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/companies">
          <span className="brand-mark"><Star size={21} fill="currentColor" /></span>
          <span className="brand-copy">
            <span>Review</span><b>&amp;Rate</b>
          </span>
        </Link>
        <div className="header-search">
          <input
            aria-label="Search companies"
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder="Search..."
            value={searchValue}
          />
          <Search size={20} />
        </div>
        <nav className="auth-links" aria-label="Account navigation">
          <a href="#signup">SignUp</a>
          <a href="#login">Login</a>
        </nav>
      </header>
      <main className="page-frame">{children}</main>
    </div>
  );
}
