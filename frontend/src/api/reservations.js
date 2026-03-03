const API_URL = 'http://localhost:8000/api'

const headers = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
})

export const getReservations = async (token) => {
    const response = await fetch(`${API_URL}/reservations`, {
        headers: headers(token)
    })
    return response.json()
}

export const createReservation = async (token, data) => {
    const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify(data)
    })
    return response.json()
}

export const deleteReservation = async (token, id) => {
    const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: 'DELETE',
        headers: headers(token)
    })
    return response.json()
}