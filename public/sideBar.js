
function open() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("main").style.visibility = "hidden";
    document.getElementById("content").style.marginLeft = "250px";
}

function close() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.getElementById("content").style.marginLeft = "0";
    document.getElementById("main").style.visibility = "visible";
}