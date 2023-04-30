const router = require("express").Router();
const { body } = require('express-validator');
const appointmentController = require("../controllers/appointmentController"); 
const authorized = require("../middleware/authorized");
const admin = require("../middleware/admin");
const moment = require("moment");

const currentTime = moment();

router.post("/", admin,
    body("code").isString().withMessage("Please enter a valid code"),
    body("source").isString().withMessage("Please enter a valid city"),
    body("destination").isString().withMessage("Please enter a valid city"),
    body("start_datetime").isISO8601().custom((value) => {
        const startTime = moment(value);
        if (!startTime.isAfter(currentTime)) {
            throw new Error("Appointment start time must be after the current time")
        }
        return true;

    }).withMessage("Please enter a valid date (yyyy-mm-ddThh:mm:ss+02:00)"),
    body("end_datetime").isISO8601().custom((value, {req}) => {
        const startTime = moment(req.body.start_datetime)
        const endTime = moment(value);
        if (!endTime.isAfter(startTime)) {
            throw new Error("Appointment end time must be after the start time")
        }
        return true;

    }).withMessage("Please enter a valid date (yyyy-mm-ddThh:mm:ss+02:00)"),
    body("bus").isString().withMessage("Please enter a valid bus"),
    body("price").isNumeric().withMessage("please enter a valid number"),
      (req, res) => {
          appointmentController.createAppointment(req, res);
        }
);


router.put("/:id", admin,
    body("code").isString().withMessage("Please enter a valid code"),
    body("source").isString().withMessage("Please enter a valid city"),
    body("destination").isString().withMessage("Please enter a valid city"),
    body("start_datetime").isISO8601().custom((value) => {
        const startTime = moment(value);
        if (!startTime.isAfter(currentTime)) {
            throw new Error("Appointment start time must be after the current time")
        }
        return true;

    }).withMessage("Please enter a valid date (yyyy-mm-ddThh:mm:ssZ)"),
    body("end_datetime").isISO8601().custom((value) => {
        const startTime = moment(req.body.start_datetime)
        const endTime = moment(value);
        if (!endTime.isAfter(startTime)) {
            throw new Error("Appointment end time must be after the start time")
        }
        return true;

    }).withMessage("Please enter a valid date (yyyy-mm-ddThh:mm:ssZ)"),
    body("bus").isString().withMessage("Please enter a valid bus"),
    body("price").isNumeric().withMessage("please enter a valid number"),
      (req, res) => {
          appointmentController.updateAppointment(req, res);
        }
);


router.delete("/:id", admin, (req, res) => {
    appointmentController.deleteAppointment(req, res);
})

router.get("/", admin, (req, res) => {
    appointmentController.getAppointments(req, res);
})

router.get("/:id", admin, (req, res) => {
    appointmentController.getAppointment(req, res);
})






module.exports = router;