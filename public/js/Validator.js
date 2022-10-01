//---------------------------------------------------Const's------------------------------------------------------------
//Spirit Const's
let maxSpiritDate, minSpiritDate, maxSpiritSol;

//Curiosity Const's
let minCuriosityDate, maxCuriosityDate, maxCuriositySol;

//Opportunity Const's
let maxOpportunityDate, minOpportunityDate, maxOpportunitySol;

//--------------------------------------------------Validator-----------------------------------------------------------
//Validator
let validator = (function(){
    let validate = {};

    //------------------------------------------------------------------------------------------------------------------
    /**
     * That function checks if the input is empty.
     * @param desc
     * @returns {boolean}
     */
    validate.isEmpty = function(desc){
        return desc === '' || desc == null || desc === "ENTER search date or Sol";
    }

    //------------------------------------------------------------------------------------------------------------------
    /**
     * That function checks if date is valid.
     * @param date
     * @returns {boolean}
     */
    validate.isDate = function(date){
        let regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!date.match(regEx)) return false;  // Invalid format
        let d = new Date(date);
        let dNum = d.getTime();
        if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
        return d.toISOString().slice(0,10) === date;
    }

    //------------------------------------------------------------------------------------------------------------------
    /**
     * That function checks if num is integer.
     * @param num
     * @returns {boolean}
     */
    validate.isNumber = function(num){
        return /^-?\d+$/.test(num);
    }

    //------------------------------------------------------------------------------------------------------------------
    /**
     * That function loads the const's of the validator from the manifest(NASA server).
     */
    validate.loadManifestData = function() {
        fetch(useApiData.buildManifestURL("Curiosity"))
            .then(validator.checkFetch)
            .then(res => res.json())
            .then(data => {
                maxCuriosityDate = new Date(data.photo_manifest.max_date);
                minCuriosityDate = new Date(data.photo_manifest.landing_date);
                maxCuriositySol = data.photo_manifest.max_sol;
            })
            .catch(() => {
                alertBox.show("Some thing went wrong, please check you internet connection and try again later!",
                    "alert_box4")
            });

        fetch(useApiData.buildManifestURL("Opportunity"))
            .then(validator.checkFetch)
            .then(res => res.json())
            .then(data => {
                maxOpportunityDate = new Date(data.photo_manifest.max_date);
                minOpportunityDate = new Date(data.photo_manifest.landing_date);
                maxOpportunitySol = data.photo_manifest.max_sol;
            })
            .catch(() => {
                alertBox.show("Some thing went wrong, please check you internet connection and try again later!",
                    "alert_box4")
            });

        fetch(useApiData.buildManifestURL("Spirit"))
            .then(validator.checkFetch)
            .then(res => res.json())
            .then(data => {
                maxSpiritDate = new Date(data.photo_manifest.max_date);
                minSpiritDate = new Date(data.photo_manifest.landing_date);
                maxSpiritSol = data.photo_manifest.max_sol;
            })
            .catch(() => {
                alertBox.show("Some thing went wrong, please check you internet connection and try again later!",
                    "alert_box4")
            });
    }

    //------------------------------------------------------------------------------------------------------------------
    /**
     * That function validate the input data, and returns true, to let the project complete fetching.
     * @returns {boolean}
     */
    validate.checkDate = function() {
        let counter = 0;
        if (!validator.isNumber(document.getElementById("searchDate").value)) {
            if(validator.isEmpty(document.getElementById("searchDate").value)) {
                alertBox.show( "please fill this field!","alert_box1")
                counter++;
            }
            else if(!validator.isDate(document.getElementById("searchDate").value)) {
                alertBox.show( "please enter a valid date or Sol","alert_box1")
                counter++;
            }
            else{
                let searchDate = new Date(document.getElementById("searchDate").value);
                if(document.getElementById("inputGroupSelect01").value === "Curiosity"){
                    if(searchDate < minCuriosityDate){
                        alertBox.show(`the valid date is larger than${minCuriosityDate.toISOString().substring(0, 10)}`,
                            "alert_box1");
                        counter++;
                    }
                    else if(searchDate > maxCuriosityDate){
                        alertBox.show(`the valid date is less than ${maxCuriosityDate.toISOString().substring(0, 10)}`,
                            "alert_box1");
                        counter++;
                    }
                }
                else if(document.getElementById("inputGroupSelect01").value === "Spirit"){
                    if(searchDate < minSpiritDate){
                        alertBox.show(`the valid date is larger than ${minSpiritDate.toISOString().substring(0, 10)}`,
                            "alert_box1");
                        counter++;
                    }
                    else if(searchDate > maxSpiritDate){
                        alertBox.show( `the valid date is less than ${maxSpiritDate.toISOString().substring(0, 10)}`,
                            "alert_box1");

                        counter++;
                    }
                }
                else if(document.getElementById("inputGroupSelect01").value === "Opportunity"){
                    if(searchDate < minOpportunityDate){
                        alertBox.show(`the valid date is larger than ${minOpportunityDate.toISOString().substring(0, 10)}`,
                            "alert_box1");
                        counter++;
                    }
                    else if(searchDate > maxOpportunityDate){
                        alertBox.show(`the valid date is less than ${maxOpportunityDate.toISOString().substring(0, 10)}`,
                            "alert_box1");
                        counter++;
                    }
                }
            }
        }
        else{
            let searchDate = document.getElementById("searchDate").value;
            if(searchDate < 0){
                alertBox.show( `the valid Sol is equal or larger than 0`,"alert_box1");

                counter++;
            }

            else if(document.getElementById("inputGroupSelect01").value === "Curiosity"){
                if(searchDate > maxCuriositySol){
                    alertBox.show( `the valid Sol is less than ${maxCuriositySol}`,"alert_box1");
                    counter++;
                }
            }
            else if(document.getElementById("inputGroupSelect01").value === "Spirit"){
                if(searchDate > maxSpiritSol){
                    alertBox.show( `the valid Sol is less than ${maxSpiritSol}`,"alert_box1");
                    counter++;
                }
            }
            else if(document.getElementById("inputGroupSelect01").value === "Opportunity") {
                if (searchDate > maxOpportunitySol) {
                    alertBox.show( `the valid Sol is less than ${maxOpportunitySol}`,"alert_box1");
                    counter++;
                }
            }
        }
        if (document.getElementById("inputGroupSelect01").value === "Choose") {
            alertBox.show( "please fill this field!","alert_box2");
            counter ++;
        }
        if (document.getElementById("inputGroupSelect02").value === "Choose") {
            alertBox.show( "please fill this field!","alert_box3");
            counter ++;
        }
        return counter === 0;
    }

    //------------------------------------------------------------------------------------------------------------------

    /**
     * That function checks the fetch response if the status is ok then returns the response otherwise the function will
     * throw error
     * @param res
     * @returns {{ok}|*}
     */
    validate.checkFetch = function(res){
        if(!res.ok){
            throw Error();
        }
        return res;
    }

    //------------------------------------------------------------------------------------------------------------------

    return validate;

    //------------------------------------------------------------------------------------------------------------------

})();

//----------------------------------------------------------------------------------------------------------------------