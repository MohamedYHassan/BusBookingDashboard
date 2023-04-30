const Request = require("../models/request");
const { validationResult } = require('express-validator');
const connection = require("../db/dbConnection");
const util = require("util");


class requestController {



    static async createRequest(req,res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkCode = await query(
                "SELECT * from requests where code = ?",
                [req.body.code]
            );
            console.log(checkCode.length);
            if (checkCode.length  > 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Request already exists"
                    }]
                    
                });
            };

            const checkEmail = await query("Select * from users where email = ?", [req.body.userEmail])

            if (checkEmail.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "This user Email does not exist"
                    }]
                })
            }

            const checkAppointment = await query("Select * from appointments where code = ?", [req.body.appointmentCode])

            if (checkAppointment.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "This appointment code does not"
                    }]
                })
            }



             

            const RequestObject = new Request(req.body.code, req.body.userEmail,req.body.appointmentCode);
            

            await query("insert into requests set code = ?, user_email = ?, appointment_code = ?, status = ?", [RequestObject.getCode(), RequestObject.getUserEmail(), RequestObject.getAppointmentCode(), RequestObject.getStatus()]); 


            return res.status(200).json(RequestObject.toJSON());



        } catch (err) {
            return res.status(500).json({ err: "error" }); 

        }
    } 


    static async acceptRequest(req,res) { 
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkRequest = await query(
                "SELECT * from requests where id = ?",
                [req.params.id]
            );
            if (checkRequest.length  == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Request doesn't exist"
                    }]
                    
                });
            };



             
 
            const RequestObject = new Request(checkRequest[0].code, checkRequest[0].user_email, checkRequest[0].appointment_code);
            RequestObject.acceptStatus();




           
            

            await query("update requests set code = ?, user_email = ?, appointment_code = ?, status = ? where id = ?", [RequestObject.getCode(), RequestObject.getUserEmail(), RequestObject.getAppointmentCode(), RequestObject.getStatus() ,checkRequest[0].id]); 


            return res.status(200).json(RequestObject.toJSON());



        } catch (err) {
            return res.status(500).json({ err: "error" }); 

        }
    }    

    static async rejectRequest(req,res) { 
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkRequest = await query(
                "SELECT * from requests where id = ?",
                [req.params.id]
            );
            if (checkRequest.length  == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Request doesn't exist"
                    }]
                    
                });
            };



             
 
            const RequestObject = new Request(checkRequest[0].code, checkRequest[0].user_email, checkRequest[0].appointment_code);

            RequestObject.rejectStatus();



           
            

            await query("update requests set code = ?, user_email = ?, appointment_code = ?, status = ? where id = ?", [RequestObject.getCode(), RequestObject.getUserEmail(), RequestObject.getAppointmentCode(), RequestObject.getStatus() ,checkRequest[0].id]); 


            return res.status(200).json(RequestObject.toJSON());



        } catch (err) {
            return res.status(500).json({ err: "error" }); 

        }
    } 
    

    static async getRequests(req, res) { 
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
            const Requests = await query(`select * from requests ${search}`)

            if (Requests.length == 0) {
                return res.status(404).json({
                    msg: "no Requests found"
                })
            }

            

            return res.status(200).json(Requests);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
    }
    
    static async getRequest(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const Request = await query("select * from requests where id = ?", [req.params.id])

            if (Request.length == 0) {
                return res.status(404).json({
                    msg: "no Request found"
                })
            }

            

            return res.status(200).json(Bus);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
     }
}


module.exports = requestController;     