const Bus = require("../models/bus");
const { validationResult } = require('express-validator');
const connection = require("../db/dbConnection");
const util = require("util");


class busController {
    static async createBus(req,res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkCode = await query(
                "SELECT * from busses where code = ?",
                [req.body.code]
            );
            console.log(checkCode.length);
            if (checkCode.length  > 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Bus already exists"
                    }]
                    
                });
            };

             
            console.log(req.body.code);  
            console.log(req.body.capacity );

            const BusObject = new Bus(req.body.code, req.body.capacity);
            

            await query("insert into busses set code = ?, capacity = ?", [BusObject.getCode(), BusObject.getCapacity()]); 


            return res.status(200).json(BusObject.toJSON());



        } catch (err) {
            res.status(500).json({ err: "error" }); 

        }
    }


    static async updateBus(req,res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkBus = await query(
                "SELECT * from busses where id = ?",
                [req.params.id]
            );
            if (checkBus.length  == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Bus doesn't exist"
                    }]
                    
                });
            };

             
 

            const BusObject = new Bus(req.body.code, req.body.capacity);

            const checkCode = await query(
                "SELECT * from busses where code = ?",
                [req.body.code]
            );
            if (checkCode.length  > 0 && checkBus[0].code != checkCode[0].code) {
                return res.status(400).json({
                    errors: [{
                        msg: "code already exists"
                    }]
                    
                });
            };
            

            await query("update busses set code = ?, capacity = ? where id = ?", [BusObject.getCode(), BusObject.getCapacity(), checkBus[0].id]); 


            return res.status(200).json(BusObject.toJSON());



        } catch (err) {
            return res.status(500).json({ err: "error" }); 

        }
    }    

    static async deleteBus(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkBus = await query(
                "SELECT * from busses where id = ?",
                [req.params.id]
            );
            if (checkBus.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Bus doesn't exist"
                    }]
                    
                });
            };

            await query("delete from busses where id = ?", [checkBus[0].id])

            return res.status(200).json({
                msg: "Bus deleted!"
            })

        
        } catch (err) {
            return res.status(500).json({ err: "error" }); 

        }
    }
    

    static async getBusses(req, res) { 
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            let search = ""
            if (req.query.search) {
                search =  `where code LIKE '%${req.query.search}%'`
            }
            const Busses = await query(`select * from busses ${search}`)

            if (Busses.length == 0) {
                return res.status(404).json({
                    msg: "no Busses found"
                })
            }

            

            return res.status(200).json(Busses);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
    }
    
    static async getBus(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const Bus = await query("select * from busses where id = ?", [req.params.id])

            if (Bus.length == 0) {
                return res.status(404).json({
                    msg: "no Bus found"
                })
            }

            

            return res.status(200).json(Bus);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
     }
}


module.exports = busController;     