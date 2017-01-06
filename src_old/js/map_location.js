const MapboxClient = require('mapbox');

        function initMap2(){
        //  storage = new MyStorage();
        //  storage.init();
        //  accessToken="pk.eyJ1Ijoid2FycmVuYzUiLCJhIjoiY2lqNWJyZGdwMDA1b3VkbHZxbHdtcWh6bCJ9.q_fttPToEFTe6tnFFC2K8g"
          //rideRoute();
          //var data = storage.get("ride-route");
          //plotFitRoute(data);
        }

        function round(v) {
          return Math.round(v * 100000) / 100000;
        }

        function posify(lat1, lng1) {  
          var pos1 = { lat: lat1,lng:lng1};
          return pos1;
        }

        var route; 

        function plotFitRoute(data) { 
          if(!Array.isArray(data.route)) {
            debug2("error data is not an array");
            return; 
          }

          var route = new Array();

          debug2("route length " + data.route.length);

          var startpos = data.start;
          var endpos = data.end;

          debug2("route " + JSON.stringify(data.route[1]));

          for (i=0 ; i<data.route.length ; i++) {
            var lat;
            var lng;
            var pos;
          
            if(data.route[i].lat!=undefined && data.route[i].lng!=undefined) {
              pos = posify(data.route[i].lat, data.route[i].lng);
            }

            if (pos != null) {
              //debug2(pos);
              route[route.length] = pos;
            }
          }

          debug2("route length " + route.length);

          if(startpos==null) {
            startpos = route[0];
          }

          if(endpos==null) {
            endpos = route[route.length-1];
          }

          initMap(data.id,startpos);


          updatePolys("encoded-polyline"+currentRideId,route);
          addMarker(3,startpos,null,'beer');//,"img/end.png");
          addMarker(2,endpos,null,'embassy');//,"img/start.png");

          refreshMap();
          plotRiderLocations();

          gEBI("working").className="hidden"; 
        }

        function plotRiderLocations() {
          var data = loadJSON("rideLocations");
          
          for (var k =0 ; k < data.length;  k ++ ) {
            var user = getUser(data[k].userId);
            if(user == null) {
              debug2("no user " + data[k].userId);
              continue;
            }

            if (data[k].location == undefined) 
              continue; 

            //if (!isCurrentUserId(data[k].userId)){
              debug2(JSON.stringify(data[k]));
              var userImage = user.avatarFileName

              addMarker((user.role == "captain"?1:3),
                  posify(data[k].location.lat, data[k].location.lng), 
                  userImage, user.name);
            //} else {
            //}
          } 
        }

        function isCurrentUserId(userId) {
          if(currentUserId == null) {
            currentUserId = getCurrentUser().userId; 
          }

          if(userId == currentUserId){
            return true;
          } else return false;
        }
        

/*
   var GoogleMapsLoader = require('google-maps'); // only for common js environments 

   GoogleMapsLoader.load(function(google) {
//new google.maps.Map(el, options);
var pos = {lat -33.865, lng: 151.209444};

var map = new google.maps.Map(document.getElementById('map'), {
center: pos,
zoom: 6
});

initMap();

});

*/
/*
   GoogleMapsLoader.release(function() {
   console.log('No google maps api around');
   });
   GoogleMapsLoader.KEY='AIzaSyBmSX4qpXNc1-aREjx3lsHqmtmpMFPd8Bk';
   */
var options = { enableHighAccuracy: true };
var watchId;
var poly;

function updatePosition(map, position, infoWindow) {
  var  pos = {
lat: position.coords.latitude,
     lng: position.coords.longitude
  };

  //alert(pos.lat + " "+ pos.lng);

  infoWindow.setPosition(pos);
  infoWindow.setContent('<img src="img/me.png"/><span>Ready 2 ride.</span>');
  map.setCenter(pos);
  return pos;
}

function updatePolys(encoded,pos) {
  for (i = 0; i<pos.length ; i++){
      updatePoly(pos[i]);
  }
  //debug2(JSON.stringify(poly.getLatLngs()));
  //encodePoly(encoded);
}

function updatePoly(pos) {
  if(pos==null) {
    return;
  }
  var path = poly.getLatLngs();
  path.push([pos.lat , pos.lng]);

}

function gm_updatePoly(pos) {
  if(pos==null) {
    return;
  }

  var path = poly.getPath();
  path.push(new google.maps.LatLng(pos.lat , pos.lng));

}

