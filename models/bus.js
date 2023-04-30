class bus {

    constructor(code, capacity) {
        this._code = code
        this._capacity = capacity; 
    }

    getCode = () => {
        return this._code; 
    }

    getCapacity = () => {
        return this._capacity;
    }

    setCode = (code) => {
        this._code = code;
    }

    setCapacity = (capacity) => {
        this._capacity = capacity; 
    }

    toJSON() {
        const { ...json } = this;
        return json;
      } 





}

module.exports = bus;