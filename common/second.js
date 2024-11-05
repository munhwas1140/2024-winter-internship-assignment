function isEmpty(value) {
    if(value === null || value === undefined) return true;
    if(value == "") return true;

    if(typeof value !== 'object') {
        return false;
    }

    if(Array.isArray(value)) {
        return value.every(val => isEmpty(val));
    }

    if(Object.keys(value).length == 0 ||
        Object.values(value).every(val => isEmpty(val))){
            return true;
    }

    return false;
}