function encodePoly(encoded) {
  try {
    var encodeString = google.maps.geometry.encoding.encodePath(poly.getPath());
    if (encodeString.length > 0) {
      document.getElementById(encoded).value = encodeString;
    }
  } catch (e) { 
    debug2('encode poly' + e + '<br/>');
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos ,error) {
  infoWindow.setPosition(pos);
  if ( error != null) {
    alert(error.code + " "+ error.message);
  }
  alert(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
}

var options = { timeout: 5000, enableHighAccuracy: true, maximumAge: 30000 };

function getLocation(success, error, fatal) { 
  if (navigator.geolocation) {
    debug2('geolocate ' + JSON.stringify(navigator.geolocation));
    navigator.geolocation.getCurrentPosition(
    //var watchID = navigator.geolocation.watchPosition(
        function(position) {
          debug2('geolocated ' + position.coords.latitude +" " + position.coords.longitude);

          success({'lat': position.coords.latitude, 'lng':position.coords.longitude} );
          try{
            if(watchID)
            navigator.geolocation.clearWatch( watchID );
          }catch(e){};
        },
        function(x) {
          debug2('geolocate error ' + x.code +" " + x.message);
          try{
            if(watchID)
            navigator.geolocation.clearWatch( watchID );
          }catch(e){};
          error(x)
        }
        , options
    );
  } else {
    fatal();
  }
}


function center(pos) { 
  map.panTo([pos.lat,pos.lng]);
}

var markers = {};

function addMarker(z, pos,img, text){
  if(markers[text] == null) {
    var marker = L.marker(pos, {
  icon: L.mapbox.marker.icon({
            'marker-color': '#f86767',
            'marker-symbol':  text
            })
    });
    marker.addTo(map);
    markers[text] = marker;
  } else {

    var marker = markers[text]; 
    //marker.setLatLng(L.latLng(
    marker.setLatLng(pos);
    marker.addTo(map);

  }
  
}
function addMarker2(z, pos,img, text){
  mi = gEBI("marker");
  mi.src = img;
  height = mi.height;
  width = mi.width;

  L.marker([pos.lat, pos.lng], {
    icon: L.icon({
    iconUrl: img,
    iconSize: [height, width],
    })
    }).addTo(map);
}

function gm_addMarker(z, pos,img, text){
  mi = gEBI("marker");
  mi.src = img;
  height = mi.height;
  width = mi.width;

  var image = {
    url: img,
    size: new google.maps.Size(width, height),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(width/10, height)
  };

  var shape = {
    coords: [1, 1, width, 1, width/2, height],
    type: 'poly'
  };

  var marker = new google.maps.Marker({
      position: pos,
      map: map,
      icon: image,
      shape: shape,
      title: text,
      zIndex: z
    });
}

function addInfo(pos,img){
  var infoWindow = new google.maps.InfoWindow({map: map});
  infoWindow.setPosition(pos);
  infoWindow.setContent('<img src=\"' + img + '\"/>');
}

var map;
function setMapPos(pos) { 
  if(map !=null && map.loaded && pos!=null ) {
     map.jumpTo([pos.lat, pos.lng]);
  }
}


function refreshMap() {
map.setZoom(15);
}

function initMap(rideId, pos) {
  //document.getElementById('tracking').innerHTML = 'locating';
  //var pos = {lat: -33.865, lng: 151.209444};
 // var pos = {lat: -39.23916666666666,lng:180.06861111111111};

if(map !=null) { 
  /*if(map.loaded && pos==null ) {
    pos = storage.get("lastKnownLocation"));
    if (pos != null) {
     map.setView([pos.lat, pos.lng], 17);
    }
  }*/
  return; 
}

debug2("init map " + rideId);
L.mapbox.accessToken = 'pk.eyJ1Ijoid2FycmVuYzUiLCJhIjoiY2lqNWJyZGdwMDA1b3VkbHZxbHdtcWh6bCJ9.q_fttPToEFTe6tnFFC2K8g';

  map = L.mapbox.map('mapc'+rideId, 'mapbox.streets')
    .setView([pos.lat, pos.lng], 17);
    
    var polyline_options = {
      color: '#000'
    };

    var line_points = [];
    poly = L.polyline(line_points, polyline_options);
    poly.addTo(map);
}

function gm_initMap(pos) {
  //document.getElementById('tracking').innerHTML = 'locating';
  //var pos = {lat: -33.865, lng: 151.209444};
 // var pos = {lat: -39.23916666666666,lng:180.06861111111111};

  map = new google.maps.Map(document.getElementById('mapc'), {
    center: pos,
    zoom: 13 
  });
  poly = new google.maps.Polyline({
    strokeColor: '#000000',
    strokeOpacity: 1,
    strokeWeight: 3,
    map: map
  });
//
//updatePoly(pos,poly);
//pos = {lat: -33.88017, lng: 151.13724};
//updatePoly(pos ,poly);
//getLocation();
//google.maps.event.addListener(map, 'click', function(event) {
//  toggleLocationWatch();
//  
//});

}
function toggleLocationWatch() {
  if (watchId == null) { 
    document.getElementById('tracking').innerHtml = 'tracking started';
    alert('tracking started');

    watchId = navigator.geolocation.watchPosition(
        function(position) {
        var pos = updatePosition(map, position, infoWindow);
          alert("check this");
        }, 
        function(error) {
          handleLocationError(false, infoWindow, map.getCenter(),error)
        },
        options
        );

  } else {
    navigator.geolocation.clearWatch(watchId);
    watchId=null;
    document.getElementById('tracking').innerHTML = 'tracking stopped';
    alert('tracking stopped');
  }
}
function distanceBetween(pos1, pos2){ 
  try  {
    var pos1LatLng = new L.LatLng(pos1.lat , pos1.lng);
    var pos2LatLng = new L.LatLng(pos2.lat, pos2.lng);
    return pos1LatLng.distanceTo(pos2LatLng);
  } catch (e) {
    debug2("L not yet available");
    return 0;
  }
}
/*
   var marker = new google.maps.Marker({
position: event.latLng,
title: '#' + path.getLength(),
map: map
});

*/
