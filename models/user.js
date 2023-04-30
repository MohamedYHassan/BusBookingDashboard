const bcrypt = require("bcrypt");


class User {
    constructor( name, email, token,imageURL,status,hashedPassword) {
        this._name = name;
        this._email = email;
        this._password = hashedPassword || null;
        this._token = token;
        this._imageURL = imageURL;
        this. _status = status;
    }


    

    getName = () => {
        return this._name;
    }

    getEmail = () => {
        return this._email;
    }

    setPassword = async (password) => {
        this._password = await bcrypt.hash(password, 8);

    }
    checkPassword = async (password) => {

        return bcrypt.compare(password, this._password);

    }

    getPassword = () => {
        return this._password; 
    }

    getToken = () => {
        return this._token;
    }

    getImageURL = () => {
        return this._imageURL;
    }

    setImageURL = (image_url) => {
        this._imageURL = image_url;
    }

    getStatus = () => {
        return this._status;
    }

    toJSON() {
        const { _password, ...json } = this;
        return json;
      } 
}


module.exports = User;