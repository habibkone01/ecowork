const API_URL = 'http://localhost:8000/api'

const headers = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
})

export const getCategories = async (token) => {
    const response = await fetch(`${API_URL}/categories`, {
        headers: headers(token)
    })
    return response.json()
}

export const createCategorie = async (token, data) => {
    const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(data)
    })
    return response.json()
}

export const updateCategorie = async (token, id, data) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: headers(token),
        body: JSON.stringify(data)
    })
    return response.json()
}

export const deleteCategorie = async (token, id) => {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: headers(token)
    })
    return response.json()
}