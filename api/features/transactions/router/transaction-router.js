const ApiErrorCode = require("../../../core/errors/apiError") 
const  getEthereumContract = require("../../../core/utils/constants")
const {
    validationWalletAddress,
    validationRequestCarTransfer,
    validationTransactionConfirm
} = require("../models/transaction-model")

const express = require("express");

router = express.Router();

router.post("/", async (req,res)=> {
    try {

        const { error } = validationRequestCarTransfer(req.body);

        if (error) {
            res.status(400).json({
              status_code: ApiErrorCode.validation,
              message: error.message,
              error: {
                message: error.message,
              },
            });
          } else { 
            await getEthereumContract().methods.requestCarTransfer(
                req.body.carId
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
                    message: "request is sent successfuly",
                    data: JSON.parse(serializedValue),
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
            await getEthereumContract().methods.getCarTransactionRequests()
            .call({
                from : req.body.address
            })
            .then((value)=> {
                const serializedValue = JSON.stringify(value, (key, val) =>
                    typeof val === 'bigint' ? val.toString() : val
                );

                res.status(200).json({
                    status_code: 1,
                    message: "request is sent successfuly",
                    data: JSON.parse(serializedValue),
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

router.get("/incomming", async (req,res)=> {
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
            await getEthereumContract().methods.getRequestsForMyCars()
            .call({
                from : req.body.address
            })
            .then((value)=> {
                const serializedValue = JSON.stringify(value, (key, val) =>
                    typeof val === 'bigint' ? val.toString() : val
                );

                res.status(200).json({
                    status_code: 1,
                    message: "request is sent successfuly",
                    data: JSON.parse(serializedValue),
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

router.post("/confirm", async (req,res)=> {
    try {

        const { error } = validationTransactionConfirm(req.body);

        if (error) {
            res.status(400).json({
              status_code: ApiErrorCode.validation,
              message: error.message,
              error: {
                message: error.message,
              },
            });
          } else { 
            await getEthereumContract().methods.confirmTransaction(
                req.body.transactionId
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
                    message: "request is confirmed successfuly",
                    data: JSON.parse(serializedValue),
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

