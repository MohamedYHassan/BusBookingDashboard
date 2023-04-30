const Destination = require("../models/destination");
const { validationResult } = require('express-validator');
const connection = require("../db/dbConnection");
const util = require("util");


class destinationController {
    static async createDestination(req,res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkCode = await query(
                "SELECT * from destinations where code = ?",
                [req.body.code]
            );
            console.log(checkCode.length);
            if (checkCode.length  > 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "destination already exists"
                    }]
                    
                });
            };

             
            console.log(req.body.code);  
            console.log(req.body.name );

            const destinationObject = new Destination(req.body.code, req.body.name);
            

            await query("insert into destinations set code = ?, name = ?", [destinationObject.getCode(), destinationObject.getName()]); 


            return res.status(200).json(destinationObject.toJSON());



        } catch (err) {
            res.status(500).json({ err: "error" }); 

        }
    }


    static async updateDestination(req,res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkDestination = await query(
                "SELECT * from destinations where id = ?",
                [req.params.id]
            );
            if (checkDestination.length  == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "destination doesn't exist"
                    }]
                    
                });
            };

             
 

            const destinationObject = new Destination(req.body.code, req.body.name);

            const checkCode = await query(
                "SELECT * from destinations where code = ?",
                [req.body.code]
            );
            if (checkCode.length  > 0 && checkDestination[0].code != checkCode[0].code) {
                return res.status(400).json({
                    errors: [{
                        msg: "code already exists"
                    }]
                    
                });
            };
            

            await query("update destinations set code = ?, name = ? where id = ?", [destinationObject.getCode(), destinationObject.getName(), checkDestination[0].id]); 


            return res.status(200).json(destinationObject.toJSON());



        } catch (err) {
            return res.status(500).json({ err: "error" }); 

        }
    }    

    static async deleteDestination(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkDestination = await query(
                "SELECT * from destinations where id = ?",
                [req.params.id]
            );
            if (checkDestination.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "destination doesn't exist"
                    }]
                    
                });
            };

            await query("delete from destinations where id = ?", [checkDestination[0].id])

            return res.status(200).json({
                msg: "Destination deleted!"
            })

        
        } catch (err) {
            return res.status(500).json({ err: "error" }); 

        }
    }
    

    static async getDestinations(req, res) { 
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
            const destinations = await query(`select * from destinations ${search}`)

            if (destinations.length == 0) {
                return res.status(404).json({
                    msg: "no destinations found"
                })
            }

            

            return res.status(200).json(destinations);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
    }
    
    static async getDestination(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const destinations = await query("select * from destinations where id = ?", [req.params.id])

            if (destinations.length == 0) {
                return res.status(404).json({
                    msg: "no destinations found"
                })
            }

            

            return res.status(200).json(destinations);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
     }
}


module.exports = destinationController;     