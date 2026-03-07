const API_URL = 'http://localhost:8000/api'

const headers = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
})

export const getUsers = async (token, page = 1, params = {}) => {
    const query = new URLSearchParams({ page, ...params }).toString()
    const response = await fetch(`${API_URL}/users?${query}`, {
        headers: headers(token)
    })
    return response.json()
}
export const updateUser = async (token, id, form) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: headers(token),
        body: JSON.stringify(form)
    })
    return response.json()
}

export const deleteUser = async (token, id) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: headers(token)
    })
    return response.json()
}

export const createUser = async (token, form) => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(form)
    })
    return response.json()
}