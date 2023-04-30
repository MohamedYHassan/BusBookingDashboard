const router = require("express").Router();
const { body } = require('express-validator');
const requestController = require("../controllers/requestController"); 
const authorized = require("../middleware/authorized");
const admin = require("../middleware/admin");


router.post("/", authorized,
    body("code").isString().withMessage("Please enter a valid code")
        .isLength({ min: 3, max: 8 }).withMessage("code should be at least 3 characters & max 8 characters"),    
    body("userEmail").isEmail().withMessage("Please enter valid email"),
    body("appointmentCode").isString().withMessage("Please enter valid appointment code"),
      (req, res) => {
          requestController.createRequest(req, res);
        }
);


router.put("/:id", admin,
    (req, res) => {
        if (req.query.action == "accept") {
            requestController.acceptRequest(req, res);
        }
        else if (req.query.action == "reject") {
            requestController.rejectRequest(req, res);
        }
        else {
            res.status(400).json({
                msg: "Invalid action"
            })
        }
        }
        
);


router.get("/", admin,
    (req, res) => {
        requestController.getRequests(req, res);
    })


router.get("/:id", admin,
    (req, res) => {
        requestController.getRequest(req, res);
    })









module.exports = router;