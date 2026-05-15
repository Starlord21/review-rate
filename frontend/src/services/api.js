import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

export async function fetchCompanies(params = {}) {
  const { data } = await api.get("/companies", { params });
  return data;
}

export async function fetchCities() {
  const { data } = await api.get("/companies/cities");
  return data;
}

export async function createCompany(payload, logoFile) {
  if (logoFile) {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });
    formData.append("logo", logoFile);

    const { data } = await api.post("/companies", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return data;
  }

  const { data } = await api.post("/companies", payload);
  return data;
}

export async function uploadLogo(file) {
  const formData = new FormData();
  formData.append("logo", file);

  const { data } = await api.post("/uploads/logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return data;
}

export async function fetchCompany(id) {
  const { data } = await api.get(`/companies/${id}`);
  return data;
}

export async function fetchReviews(companyId, params = {}) {
  const { data } = await api.get(`/companies/${companyId}/reviews`, { params });
  return data;
}

export async function createReview(companyId, payload) {
  const { data } = await api.post(`/companies/${companyId}/reviews`, payload);
  return data;
}

export async function likeReview(reviewId) {
  const { data } = await api.patch(`/reviews/${reviewId}/like`);
  return data;
}
