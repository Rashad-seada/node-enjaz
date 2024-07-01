const joi = require("joi")


function validationCreateCar(obj){
    const schema= joi.object({
        address : joi.string().required(),
        nationalId : joi.number().required(),
        plateNumber : joi.string().trim().required(),
        color : joi.string().trim().required(),
        location : joi.string().trim().required(),

    })
    return schema.validate(obj);
}

function validationGetCarByPlate(obj){
    const schema= joi.object({
        address : joi.string().required(),
        plateNumber : joi.string().trim().required(),
    })
    return schema.validate(obj);
}

function validationTransferCar(obj){
    const schema= joi.object({
        address : joi.string().required(),
        carId : joi.number().required(),
        to : joi.string().trim().required(),
    })
    return schema.validate(obj);
}

function validationWalletAddress(obj){
    const schema= joi.object({
        address : joi.string().required(),
    })
    return schema.validate(obj);
}

module.exports = {
    validationCreateCar,
    validationGetCarByPlate,
    validationTransferCar,
    validationWalletAddress,
}
