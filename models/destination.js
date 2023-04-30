class destination {

    constructor(code, name) {
        this._code = code
        this._name = name; 
    }

    getCode = () => {
        return this._code; 
    }

    getName = () => {
        return this._name;
    }

    setCode = (code) => {
        this._code = code;
    }

    setName = (name) => {
        this._name = name; 
    }

    toJSON() {
        const { ...json } = this;
        return json;
      } 





}

module.exports = destination;