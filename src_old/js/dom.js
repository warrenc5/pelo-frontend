var AUTH="auth";

function toggleRoute(rideId) {
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

/*
function render(hint) {

  var f = gEBI("following");

  var data = loadJSON("todays-rides");

  debugJSON(data);

  if (data == null || !Array.isArray(data)){
    debug2("ride data null or not array");
    return;
  }

  if (data.length == 0) {
    emptyRides();
  }

  for (var k =0 ; k < data.length;  k ++ ) {
    //if (data[k].isCompleted())
     // return; 
      var rideId = data[k].id;
      var satId = "satId" +rideId;
      var s; 
      var r;
      var u;
      var t=cE("table");

      aC([t,
          [ cE("tr"), 
              [ cE("td"), 
                 [ s = cE("img", [{name: "id" , value: satId},{name:"src",value:"img/sat1.png"}])]
              ],
              [ cE("td", [{name:"class",value: "name"}]) ,
                [ cTN(data[k].name) ]
              ],
              [ cE("td", [{name:"class",value: "small"}]) ,
                [ cTN(data[k].startTime + " " + data[k].startDate) ]
              ],
              [ cE("td"), 
                 [ r = cE("img", [{name: "id" , value: "rideId"+rideId},{name:"src",value:"img/route.png"}])]
              ]
            ],
          [ cE("tr"), 
              [ cE("td", [{name : "colspan", value: "3"}, {name:"class",value: "small"}]) ,
                [ cTN(data[k].description) ],
                [ cTN(" ") ],
                //[ cTN(data[k].location) ],
              ]
            ],
            [ cE("tr"), 
              [ cE("td", [{name : "colspan", value: "3"}, {name:"class",value: "small"}]) ,
                [
                  u=cE("table", [{name: "id", value: "users" + rideId}]),
                  cE("input",[{name: "id", value: "encoded-polyline" + rideId},{name:"class", value :"hidden"}])
                ]
              ]
            ]
         ]);

        r.addEventListener("click", function(){ 
          currentRideId = rideId;
          toggleRoute(rideId);
        });

      s.addEventListener("click", function(){ 
        toggleTracking(rideId);
      });

      for (var i =0 ; i < data[k].participants.length;  i ++ ) {
        var v ;

        var role = (data[k].participants[i].role == "captain" )?"captain.png":"rider.png";

        storeUser(data[k].participants[i]);

        aC([u,
              [ v=cE("tr"), 
                [ cE("td") ,
                    [
                    cE("img", [{name:"src",value:"img/"+data[k].participants[i].avatarFileName}]),
                    ]
                ],
                [ cE("td",[{name:"class",value:"name"}]),
                  [ cTN(data[k].participants[i].slug) ]
                ],
                [ cE("td"),
                  [ cE("img", [{name : "class", value: "hidden"},{name: "id", value: "ride" +rideId + "user" + data[k].participants[i].id}, {name:"src",value:"img/"+role}])
                  ]
                ]
              ],
              [cE("tr"),
                [ cE("td",[{name:"class",value:"status"},{name:"colspan", value: "3"}]),
                  [cTN(data[k].participants[i].name)],
                  [cTN(" @ ")],
                  [cTN(distances.get(data[k].participants[i].id))]
                ]
              ]
            ]
        );

           
      }
      f.appendChild(t);
  }

}
*/

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

function aC(struct){
  var o = struct[0];
  //alert("s:" + struct.length + "> "+ struct);

  if(struct.length==1){
    return o;
  }

  for (var i = 1 ; i < struct.length;  i ++ ) {
    
    if(struct[i] instanceof Array) { 
      //alert("o:" + o + " s:" + struct.length +">" + struct[i]);
      var v = aC(struct[i]);
      //alert("o:" + o + " v:" + v);
      o.appendChild(v);
    } else {
      //alert("o:" + o + " a:" + struct[i]);
      o.appendChild(struct[i]);
    }
  }
  //alert("o : " + o);
  return o;
}

function gEBI(name) {
  return document.getElementById(name);
}
function cTN(value) {
  return document.createTextNode(value);
}

function cE(name,attributes) {
  var e = document.createElement(name);
  if (attributes != undefined) {
    for (i =0 ; i < attributes.length;  i ++ ) {
      //alert(attributes[i].value);
      e.setAttribute(attributes[i].name,attributes[i].value);
    }
  }
  return e;
}


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

