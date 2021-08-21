const Test = document.querySelector("#test");

const Reveal = document.querySelector("#reveal")

Test.addEventListener("click",()=>{
    alert("working")
})


window.onscroll = function(){
    var top  = window.scrollY || document.documentElement.scrollTop;
    if(top>500){
      Reveal.className="reveal"; 
    }
    else{
        Reveal.className="noReveal";  
    }
}
