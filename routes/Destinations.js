const router = require("express").Router();
const { body } = require('express-validator');
const DestinationController = require("../controllers/destinationController"); 
const authorized = require("../middleware/authorized");
const admin = require("../middleware/admin");


router.post("/", admin,
    body("code").isString().withMessage("Please enter a valid code")
        .isLength({ min: 3, max: 6 }).withMessage("code should be at least 3 characters"),    
    body("name").isString().withMessage("Please enter valid name")
        .isLength({ min: 5, max: 20 }).withMessage("name should be at least 5 letters"), 
      (req, res) => {
          DestinationController.createDestination(req, res);
        }
);


router.put("/:id", admin,
    body("code").isString().withMessage("Please enter a valid code")
        .isLength({ min: 3, max: 6 }).withMessage("code should be at least 3 characters"),    
    body("name").isString().withMessage("Please enter valid name")
        .isLength({ min: 5, max: 20 }).withMessage("name should be at least 5 letters"), 
      (req, res) => {
          DestinationController.updateDestination(req, res);
        }
);


router.delete("/:id", admin, (req, res) => {
    DestinationController.deleteDestination(req, res);
})

router.get("/", authorized, (req, res) => {
    DestinationController.getDestinations(req, res);
})

router.get("/:id", authorized, (req, res) => {
    DestinationController.getDestination(req, res);
})






module.exports = router;
