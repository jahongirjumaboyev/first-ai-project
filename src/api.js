const BASE_URL = '/api/v1'

function getToken() {
    return localStorage.getItem('token')
}

export async function api(path, options = {}) {
    const token = getToken()
    let res
    try {
        res = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
        })
    } catch (e) {
        throw new Error(`Tarmoqqa ulanib bo'lmadi: ${e.message}`)
    }
    if (res.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/'
        return
    }
    const text = await res.text().catch(() => '')
    let data = {}
    try { data = JSON.parse(text) } catch {}
    if (!res.ok) {
        const msg = Array.isArray(data.message) ? data.message.join(', ') : (data.message || text || `Xatolik: ${res.status}`)
        throw new Error(msg)
    }
    return data
}

export const apiGet  = (path)       => api(path, { method: 'GET' })
export const apiPost = (path, body) => api(path, { method: 'POST',  body: JSON.stringify(body) })
export const apiPut  = (path, body) => api(path, { method: 'PUT',   body: JSON.stringify(body) })
export const apiDel  = (path)       => api(path, { method: 'DELETE' })

export async function apiPostForm(path, formData) {
    const token = getToken()
    let res
    try {
        res = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
        })
    } catch (e) {
        throw new Error(`Tarmoqqa ulanib bo'lmadi: ${e.message}`)
    }
    if (res.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/'
        return
    }
    const text = await res.text().catch(() => '')
    let data = {}
    try { data = JSON.parse(text) } catch {}
    if (!res.ok) {
        const msg = Array.isArray(data.message) ? data.message.join(', ') : (data.message || text || `Xatolik: ${res.status}`)
        throw new Error(msg)
    }
    return data
}
