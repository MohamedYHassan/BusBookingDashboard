const User = require("../models/user");
const { validationResult } = require('express-validator');
const connection = require("../db/dbConnection");
const util = require("util"); 
const session = require("express-session");



class authController {
    static  async login(req, res) {
        try {

        //validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        //check email
        const query = util.promisify(connection.query).bind(connection);
        const checkEmail =   await query(
            "SELECT * from users where email = ?",
            [req.body.email]
        );
            
            const userData = checkEmail[0];
            

        if (userData.length == 0) {
            return res.status(404).json({
                errors: [
                    {
                        msg: "Email or Password does not exist"
                    }
                ],
            }); 
        }
            
                  
            

            
            const user = new User(userData.name, userData.email, userData.token,userData.image_url, userData.status, userData.password);
            

            

        //compare password


            const checkPassword = await user.checkPassword(req.body.password);

            


            if (checkPassword) {
                req.session.userId = userData.id;
                console.log(req.sessionID);
                return res.status(200).json(user.toJSON());
             } else {
                return res.status(404).json({
                    errors: [
                    {
                        msg: "Password Incorrect!"
                    }
                ],
            }); 

        }

            
    } catch (err) {
        return res.status(500).json({ err: err });
    }   
    }

    static async logout(req, res) {
        try {

            req.session.destroy();
            console.log(req.sessionID);
            return res.status(200).json({
                msg: "Logged Out Successfully"
            })

        } catch (err) {
            return res.status(500).json({
                err: err
            })
        }
    }
}


module.exports = authController; 