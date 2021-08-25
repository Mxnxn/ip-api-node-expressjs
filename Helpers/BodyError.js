const { Response } = require("./Response");

const ResponseBodyError = (res, error) => {
    const msgs = error.details.map((el) => el.message);
    return Response(res, 422, msgs);
};

module.exports = {
    ResponseBodyError,
};
