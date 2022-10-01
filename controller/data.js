//----------------------------------------------------------------------------------------------------------------------

const dbModels = require('../models');

//----------------------------------------------------------------------------------------------------------------------
/**
 * Search for user in database
 * @param email: desired user
 * @returns username object
 */
let getUser = (email) => dbModels.User.findOne({where: {email: email}});

//----------------------------------------------------------------------------------------------------------------------
/**
 * This function removes the extra white spaces from a string.
 * @param str
 * @returns {string}
 */
function removeExtraWhiteSpaces(str){
    return str.replace(/\s+/g,' ').trim();
}


//----------------------------------------------------------------------------------------------------------------------
/**
 * This function gets two passwords and check if they equal.
 * @param pass
 * @param conPass
 * @returns {boolean}
 */
function checkPassword(pass, conPass){
    if(pass !== conPass)
        return false;
    return pass.length >= 8;

}

//----------------------------------------------------------------------------------------------------------------------

module.exports = {checkPassword, getUser, removeExtraWhiteSpaces};

//----------------------------------------------------------------------------------------------------------------------