const dogruSifre = "1234";

function login(){

let girilen = document.getElementById("password").value;

if(girilen === dogruSifre){

document.getElementById("loginBox").style.display="none";
document.getElementById("mainPage").style.display="block";

}else{

document.getElementById("error").innerText="Şifre yanlış!";

}

}


function sonucuGoster(){

// 0 ve 1 arasında sayı seçiyormuş gibi yapar ama hep 1 verir

let sonuc = 1;

document.getElementById("result").innerText = sonuc;

}
