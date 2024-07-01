const ApiErrorCode = require("../../../core/errors/apiError") 
const  getEthereumContract = require("../../../core/utils/constants")
const {
    validationCreateCar,
    validationGetCarByPlate,
    validationTransferCar,
    validationWalletAddress
} = require("../models/car-model")
const express = require("express");
router = express.Router();

router.post("/", async (req,res)=> {
    try {

        const { error } = validationCreateCar(req.body);

        if (error) {
            res.status(400).json({
              status_code: ApiErrorCode.validation,
              message: error.message,
              error: {
                message: error.message,
              },
            });
          } else { 
            await getEthereumContract().methods.createCar(
                BigInt(req.body.nationalId),
                req.body.plateNumber,
                req.body.color,
                req.body.location,
            )
            .send({
                from : req.body.address
            })
            .then((value)=> {
                res.status(200).json({
                    status_code: 1,
                    message: "car register successfuly",
                    data : req.body,
                  });
            }).catch((error)=> {
                res.status(400).json({
                    status_code: ApiErrorCode.validation,
                    message: error.message,
                    error: {
                      message: error.message,
                    },
                  });
            })

          }



    } catch(error) {
        res.status(500).json({
            status_code: ApiErrorCode.internalError,
            message: "The server is down, please try again later",
            error: {        
                message: error.message,
            },
        });
    }
    
})

router.get("/", async (req,res)=> {
    try {

        const { error } = validationWalletAddress(req.body);

        if (error) {
            res.status(400).json({
              status_code: ApiErrorCode.validation,
              message: error.message,
              error: {
                message: error.message,
              },
            });
          } else { 
            await getEthereumContract().methods.getMyCars()
            .call({
                from : req.body.address
            })
            .then((value)=> {

                const serializedValue = JSON.stringify(value, (key, val) =>
                    typeof val === 'bigint' ? val.toString() : val
                );

                res.status(200).json({
                    status_code: 1,
                    message: "Got cars successfully",
                    data: JSON.parse(serializedValue),
                });
              
            }).catch((error)=> {
                res.status(500).json({
                    status_code: ApiErrorCode.internalError,
                    message: error.message,
                    error: {
                      message: error.message,
                    },
                  });
            })

          }



    } catch(error) {
        res.status(500).json({
            status_code: ApiErrorCode.internalError,
            message: "The server is down, please try again later",
            error: {        
                message: error.message,
            },
        });
    }
    
})


router.get("/:number", async (req,res)=> {
    try {

        const { error } = validationWalletAddress(req.body);

        if (error) {
            res.status(400).json({
              status_code: ApiErrorCode.validation,
              message: error.message,
              error: {
                message: error.message,
              },
            });
          } else { 
            await getEthereumContract().methods.getCarByPlateNumber(
                req.params.number
            )
            .call({
                from : req.body.address
            })
            .then((value)=> {

                const serializedValue = JSON.stringify(value, (key, val) =>
                    typeof val === 'bigint' ? val.toString() : val
                );

                res.status(200).json({
                    status_code: 1,
                    message: "Got cars successfully",
                    data: JSON.parse(serializedValue),
                });
              
            }).catch((error)=> {
                res.status(500).json({
                    status_code: ApiErrorCode.internalError,
                    message: error.message,
                    error: {
                      message: error.message,
                    },
                  });
            })

          }



    } catch(error) {
        res.status(500).json({
            status_code: ApiErrorCode.internalError,
            message: "The server is down, please try again later",
            error: {        
                message: error.message,
            },
        });
    }
    
})

router.post("/transfer", async (req,res)=> {
    try {

        const { error } = validationTransferCar(req.body);

        if (error) {
            res.status(400).json({
              status_code: ApiErrorCode.validation,
              message: error.message,
              error: {
                message: error.message,
              },
            });
          } else { 
            await getEthereumContract().methods.transferCar(
                req.body.carId,
                req.body.to
            )
            .send({
                from : req.body.address
            })
            .then((value)=> {

                const serializedValue = JSON.stringify(value, (key, val) =>
                    typeof val === 'bigint' ? val.toString() : val
                );

                res.status(200).json({
                    status_code: 1,
                    message: "transfered the car successfully",
                    data: JSON.parse(serializedValue),
                });
              
            }).catch((error)=> {
                res.status(500).json({
                    status_code: ApiErrorCode.internalError,
                    message: error.message,
                    error: {
                      message: error.message,
                    },
                  });
            })

          }



    } catch(error) {
        res.status(500).json({
            status_code: ApiErrorCode.internalError,
            message: "The server is down, please try again later",
            error: {        
                message: error.message,
            },
        });
    }
    
})

module.exports = router;

