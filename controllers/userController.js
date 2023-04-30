const User = require("../models/user");
const { validationResult } = require('express-validator');
const connection = require("../db/dbConnection");
const util = require("util");
const crypto = require("crypto")
const fs = require("fs");


class UserController {
    static async createUser(req, res) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }
            
 
            const query = util.promisify(connection.query).bind(connection);
             const checkEmail = await query(
            "SELECT * from users where email = ?",
            [req.body.email]
             );
            
         
            
             if (checkEmail.length > 0) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "Email already exists"
                        }
                    ],
                }); 
             }


              const filename = req.file ? req.file.filename : "/Users/fofejo/Downloads/346e1df0044fd77dfb6f65cc086b2d5e-2923940731.png";

            
            const userObject = new User(
                req.body.name,
                req.body.email, 
                crypto.randomBytes(16).toString("hex"),
                filename,
                0)
            
            await userObject.setPassword(req.body.password)

            // console.log(userObject.getImageURL());
            


            await query("insert into users set name = ?, email = ?, password = ?, image_url = ?, token = ?, status = ?",
            [userObject.getName(),userObject.getEmail(),userObject.getPassword(),userObject.getImageURL(),userObject.getToken(),userObject.getStatus()]);
        
            return res.status(200).json(userObject.toJSON() );


        } catch (err) {  
            return res.status(500).json({ err: "error" });
        }
    }



    static async updateUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
             const checkUser = await query(
            "SELECT * from users where id = ?",
            [req.params.id]
             );
            
            
             if (checkUser.length == 0) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "User does not exist"
                        }
                    ],
                }); 
             }
            

            
             const userObject = new User(
                req.body.name,
                 req.body.email, 
                "",
                "",
                 0)
            
                 console.log("hello");

            
             await userObject.setPassword(req.body.password)
            

            
            if (req.file) {
                const filename = req.file.filename
                userObject.setImageURL(filename);
                fs.unlinkSync("./public/" + checkUser[0].image_url)
            }
            else {
                userObject.setImageURL(checkUser[0].image_url);
            }
            
            

            await query("update  users set name = ?, email = ?, password = ?, image_url = ? where id = ?",
            [userObject.getName(),userObject.getEmail(),userObject.getPassword(),userObject.getImageURL(),req.params.id]);
            


             return res.status(200).json( {msg: "User updated!"});







        } catch (err) {
            return res.status(500).json({ err: err });

        }
    }


    static async deleteUser(req, res) {
        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
             const checkUser = await query(
            "SELECT * from users where id = ?",
            [req.params.id]
             );
            
            
             if (checkUser.length == 0) {
                return res.status(400).json({
                    errors: [
                        {
                            msg: "User does not exist"
                        }
                    ],
                }); 
             }
            
            fs.unlinkSync("./public/" + checkUser[0].image_url)

            await query("delete from users where id = ?", [checkUser[0].id])

            return res.status(200).json({
                msg: "User deleted!"
            })



        } catch (err) {

            return res.status(500).json({ err: err });

        }
    }


    static async getUsers(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            let search = ""
            if (req.query.search) {
                search =  `where name LIKE '%${req.query.search}%'`
            }
            const users = await query(`select * from users ${search}`)

            if (users.length == 0) {
                return res.status(404).json({
                    msg: "no users found"
                })
            }

            users.map((user) => {
                user.image_url = "http://" + req.hostname + ":4001/" + user.image_url
                delete user.password
            });

            return res.status(200).json(users);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
    }

    static async getUser(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
           
            const users = await query("select * from users where id = ?",[req.params.id])

            if (users.length == 0) {
                return res.status(404).json({
                    msg: "no users found"
                })
            }

            users.map((user) => {
                user.image_url = "http://" + req.hostname + ":4001/" + user.image_url
            });

            return res.status(200).json(users);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
    }

    
    }



module.exports = UserController;