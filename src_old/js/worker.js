var i = 0;
delay=1000;
interval=5000;

function startTimer() {
    postMessage(i++);
    setTimeout("startTimer()",interval);
}

setTimeout("startTimer()",delay);
