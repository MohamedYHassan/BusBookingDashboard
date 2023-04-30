class appointment {

    constructor(code, source, destination, startDatetime, endDatetime, bus, price) {
        this._code = code
        this._source = source
        this._destination = destination;
        this._startDatetime = startDatetime;
        this._endDatetime = endDatetime;
        this._bus = bus;
        this._price = price;
    }

    getCode = () => {
        return this._code
    }

    getSource = () => {
        return this._source;
    }

    getDestination = () => {
        return this._destination;
    }

    getStartDatetime = () => {
        return this._startDatetime
    }

    getEndDatetime = () => {
        return this._endDatetime;
    }

    getBus = () => {
        return this._bus;
    }

    getPrice = () => {
        return this._price;
    }

    setCode = (code) => {
        this._code = code;
    }

    setSource = (source) => {
        this._source = source;
    }

    setDestination = (destination) => {
        this._destination = destination;
    }

    setStartDatetime = (startDatetime) => {
        this._startDatetime - startDatetime;
    }

    setEndDatetime = (endDatetime) => {
        this._endDatetime = endDatetime;
    }


    setBus = (bus) => {
        this._bus = bus;
    }

    setPrice = (price) => {
        this._price = price;
    }

    toJSON() {
        const { ...json } = this;
        return json;
      } 





}

module.exports = appointment;