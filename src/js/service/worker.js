var i = 0;
var delay=1000;
var interval=5000;


function startTimer() {
    postMessage(i++);
    setTimeout("startTimer()",interval);
}

////setTimeout("startTimer()",delay);
