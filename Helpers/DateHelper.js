const getDateInDDMMYY = (date) => {
    let temp = new Date(date);
    let dd = temp.getDate() < 10 ? "0" + temp.getDate() : temp.getDate();
    let mm = temp.getMonth() < 10 ? "0" + temp.getMonth() : temp.getMonth();
    const yyyy = temp.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
};

const getDateForInvoice = (date) => {
    let temp = new Date(date);
    let dd = temp.getDate() < 10 ? "0" + temp.getDate() : temp.getDate();
    let mm = temp.getMonth() < 10 ? "0" + temp.getMonth() : temp.getMonth();
    const yyyy = temp.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
};

const getDate = (dt) => {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const date = new Date(dt);
    const dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const mm = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dd} ${mm}, ${year}`;
};

module.exports = {
    getDateForInvoice,
    getDate,
};
