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