const BASE_URL = 'https://najot-edu.softwareengineer.uz/api/v1'

function getToken() {
    return localStorage.getItem('token')
}

export async function api(path, options = {}) {
    const token = getToken()
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    })
    if (res.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/'
        return
    }
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Xatolik: ${res.status}`)
    return data
}

export const apiGet  = (path)         => api(path, { method: 'GET' })
export const apiPost = (path, body)   => api(path, { method: 'POST',   body: JSON.stringify(body) })
export const apiPut  = (path, body)   => api(path, { method: 'PUT',    body: JSON.stringify(body) })
export const apiDel  = (path)         => api(path, { method: 'DELETE' })

export async function apiPostForm(path, formData) {
    const token = getToken()
    const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || `Xatolik: ${res.status}`)
    return data
}
