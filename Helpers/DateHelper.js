const Sheet = require("../Model/Sheet");
const Entry = require("../Model/Entry");

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

/**
 *
 * @param {String} date in Standard format to dd/mm/yyyy
 */
const isDateExists = async (date, uid) => {
    const allSheets = await Sheet.find({ uid: uid });

    const bool = allSheets.findIndex((sheet) => getDateInDDMMYY(sheet.date) === getDateInDDMMYY(date));

    if (bool === -1) return false;
    return allSheets[bool]._id;
};

/**
 * @param {String} entryId // this is entryid of existing date
 * @param {String} date  // this is new date coming in request
 */

const isDateExistForEditAction = async (entryId, date) => {
    // Getting Exisiting Object in Entry Collection
    const existing = await Entry.findOne({ _id: entryId });
    // Converting its date formate to dd/mm/yyyy
    const oldDate = getDateInDDMMYY(existing.date);
    // Converting new Date to dd/mm/yyyy
    const newDate = getDateInDDMMYY(date);
    // Getting all sheets
    const allSheets = await Sheet.find({});
    // Checking for existances of new Date came in Sheet
    const sheetIndex = allSheets.findIndex((sheet) => getDateInDDMMYY(sheet.date) === newDate);
    // for old date
    const oldSheet = await Sheet.findOne({ date: existing.date });
    // Getting sheet that already exists
    const sheet = allSheets[sheetIndex];

    // Sheet that has new date doesn't exist then this block will execute
    if (oldDate !== newDate && sheetIndex === -1) {
        if (oldSheet) {
            return { action: "CHANGED_DATE", osid: oldSheet._id, uid: existing.uid };
        }
    }
    // Sheet with new Date exists than checking if old date and new date is same
    if (sheetIndex !== -1) {
        if (oldDate === newDate) return { action: "SAME_DATE", sid: sheet._id };
        // to pull from oldsheet and append in new one
        return {
            action: "CHANGED_DATE_EXCEPT",
            osid: oldSheet._id,
            nsid: sheet._id,
        };
    }
    return { action: "CREATE_NEW" };
};

module.exports = {
    isDateExists,
    isDateExistForEditAction,
    getDateForInvoice,
};
