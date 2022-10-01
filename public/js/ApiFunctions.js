//----------------------------------------------------------------------------------------------------------------------

let ApiData = (function (){

    //------------------------------------------------------------------------------------------------------------------

    let API = {}

    //------------------------------------------------------------------------------------------------------------------
    /**
     * This function adds a photo to the db.
     * @param id
     * @param url
     * @param sol
     * @param earthDate
     * @param camera
     */
    API.addPhoto = function(id,url, sol, earthDate, camera) {
        const data = {
            imageId: id,
            Src: url,
            Sol: sol,
            EarthDate: earthDate,
            Camera: camera

        }
        fetch('/add', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(validator.checkFetch)
            .catch(error => {
                ApiData.showError('TimeOut Session, please login again(redirecting to login page in few sec)!');
                setTimeout("ApiData.pageRedirect('/')",3000);
            });
    }

    //------------------------------------------------------------------------------------------------------------------
    /**
     * This function deletes a photo from the db.
     * @param url
     */
    API.deletePhoto = function(url){
        const data = {
            Url: url
        }
        fetch('/delete', {
            method: "delete",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then(validator.checkFetch)
            .catch(error => {
                ApiData.showError('TimeOut Session, please login again(redirecting to login page in few sec)!')
                setTimeout("ApiData.pageRedirect('/')",3000);
            });
    }

    //------------------------------------------------------------------------------------------------------------------
    /**
     * This function reset the list of saved photos to specific client.
     */
    API.resetList = function(){
        fetch('/reset', {
            method: "delete",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(validator.checkFetch)
            .catch(error => {
                ApiData.showError('TimeOut Session, please login again(redirecting to login page in few sec)!')
                setTimeout("ApiData.pageRedirect('/')",3000);
            })
    }

    //------------------------------------------------------------------------------------------------------------------
    /**
     * This function return the list of saved photos to specific client.
     */
    API.getList = function(){
        fetch('/getList')
            .then(validator.checkFetch)
            .then(res => res.json())
            .then(json => {
                useApiData.addSavedList(json);
            })
            .catch(error => {
                ApiData.showError('TimeOut Session, please login again(redirecting to login page in few sec)!')
                setTimeout("ApiData.pageRedirect('/')",3000);
            })
    }

    //------------------------------------------------------------------------------------------------------------------
    /**
     * This function return the list of saved photos to specific client.
     */
    API.logOut = function(){
        fetch('/logOut')
            .then(validator.checkFetch)
            .then(res => {
                ApiData.pageRedirect('/')
            })
            .catch(error => {
                ApiData.showError('TimeOut Session, please login again(redirecting to login page in few sec)!')
                setTimeout("ApiData.pageRedirect('/')",3000);
            })
    }

    //------------------------------------------------------------------------------------------------------------------
    /**
     * This function shows the error in nasa page.
     * @param title
     */
    API.showError = function(title) {
        alertBox.show(title , "alert_box4")
    }

    //------------------------------------------------------------------------------------------------------------------
    /**
     * This function do redirection to the specific location.
     * @param location
     */
    API.pageRedirect = function (location) {
        window.location.href = location;
    }

    //------------------------------------------------------------------------------------------------------------------

    return API;

    //------------------------------------------------------------------------------------------------------------------

})();

//----------------------------------------------------------------------------------------------------------------------
