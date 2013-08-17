function temaEd(){
    var H=$(window).height();
    var W=$(window).width();
    var box=document.getElementById('box');
    box.style.width=W*0.9;
    box.style.height=H*0.9;
    delete box;
    
    document.getElementById('menuTop').style.width=(W*0.9)-10;
    
    var left=document.getElementById('menuLeft');
    left.style.height=(H*0.6)-23;
    left.style.top=(H*0.15);
    delete left
    var main=document.getElementById('main');
    main.style.width=((W*0.9)-110);
    main.style.height=((H*0.9)-52);
    delete main;
    
    var foot=document.getElementById('foot');
    foot.style.width=((W*0.9)-110);
    foot.style.bottom=(3);
    delete foot,H,W;
    var lab = document.getElementsByTagName("label");
	for (var i=0;i<lab.length;i++){
		lab[i].addEventListener("mouseover", function() {this.className='hov';});
		lab[i].addEventListener("mouseout", function() {this.className='';});
	}
	delete lab;
}
function loginCheck(){
	var ok=true;
	var logLab=document.getElementById("logLab");
	logLab.innerHTML="";
	if (document.getElementById("logMail").value==''){
		logLab.style.visibility="visible";
		logLab.style.color="red";
		logLab.innerHTML="Unesite Vaš mail!";
		ok=false;
	}
	if (document.getElementById("logPass").value==''){
		logLab.style.visibility="visible";
		logLab.style.color="red";
		logLab.innerHTML+="  Unesite Vašu šifru!";
		ok=false;
	}
	if(ok){
		$.ajax({               
			                      
                          url: 'php/db.php?q=select id from user where mail="'+document.getElementById("logMail").value+'" and pass="'+document.getElementById("logPass").value+'";',
                          data: "data",            
                          dataType: 'json',             
                          success: function(rows) 
                          {
							if(rows==''){
								logLab.style.visibility="visible";
								logLab.style.color="red";
								logLab.innerHTML="Ne postoji korisnik s unesenim podacima!";
							}
							else{
								
		$.ajax({
		  url: 'js/pages.js',
		  dataType: "script",
		  success: function(){
	var elem = document.getElementById('logTab');									
	elem.parentNode.removeChild(elem);
                home(rows[0][0]);}
		});
							}
                          } 
                        });
	}
	
	
}
function passLost(){	
	var logMailL=document.getElementById("logLab");
	logMailL.innerHTML="";
	var mail=document.getElementById("logMail").value;
	logMailL.style.visibility="visible";
	logMailL.style.color="red";
	if (mail==''){
		logMailL.innerHTML="Unesite Vaš mail!";
	}
	else{	
				$.ajax({
		                  url: "php/db.php?q=select pass from user where mail='"+mail+"';",
		                  data: "data",            
		                  dataType: 'json',             
		                  success: function(rows) {

							if(rows==''){
								logMailL.innerHTML="Ne postoji korisnik s unesenim mailom!";
							}
							else{
								var pass=rows[0][0];
								$.ajax({
								      type: "GET",
								      url: "http://arka.foi.hr/WebDiP/2012_projekti/WebDiP2012_024/php/mail.php?m="+mail+"&p="+pass	    
								    });
										logMailL.innerHTML="Mail je uspješno poslan";
							}
		                  } 
		                });
	}
}
function temaFn() {
    document.write("<html>");
        document.write("<head>");
            document.write("<title id='mainT'>Login</title>");
            $('<link rel="stylesheet" href="css/tema.css" type="text/css" />').appendTo('html');

        document.write("</head>");
        document.write("<body>");
                document.write("<div id='box' class='box'>");

                document.write('<header id="menuTop" class="menuTop">');
		document.write('</header>');

                document.write('<nav id="menuLeft" class="menuLeft"></nav>');

                document.write('<section id="main" class="main">');
		$.ajax({
		  url: 'js/pages.js',
		  dataType: "script",
		  success: function(){
			login();
			}
		});

                document.write('</section>');

                document.write('<footer id="foot" class="foot"></footer>');

            document.write("</div>");
        document.write("</body>");
    document.write("</html>");
    temaEd();
    $(window).bind('resize', temaEd);
}
$(document).ready(temaFn);
