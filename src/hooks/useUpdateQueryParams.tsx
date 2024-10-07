import { useLocation, useNavigate } from "react-router-dom";

export const useUpdateQueryParams = () => {
    const navigate = useNavigate();
	const location = useLocation();
    
    const updateQueryParams = (newParams) => {
		// Preserve existing query params
		const searchParams = new URLSearchParams(location.search);

		// Update or set new parameters
		Object.keys(newParams).forEach((key) => {
			searchParams.set(key, newParams[key]);
		});

		// Navigate to the new URL with updated query params
		navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
	};

    return updateQueryParams
}