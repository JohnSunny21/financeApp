import axios from "axios";


const baseURL = import.meta.env.VITE_API_BASE_URL;

console.log(`API BASE URL IS SET TO : ${baseURL}`);


const api = axios.create({
  baseURL:  baseURL
});

// Add a request interceptor

api.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem("token");
    if (token) {
      
      config.headers["Authorization"] = "Bearer " + token;
    }

    return config; // Important to return the config
  },
  (error) => {
    // Doing something with request error
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR ( This is where we add the logic)
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger.
    if (error.response && error.response.status === 401) {
      console.log("JWT Expired or Invalid. Logging out.");
      // Clear the user's token from storage
      localStorage.removeItem("token");
      // Redirect the user to the login page
      // We use window.location to force a full page reload, which clears all state.
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
