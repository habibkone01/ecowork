const API_URL = 'http://localhost:8000/api'

const headers = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
})

export const getEquipements = async (token) => {
    const response = await fetch(`${API_URL}/equipements`, {
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