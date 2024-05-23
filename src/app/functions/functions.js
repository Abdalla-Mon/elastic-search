export function createTermsObject(fieldName, values) {

    return values.length ? [{ terms: { [fieldName]: values } }] : [];
}

export function createRangeObject(fieldName, values) {
    if (values.length) {
        const years = values.map((value) => new Date(value).getFullYear());
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);
        return [
            {
                range: {
                    [fieldName]: {
                        gte: `${minYear}-01-01`,
                        lte: `${maxYear}-12-31`,
                    },
                },
            },
        ];
    } else {
        return [];
    }
}