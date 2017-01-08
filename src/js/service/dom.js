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



