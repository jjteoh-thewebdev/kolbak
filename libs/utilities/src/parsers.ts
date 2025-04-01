export const transformToBoolean = ({
    value,
}: {
    value: string | number | boolean
}) => {
    if (typeof value === 'string' && value != null) {
        value = value.toLowerCase()
    }

    return [true, 1, '1', 'true'].indexOf(value) > -1
}

export function transformToArray({ value }: { value: string }) {
    console.log(`value`, value)
    if (!value || [``, `''`, `[]`].includes(value + '')) return []

    return Array.isArray(value) ? value : [value]
}

export function transformToNumArray({ value }: { value: string }) {
    if (!value || [``, `''`, `[]`].includes(value + '')) return []

    if (Array.isArray(value)) {
        return value.map((x) => parseInt(x))
    }

    return [parseInt(value)]
}