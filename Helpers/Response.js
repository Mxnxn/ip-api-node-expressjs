const Response = (res, code, message) => {
    switch (code) {
        case 200:
            return res.status(code).json({ code: code, status: true, message: message });
        default:
            return res.status(code).json({ code: code, status: false, message: message });
    }
};

module.exports = { Response };
