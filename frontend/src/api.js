const API_URL = "http://localhost:5000";

export const fetchPGs = async () => {
    const response = await fetch(`${API_URL}/pgs`);
    return response.json();
};

export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    return response.json();
};
