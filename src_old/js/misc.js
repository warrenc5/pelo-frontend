import * as globals from './init'

export function debug(name, xhttp) {
    debug2(name +" " + xhttp.status + "  " + xhttp.responseText);
}

export function debug2(message){
    if(!globals.debugFlag)
        return ;

    //gEBI("demo").innerHTML = message + "<br/>"+gEBI("demo").innerHTML ;
    console.log(message);
}

export function debugJSON(message){
    debug2(JSON.stringify(message));
}

function emptyRides() {
    gEBI("empty").className = "shown";
}

function emptyGroups() {
    gEBI("empty").className = "shown";
}
