const API_URL = 'http://localhost:8000/api'

const headers = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
})

export const getEquipements = async (token, params = {}) => {
    const query = new URLSearchParams(params).toString()
    const response = await fetch(`${API_URL}/equipements?${query}`, {
        headers: headers(token)
    })
    return response.json()
}

export const createEquipement = async (token, data) => {
    const response = await fetch(`${API_URL}/equipements`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(data)
    })
    return response.json()
}

export const updateEquipement = async (token, id, data) => {
    const response = await fetch(`${API_URL}/equipements/${id}`, {
        method: 'PUT',
        headers: headers(token),
        body: JSON.stringify(data)
    })
    return response.json()
}

export const deleteEquipement = async (token, id) => {
    const response = await fetch(`${API_URL}/equipements/${id}`, {
        method: 'DELETE',
        headers: headers(token)
    })
    return response.json()
}