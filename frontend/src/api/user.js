const API_URL = 'http://localhost:8000/api'

const headers = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
})

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