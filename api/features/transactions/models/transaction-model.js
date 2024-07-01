const joi = require("joi")


function validationWalletAddress(obj){
    const schema= joi.object({
        address : joi.string().required(),
    })
    return schema.validate(obj);
}


function validationRequestCarTransfer(obj){
    const schema= joi.object({
        address : joi.string().required(),
        carId : joi.string().required(),

    })
    return schema.validate(obj);
}

function validationTransactionConfirm(obj){
    const schema= joi.object({
        address : joi.string().required(),
        transactionId : joi.string().required(),

    })
    return schema.validate(obj);
}

module.exports = {
    validationWalletAddress,
    validationRequestCarTransfer,
    validationTransactionConfirm
}
