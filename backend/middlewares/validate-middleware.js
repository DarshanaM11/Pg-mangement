const validate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    } catch (error) {
        const status = 400;
        const message = error.issues[0].message;
        const extraDetails = "Fill details correctly"
        const err = {
            status,
            message,
            extraDetails,
        }
        next(err);

    }
}

module.exports = validate