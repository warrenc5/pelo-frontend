
function debug(name, xhttp) {
    debug2(name +" " + xhttp.status + "  " + xhttp.responseText);
}

function debug2(message){
    if(!debugFlag)
        return ;

    //gEBI("demo").innerHTML = message + "<br/>"+gEBI("demo").innerHTML ;
    console.log(message);
}

function debugJSON(message){
    debug2(JSON.stringify(message));
}
function exitApp()
{
    debug2('exit app');
    stopAllWorkers();
    try {
        window.open("logout.html","_self");
        navigator.app.exitApp();
    } catch (e) {
        debug2(e);
    }
}

function checkLogin() {
    var data = loadJSON("auth");

    if (needsToSignIn()) {
        logout();
    } else {
        doLogin();
    }
}

function logout() {
    storage.clear();
    storage.remove("auth");
}


function needsToSignIn(data) {

    //storage.remove(AUTH);
    if (storage.has(AUTH)) {

        var data = storage.get(AUTH);

        return data == undefined || data.length == 0; // || data.lastSignedInAt < online.updatedAt
    } else {
        return true;
    }
}


function emptyRides() {
    gEBI("empty").className = "shown";
}

function emptyGroups() {
    gEBI("empty").className = "shown";
}
