const Appointment = require("../models/appointment");
const { validationResult } = require('express-validator');
const connection = require("../db/dbConnection");
const util = require("util");
const moment = require("moment")


class appointmentController {
    static async createAppointment(req,res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkCode= await query(
                "SELECT * from appointments where code = ?",
                [req.body.code]
            );
            console.log(checkCode.length);
            if (checkCode.length  > 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Appointment already exists"
                    }]
                    
                });
            };

            const checkSource = await query("Select * from destinations where code = ?", [req.body.source]);

            if (checkSource.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Source city does not exist"
                    }]
                    
                });
            }

            const checkDestination = await query("Select * from destinations where code = ?", [req.body.destination]);

            if (checkDestination.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Destination city does not exist"
                    }]
                    
                });
            }

            const checkBus = await query("Select * from busses where code = ?", [req.body.bus]);

            if (checkBus.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Bus does not exist"
                    }]
                    
                });
            }


            if (req.body.source == req.body.destination) {
                return res.status(400).json({
                    errors: [{
                        msg: "Source can't be also the destination"
                    }]
                })
            }

            const start_datetime = moment(req.body.start_datetime).format('YYYY-MM-DD HH:mm:ss');
            const end_datetime = moment(req.body.end_datetime).format('YYYY-MM-DD HH:mm:ss');   




            const checkBusTime = await query("select * from appointments where bus = ? AND start_datetime <= ? AND end_datetime >= ?", [req.body.bus, req.body.start_datetime, req.body.end_datetime])
            
            if (checkBusTime.length > 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "This bus has another appointment at this time"
                    }]
                })
            }


           



            const AppointmentObject = new Appointment(req.body.code, req.body.source, req.body.destination,start_datetime, end_datetime, req.body.bus, req.body.price);


            



            await query("insert into appointments set code = ?, source = ?, destination = ?, start_datetime = ?, end_datetime = ?, bus = ?, price = ?", [AppointmentObject.getCode(), AppointmentObject.getSource(), AppointmentObject.getDestination(), AppointmentObject.getStartDatetime(), AppointmentObject.getEndDatetime(), AppointmentObject.getBus(), AppointmentObject.getPrice()]); 



            return res.status(200).json(AppointmentObject.toJSON());



        } catch (err) {
            res.status(500).json({ err: "error" }); 

        }
    }


    static async updateAppointment(req,res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkAppointment = await query(
                "SELECT * from appointments where id = ?",
                [req.params.id]
            );
            if (checkAppointment.length  == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Appointment doesn't exist"
                    }]
                    
                });
            };

            const checkSource = await query("Select * from destinations where code = ?", [req.body.source]);

            if (checkSource.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Source city does not exist"
                    }]
                    
                });
            }

            const checkDestination = await query("Select * from destinations where code = ?", [req.body.destination]);

            if (checkDestination.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Destination city does not exist"
                    }]
                    
                });
            }

            const checkBus = await query("Select * from busses where code = ?", [req.body.bus]);

            if (checkBus.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Bus does not exist"
                    }]
                    
                });
            }

            if (req.body.source == req.body.destination) {
                return res.status(400).json({
                    errors: [{
                        msg: "Source can't be also the destination"
                    }]
                })
            }

            const start_datetime = moment(req.body.start_datetime).format('YYYY-MM-DD HH:mm:ss');
            const end_datetime = moment(req.body.end_datetime).format('YYYY-MM-DD HH:mm:ss');   




            const checkBusTime = await query("select * from appointments where bus = ? AND start_datetime <= ? AND end_datetime >= ?", [req.body.bus, req.body.start_datetime, req.body.end_datetime])
            
            if (checkBusTime.length > 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "This bus has another appointment at this time"
                    }]
                })
            }

             
 

            const AppointmentObject = new Appointment(req.body.code, req.body.source, req.body.destination, start_datetime, end_datetime, req.body.bus, req.body.price);

            const checkCode = await query(
                "SELECT * from appointments where code = ?",
                [req.body.code]
            );
            if (checkCode.length  > 0 && checkAppointment[0].code != checkCode[0].code) {
                return res.status(400).json({
                    errors: [{
                        msg: "code already exists"
                    }]
                    
                });
            };

            
            

            await query("update appointments set code = ?, source = ?, destination = ?, date = ?, time = ?, bus = ?, price = ? where id = ?", [AppointmentObject.getCode(), AppointmentObject.getSource(), AppointmentObject.getDestination(), AppointmentObject.getStartDatetime(),AppointmentObject.getEndDatetime(), AppointmentObject.getBus(), AppointmentObject.getPrice(),checkAppointment[0].id]); 


            return res.status(200).json(AppointmentObject.toJSON());



        } catch (err) {
            return res.status(500).json({ err: "error" }); 

        }
    }    

    static async deleteAppointment(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const checkAppointment = await query(
                "SELECT * from appointments where id = ?",
                [req.params.id]
            );
            if (checkAppointment.length == 0) {
                return res.status(400).json({
                    errors: [{
                        msg: "Appointment doesn't exist"
                    }]
                    
                });
            };

            await query("delete from appointments where id = ?", [checkAppointment[0].id])

            return res.status(200).json({
                msg: "Appointment deleted!"
            })

        
        } catch (err) {
            return res.status(500).json({ err: "error" }); 

        }
    }
    

    static async getAppointments(req, res) { 
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
            const Appointments = await query(`select * from appointments ${search}`)

            if (Appointments.length == 0) {
                return res.status(404).json({
                    msg: "no Appointments found"
                })
            }

            

            return res.status(200).json(Appointments);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
    }
    
    static async getAppointment(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            const query = util.promisify(connection.query).bind(connection);
            const Appointment = await query("select * from appointments where id = ?", [req.params.id])

            if (Appointment.length == 0) {
                return res.status(404).json({
                    msg: "no Appointment found"
                })
            }

            

            return res.status(200).json(Appointment);



        } catch (err) {
            return res.status(500).json({ err: err });
            
        }
     }
}


module.exports = appointmentController;     