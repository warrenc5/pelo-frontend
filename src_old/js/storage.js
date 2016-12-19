//document.addEventListener("deviceready", onDeviceReady, false);

function MyStorage() {
  if (!(this instanceof MyStorage))
    return new MyStorage();
}
var _storage; 

MyStorage.prototype = {

  init:function() {
         if(typeof(Storage) != "undefined") {
         _storage = localStorage;
         } else {
           alert("no storage available on device");
         }
  },
    
	put:function(name,value) {
    try {
      _storage.setItem(name,value);
    } catch (x){
      alert(x);
    }
	},


 	has:function(name) {
    try {
      if ((value = _storage.getItem(name)) != undefined) {
        return true;
      }
    } catch (x) { 
    }
    return false; 
  },
    
	get:function(name) {
    var value;
    try {
      if ((value = _storage.getItem(name)) != undefined) {
        value = _storage.getItem(name);
      }
      else {
      //alert("no name");
      }
    } catch (x) { 
      alert(x);
    }
    return value;
	},
    
	remove:function(name) {
    var value; 
    try {
      if ((value = _storage.getItem(name)) != undefined) {
        _storage.removeItem(name);
      }
      else {
      }
    } catch(x) {
      alert(x);
    }
    return value;
	},
    
	clear:function() {
    try {
      _storage.clear();
    } catch(x){
      alert(x);
    }
	}
}

function getCurrentUser() {
  return storage.get("auth"); 
}

function getUser(userId) {
  return storage.get("userId"+userId); 
}

function loadJSON(name) {
  var data = storage.get(name);
  if (data == null || data.length == 0) 
    return null;

  try {
  data = JSON.parse(data);
  } catch (e) {
    debug2(data + " invalid"); 
    return null;
  }
  return data;
}
function storeJSON(name,data) {
  storage.put(name,data);
  try {
    var data = JSON.parse(data);
    bind(name,data);
    return data;
  } catch (e) {
    debug2("no valid json " + name +" " +e );
    return null;
  }
}

function storeUser(data) {
  storage.put("userId"+data.id,data);
}

