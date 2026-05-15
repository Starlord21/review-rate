import React from "react";
import { MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CompanyCard from "../components/CompanyCard.jsx";
import Layout from "../components/Layout.jsx";
import { fetchCities, fetchCompanies } from "../services/api.js";

export default function CompanyListing() {
  const [companies, setCompanies] = useState([]);
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [city, setCity] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [sort, setSort] = useState("name");
  const [loading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [error, setError] = useState("");

  const query = useMemo(() => ({ search: debouncedSearch, city, sort }), [debouncedSearch, city, sort]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchCompanies(query)
      .then((data) => {
        if (!active) return;
        setCompanies(data);
        setError("");
      })
      .catch(() => {
        if (active) setError("Could not load companies.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
        setHasLoadedOnce(true);
      });

    return () => {
      active = false;
    };
  }, [query, hasLoadedOnce]);

  useEffect(() => {
    fetchCities().then(setCities).catch(() => setCities([]));
  }, []);

  return (
    <Layout searchValue={search} onSearchChange={setSearch}>
      <section className="page-header">
      </section>

      <section className="toolbar" aria-label="Company search and filters">
        <label className="field-inline city-control">
          <span>Select City</span>
          <input
            list="city-options"
            value={cityInput}
            onChange={(event) => setCityInput(event.target.value)}
            placeholder="Indore, Madhya Pradesh, India"
          />
          <MapPin size={22} />
          <datalist id="city-options">
            {cities.map((item) => <option key={item} value={item} />)}
          </datalist>
        </label>
        <button className="button button-primary find-button" type="button" onClick={() => setCity(cityInput.trim())}>
          Find Company
        </button>
        <a className="button button-primary add-company-button" href="/companies/new">+ Add Company</a>
        <label className="field-inline sort-control">
          <span>Sort:</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="name">Name</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="rating">Rating: High to Low</option>
            <option value="foundedOn">Founded: Latest to Oldest</option>
          </select>
        </label>
      </section>
      <div className="figma-divider listing-divider" />

      <section className="company-results-scroll">
        {error ? <p className="error-banner">{error}</p> : null}
        {loading && !hasLoadedOnce ? <p className="state-text">Loading companies...</p> : null}
        {!loading && companies.length === 0 ? (
          <div className="empty-state">
            <h2>No companies found</h2>
            <p>Adjust the search or add the first company profile.</p>
          </div>
        ) : null}
        <p className="result-count">Result Found: {companies.length}</p>
        <section className="company-grid" aria-label="Companies">
          {companies.map((company) => (
            <CompanyCard company={company} key={company._id} />
          ))}
        </section>
      </section>
    </Layout>
  );
}
