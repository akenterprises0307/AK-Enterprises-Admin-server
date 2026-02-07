const parseArrayField = (value, fieldName, { required = false } = {}) => {
    if (value === undefined || value === null) {
        if (required) throw new Error(`${fieldName} is required`)
        return undefined
    }

    if (Array.isArray(value)) return value

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value)
            if (Array.isArray(parsed)) return parsed
        } catch (error) {
            return value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
        }
    }

    throw new Error(`${fieldName} must be an array`)
}

const parseObjectField = (value, fieldName, { required = false } = {}) => {
    if (value === undefined || value === null) {
        if (required) throw new Error(`${fieldName} is required`)
        return undefined
    }

    if (typeof value === 'object' && !Array.isArray(value)) return value

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value)
            if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                return parsed
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    throw new Error(`${fieldName} must be an object/map`)
}

export { parseArrayField, parseObjectField }

