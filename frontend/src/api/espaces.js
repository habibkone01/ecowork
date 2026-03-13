const API_URL = 'http://localhost:8000/api'

const headers = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
})

export const getEspaces = async (token, params = {}) => {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${API_URL}/espaces?${query}`, {
        headers: headers(token)
    })
    return response.json()
}

export const getEspace = async (token, id) => {
    const response = await fetch(`${API_URL}/espaces/${id}`, {
        headers: headers(token)
    })
    return response.json()
}

export const createEspace = async (token, formData) => {
    const response = await fetch(`${API_URL}/espaces`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    })
    return response.json()
}

export const updateEspace = async (token, id, formData) => {
    const response = await fetch(`${API_URL}/espaces/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    })
    return response.json()
}

export const deleteEspace = async (token, id) => {
    const response = await fetch(`${API_URL}/espaces/${id}`, {
        method: 'DELETE',
        headers: headers(token)
    })
    return response.json()
}