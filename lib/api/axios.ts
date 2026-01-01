import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/lib/stores/useAuthStore";

const BASE_URL =
	process.env.NEXT_PUBLIC_API_URL ||
	(typeof window !== "undefined"
		? `${window.location.origin}/api`
		: "http://localhost:8000/api");

if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_API_URL) {
	console.warn(
		"NEXT_PUBLIC_API_URL is not defined — using window.location.origin + '/api' as fallback. Restart dev server if you expect NEXT_PUBLIC_API_URL to be injected."
	);
}

export const api = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token =
			typeof window !== "undefined" ? useAuthStore.getState().token : null;

		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error: AxiosError) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			if (typeof window !== "undefined") {
				useAuthStore.getState().clearAuth();
				window.location.href = "/auth";
			}
		}

		return Promise.reject(error);
	}
);

export default api;
