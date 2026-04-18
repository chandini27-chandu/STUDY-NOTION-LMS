import axios from "axios";

// Base Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

// ================== AUTO TOKEN ATTACH ==================
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    // Remove extra quotes if token is stored like "abc..."
    const cleanToken = token.replace(/"/g, "");

    req.headers.Authorization = `Bearer ${cleanToken}`;
  }

  return req;
});

// ================== API CONNECTOR ==================
export const apiConnector = async (
  method,
  url,
  bodyData = null,
  headers = {},
  params = null
) => {
  try {
    const config = {
      method: method.toUpperCase(),
      url,
      headers: {
        ...headers, // keep custom headers if any
      },
      ...(bodyData && { data: bodyData }),
      ...(params && { params }),
    };

    const response = await API(config);
    return response;
  } catch (error) {
    console.error(
      `API Error [${method.toUpperCase()} ${url}]:`,
      error?.response?.data || error.message
    );
    throw error;
  }
};

export default API;