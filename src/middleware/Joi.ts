import Joi from "joi";

// Register Validation
// !!!! Come back correct the 'any' type once it's been confirmed what type will be passed  !!!!
const registerValidation = (data: any) => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data)
}

const loginValidation = (data: any) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data)
}


export { registerValidation, loginValidation }