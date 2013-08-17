function login(){
	var mn=document.getElementById('main');
	mn.innerHTML+='<form id="logTab"><table class="center"><tr><td></td><td><label id="logLab" class="label"></label></td></tr><tr><td><label class="label">Mail</label></td><td><input type="text" id="logMail"></input></td></tr><tr><td><label class="label">Lozinka</label></td><td><input type="password" id="logPass" ></input></td></tr><tr><td><label class="labela">zapamti</label></td><td><input type="checkbox" name="pamti" checked></input></td> </tr><tr><td><input type="button" id="prijava" value="Prijava"></input></td><td><input type="button" id="zaboravio" value="Zaboravili ste lozinku?"></input></td></tr></table></form>';
        document.getElementById("logLab").style.visibility="hidden";
	delete mn;
	document.getElementById('prijava').onclick=function(){loginCheck();};
	document.getElementById('zaboravio').onclick=function(){passLost();};
}
function company(id_company,id_user){
	var mn=document.getElementById('main');
	mn.innerHTML='';
	var company=[];
	$.ajax({                             
        	url: 'php/db.php?q=select * from company where id='+id_company+';',
                data: "data",            
                dataType: 'json',             
                success: function(rows){
			company[0]=rows[0][2];
			company[1]=rows[0][3];
			document.getElementById('mainT').innerHTML=company[0];
			var feed = new google.feeds.Feed("http://finance.yahoo.com/rss/headline?s="+company[1]);
			feed.includeHistoricalEntries();
			feed.setNumEntries(50);
			var tabl;
			feed.load(function(result) {
				if (!result.error) {
					tabl='<form><table id="ludaTAB" class="center"><thead><tr><th><br>Pregled novosti<br></th></tr></thead><tbody id="ludaTAB">';
					for (var i = 0; i < result.feed.entries.length; i++) {
						tabl+='<tr><td><a class="aSimple" href="'+result.feed.entries[i].link+'" target="_tab"><label>'+result.feed.entries[i].title+'</label></a></td></tr>';
					}
					tabl+='</tbody></table></form>';
					var tab='<table class="center"><tr><td><br><label  class="center">'+company[0]+'</label><br></td></tr><tr><td><img src="http://chart.finance.yahoo.com/z?s='+company[1]+'&t=5y&q=l&l=on" /></td></tr><tr><td><a  class="center aSimple" href="javascript:finPok('+id_company+');"><label>Financijski pokazatelji tvrtke</label></a></td></tr></table><br>'+tabl;
					delete tabl;
					mn.innerHTML=tab;
					$('#ludaTAB').dataTable({'bFilter': false});	
					delete mn,tab;		
			}});	
		}
	});
}
function finPok(id_company){
	var mn=document.getElementById('main');
	mn.innerHTML='';
	$.ajax({                             
        	url: 'php/db.php?q=select * from bilanca,rdg where bilanca.id_company='+id_company+' and rdg.id_company='+id_company+' and bilanca.year=rdg.year;',
                data: "data",            
                dataType: 'json',             
                success: function(rows){
			var tab='<table class="center"><tr><td><label class="center">'+document.getElementById("mainT").innerHTML+'</label></td></tr>';
			var L=rows.length;
			tab+='<tr><td></td>';
			for(var i=0;i<L;i++){
				if(rows[i][2]!=null)
					tab+='<td>'+rows[i][2]+'</td>';
				else
					tab+='<td>'+rows[i][18]+'</td>';
			}
			tab+='</tr>';
			tab+='<tr><td></td>';
			for(var i=0;i<L;i++){
				tab+='<td><a href="javascript: bilancaEdit('+rows[i][0]+');">Uredi bilancu</a></td>';
			}
			tab+='</tr>';
			tab+='<tr><td></td>';
			for(var i=0;i<L;i++){
				tab+='<td><a href="javascript: rdgEdit('+rows[i][16]+');">Uredi rdg</a></td>';
			}
			tab+='</tr>';
			tab+='<tr><td>Pokazatelji likvidnosti</td></tr>';

			tab+='<tr><td><label>Koeficijent trenutne likvidnosti: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][3]!=null && rows[i][4]!=null)
					tab+='<td><label>'+Number(rows[i][3])/Number(rows[i][4])+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Koeficijent ubrzane likvidnosti: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][3]!=null && rows[i][4]!=null && rows[i][5]!=null)
					tab+='<td><label>'+(Number(rows[i][3])+Number(rows[i][5]))/Number(rows[i][4])+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Koeficijent tekuće likvidnosti: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][7]!=null && rows[i][4]!=null)
					tab+='<td><label>'+Number(rows[i][7])/Number(rows[i][4])+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Koeficijent financijske stabilnosti: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][8]!=null && rows[i][9]!=null && rows[i][10]!=null)
					tab+='<td><label>'+Number(rows[i][8])/(Number(rows[i][9])+Number(rows[i][10]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';

			tab+='<tr><td>Pokazatelji zaduženosti</td></tr>';

			tab+='<tr><td><label>Koeficijent zaduženosti: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][4]!=null && rows[i][10]!=null && rows[i][7]!=null && rows[i][8]!=null)
					tab+='<td><label>'+(Number(rows[i][4])+Number(rows[i][10]))/(Number(rows[i][7])+Number(rows[i][8]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Koeficijent vlastitog financiranja: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][9]!=null && rows[i][7]!=null && rows[i][8]!=null)
					tab+='<td><label>'+(Number(rows[i][9]))/(Number(rows[i][7])+Number(rows[i][8]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';

			tab+='<tr><td><label>Koeficijent financiranja: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][4]!=null && rows[i][10]!=null && rows[i][9]!=null)
					tab+='<td><label>'+(Number(rows[i][4])+Number(rows[i][10]))/(Number(rows[i][9]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			var dobitPK=[];
			for(i =0;i<L;i++)
				dobitPK[i]=((Number(rows[i][19])+Number(rows[i][21])+Number(rows[i][23]))-(Number(rows[i][20])+Number(rows[i][22])+Number(rows[i][24])));
			tab+='<tr><td><label>Pokriće troškova kamata: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][12]!=null && rows[i][12]!=0)
					tab+='<td><label>'+(dobitPK[i]/Number(rows[i][12]))+'</label></td>';
				else if(rows[i][12]!=null && rows[i][12]==0)
					tab+='<td>Nema kamata!</td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Faktor zaduženosti: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][4]!=null && rows[i][10]!=null && rows[i][13]!=null && rows[i][11]!=null)
					tab+='<td><label>'+(Number(rows[i][4])+Number(rows[i][10]))/(Number(rows[i][13])+Number(rows[i][11]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Stupanj pokrića 1: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][9]!=null && rows[i][8]!=null)
					tab+='<td><label>'+(Number(rows[i][9]))/(Number(rows[i][8]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Stupanj pokrića 2: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][9]!=null && rows[i][10]!=null && rows[i][14]!=null && rows[i][8]!=null)
					tab+='<td><label>'+(Number(rows[i][9])+Number(rows[i][10]))/(Number(rows[i][8])+Number(rows[i][14]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';

			tab+='<tr><td>Pokazatelji aktivnosti</td></tr>';

			tab+='<tr><td><label>Koeficijent obrtaja ukupne imovine: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][19]!=null && rows[i][21]!=null && rows[i][23]!=null && rows[i][7]!=null && rows[i][8]!=null)
					tab+='<td><label>'+(Number(rows[i][19])+Number(rows[i][21])+Number(rows[i][23]))/(Number(rows[i][7])+Number(rows[i][8]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Koeficijent obrtaja kratkotrajne imovine: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][19]!=null && rows[i][21]!=null && rows[i][23]!=null && rows[i][7]!=null)
					tab+='<td><label>'+(Number(rows[i][19])+Number(rows[i][21])+Number(rows[i][23]))/(Number(rows[i][7]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Koeficijent obrtaja potraživanja: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][19]!=null && rows[i][6]!=null)
					tab+='<td><label>'+(Number(rows[i][19]))/(Number(rows[i][6]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Prosječno vrijeme naplate: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][19]!=null && rows[i][6]!=null)
					tab+='<td><label>'+(365/(Number(rows[i][19]))/(Number(rows[i][6])))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td>Pokazatelji ekonomičnosti</td></tr>';

			tab+='<tr><td><label>Ekonomičnost ukupnog poslovanja: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][19]!=null && rows[i][21]!=null && rows[i][23]!=null && rows[i][20]!=null && rows[i][22]!=null && rows[i][24]!=null)
					tab+='<td><label>'+(Number(rows[i][19])+Number(rows[i][21])+Number(rows[i][23]))/(Number(rows[i][20])+Number(rows[i][22])+Number(rows[i][24]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Ekonomičnost prodaje: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][19]!=null && rows[i][20]!=null)
					tab+='<td><label>'+(Number(rows[i][19]))/(Number(rows[i][20]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Ekonomičnost financiranja: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][21]!=null && rows[i][22]!=null)
					tab+='<td><label>'+(Number(rows[i][21]))/(Number(rows[i][22]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Ekonomičnost izvanrednih aktivnosti: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][23]!=null && rows[i][24]!=null)
					tab+='<td><label>'+(Number(rows[i][23]))/(Number(rows[i][24]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td>Pokazatelji profitabilnosti</td></tr>';

			tab+='<tr><td><label>Bruto profitna marža: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][19]!=null && rows[i][21]!=null && rows[i][23]!=null && rows[i][12]!=null)
					tab+='<td><label>'+(dobitPK[i]-rows[i][12])/(Number(rows[i][19])+Number(rows[i][21])+Number(rows[i][23]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Neto profitna marža: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][19]!=null && rows[i][21]!=null && rows[i][23]!=null && rows[i][12]!=null)
					tab+='<td><label>'+(dobitPK[i]-rows[i][12])*0.8/(Number(rows[i][19])+Number(rows[i][21])+Number(rows[i][23]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Bruto rentabilnost imovine: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][7]!=null && rows[i][8]!=null && rows[i][12]!=null)
					tab+='<td><label>'+(dobitPK[i]-rows[i][12])/(Number(rows[i][7])+Number(rows[i][8]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Neto rentabilnost imovine: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][7]!=null && rows[i][8]!=null && rows[i][12]!=null)
					tab+='<td><label>'+(dobitPK[i]-rows[i][12])*0.8/(Number(rows[i][7])+Number(rows[i][8]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Rentabilnost vlastitog kapitala: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][9]!=null && rows[i][12]!=null)
					tab+='<td><label>'+(dobitPK[i]-rows[i][12])*0.8/(Number(rows[i][9]))+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td>Pokazatelji investiranja</td></tr>';
			
			tab+='<tr><td><label>Dobit po dionici: </label></td>';
			var dobDio=[];
			for(var i=0;i<L;i++)
				dobDio[i]=((dobitPK[i]-rows[i][12])*0.8)/rows[i][15];
			for(var i=0;i<L;i++){	
				if(rows[i][15]!=null && rows[i][12]!=null)
					tab+='<td><label>'+dobDio[i]+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Dividenda po dionici: </label></td>';
			var divDio=[];
			for(var i=0;i<L;i++)
				divDio[i]=rows[i][25]/rows[i][15];
			for(var i=0;i<L;i++){	
				if(rows[i][15]!=null && rows[i][25]!=null)
					tab+='<td><label>'+divDio[i]+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Odnos cijene i dobiti po dionici: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][15]!=null && rows[i][12]!=null && rows[i][26]!=null)
					tab+='<td><label>'+rows[i][26]/dobDio[i]+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Odnos isplate dividendi: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][15]!=null && rows[i][12]!=null && rows[i][25]!=null)
					tab+='<td><label>'+divDio[i]/dobDio[i]+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Rentabilnost dionice: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][15]!=null && rows[i][12]!=null && rows[i][26]!=null)
					tab+='<td><label>'+dobDio[i]/rows[i][26]+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='<tr><td><label>Dividenda rentabilnosti dionice: </label></td>';
			for(var i=0;i<L;i++){	
				if(rows[i][15]!=null && rows[i][12]!=null && rows[i][26]!=null)
					tab+='<td><label>'+divDio[i]/rows[i][26]+'</label></td>';
				else
					tab+='<td><label>Nisu dostupni potrebni podaci!</label></td>';
			}
			tab+='</tr>';
			tab+='</table>';
			mn.innerHTML=tab;
			delete mn,tab,L,dobitPK;
		}
	});
}
function bilancaAdd(comp,id_user){
	var mn=document.getElementById('main');
	document.getElementById('mainT').innerHTML='Unos bilance';
	mn.innerHTML='';
	var tab='<table class="center"><tr><td>Dodavanje bilance</td></tr>';	
	tab+='<tr><td style="width: 150px;"><label style="width: 150px;">Godina</label><input type="text" id="1"></input><label id="l1" ></label></td></tr>';
	tab+='<tr><td><label>Novac</label><input type="text" id="2"></input><label id="l2" ></label></td></tr>';
	tab+='<tr><td><label>Kratkoročne obaveze</label><input type="text" id="3"></input><label id="l3" ></label></td></tr>';
	tab+='<tr><td><label>Potraživanje</label><input type="text" id="4"></input><label id="l4" ></label></td></tr>';
	tab+='<tr><td><label>Potraživanja od kupca</label><input type="text" id="5"></input><label id="l5" ></label></td></tr>';
	tab+='<tr><td><label>Kratkoročna imovina</label><input type="text" id="6"></input><label id="l6" ></label></td></tr>';
	tab+='<tr><td><label>Dugoročna imovina</label><input type="text" id="7"></input><label id="l7" ></label></td></tr>';
	tab+='<tr><td><label>Kapital</label><input type="text" id="8"></input><label id="l8" ></label></td></tr>';
	tab+='<tr><td><label>Dugoročne obaveze</label><input type="text" id="9"></input><label id="l9"></label></td></tr>';
	tab+='<tr><td><label>Amortizacija</label><input type="text" id="10"></input><label id="l10" ></label></td></tr>';
	tab+='<tr><td><label>Kamate</label><input type="text" id="11"></input><label id="l11" ></label></td></tr>';
	tab+='<tr><td><label>Zadržana dobit</label><input type="text" id="12"></input><label id="l12" ></label></td></tr>';
	tab+='<tr><td><label>Zalihe</label><input type="text" id="13"></input><label id="l13" ></label></td></tr>';
	tab+='<tr><td><label>Broj dionica</label><input type="text" id="14"></input><label id="l14" ></label></td></tr>';
	tab+='<tr><td><a class="aButton" id="gumb" href="javascript:pohraniBilancu('+comp+','+id_user+')">Pohrani bilancu</a></td><td></td></tr>';	
	tab+='</table>';
	mn.innerHTML=tab;
	delete mn,tab;
	var lab = document.getElementsByTagName("input");
	for (var i=0;i<lab.length;i++){
		lab[i].addEventListener("blur", function() 
			{
				if(this.id=='1' && (this.value.length!=4 || isNaN(this.value))){
					document.getElementById('l1').innerHTML="Unesite godinu";
					document.getElementById('gumb').style.visibility="hidden";
					}
				
				else if(this.id=='1' && this.value.length==4 && !isNaN(this.value)){
					$.ajax({                             
						url: 'php/db.php?q=select id from bilanca where year="'+this.value+'" and id_company="'+comp+'";',
						data: "data",            
						dataType: 'json',             
						success: function(rows){
							if(rows!=''){
								document.getElementById('l1').innerHTML="Bilanca za unesenu godinu postoji";
								document.getElementById('gumb').style.visibility="hidden";						
							}
							else
								document.getElementById('l1').innerHTML="";
						}});				
				} 
				else if(isNaN(this.value)){
					document.getElementById('l'+this.id).innerHTML="Unesite broj";
					document.getElementById('gumb').style.visibility="hidden";
				}
				else{
					document.getElementById('l'+this.id).innerHTML="";
					var test=false;
					for(var j=1;j<15;j++)
						if(document.getElementById('l'+j).innerHTML!="")
							test=true;
					if(!test)
						document.getElementById('gumb').style.visibility="visible";
					delete test,j;
				}
					
			});
	}
	delete lab;
}function bilancaEdit(id_bilanca){
	$.ajax({                             
        	url: 'php/db.php?q=select * from bilanca where id='+id_bilanca+';',
                data: "data",            
                dataType: 'json',             
                success: function(rows){
			var mn=document.getElementById('main');
			document.getElementById('mainT').innerHTML='Uređivanje bilance';
			mn.innerHTML='';
			var tab='<table class="center"><tr><td>Dodavanje bilance</td></tr>';	
			tab+='<tr><td style="width: 150px;"><label style="width: 150px;">Godina</label><input value="'+rows[0][2]+'" type="text" id="1"></input><label id="l1" ></label></td></tr>';
			tab+='<tr><td><label>Novac</label><input value="'+rows[0][3]+'" type="text" id="2"></input><label id="l2" ></label></td></tr>';
			tab+='<tr><td><label>Kratkoročne obaveze</label><input value="'+rows[0][4]+'" type="text" id="3"></input><label id="l3" ></label></td></tr>';
			tab+='<tr><td><label>Potraživanje</label><input value="'+rows[0][5]+'" type="text" id="4"></input><label id="l4" ></label></td></tr>';
			tab+='<tr><td><label>Potraživanja od kupca</label><input value="'+rows[0][6]+'" type="text" id="5"></input><label id="l5" ></label></td></tr>';
			tab+='<tr><td><label>Kratkoročna imovina</label><input value="'+rows[0][7]+'" type="text" id="6"></input><label id="l6" ></label></td></tr>';
			tab+='<tr><td><label>Dugoročna imovina</label><input type="text" value="'+rows[0][8]+'" id="7"></input><label id="l7" ></label></td></tr>';
			tab+='<tr><td><label>Kapital</label><input value="'+rows[0][9]+'" type="text" id="8"></input><label id="l8" ></label></td></tr>';
			tab+='<tr><td><label>Dugoročne obaveze</label><input value="'+rows[0][10]+'" type="text" id="9"></input><label id="l9"></label></td></tr>';
			tab+='<tr><td><label>Amortizacija</label><input value="'+rows[0][11]+'" type="text" id="10"></input><label id="l10" ></label></td></tr>';
			tab+='<tr><td><label>Kamate</label><input value="'+rows[0][12]+'" type="text" id="11"></input><label id="l11" ></label></td></tr>';
			tab+='<tr><td><label>Zadržana dobit</label><input value="'+rows[0][13]+'" type="text" id="12"></input><label id="l12" ></label></td></tr>';
			tab+='<tr><td><label>Zalihe</label><input type="text" value="'+rows[0][14]+'" id="13"></input><label id="l13" ></label></td></tr>';
			tab+='<tr><td><label>Broj dionica</label><input type="text" value="'+rows[0][15]+'"  id="14"></input><label id="l14" ></label></td></tr>';
			tab+='<tr><td><a class="aButton" id="gumb" href="javascript:updateBilanca('+id_bilanca+')">Pohrani bilancu</a></td><td></td></tr>';	
			tab+='</table>';
			mn.innerHTML=tab;
			delete mn,tab;
			var lab = document.getElementsByTagName("input");
			for (var i=0;i<lab.length;i++){
				lab[i].addEventListener("blur", function() 
					{
						if(this.id=='1' && (this.value.length!=4 || isNaN(this.value))){
							document.getElementById('l1').innerHTML="Unesite godinu";
							document.getElementById('gumb').style.visibility="hidden";
							} 
						else if(isNaN(this.value)){
							document.getElementById('l'+this.id).innerHTML="Unesite broj";
							document.getElementById('gumb').style.visibility="hidden";
						}
						else{
							document.getElementById('l'+this.id).innerHTML="";
							var test=false;
							for(var j=1;j<16;j++)
								if(document.getElementById('l'+j).innerHTML!="")
									test=true;
							if(!test)
								document.getElementById('gumb').style.visibility="visible";
							delete test,j;
						}
					
					});
			}
			delete lab;
		}
	});
}
function updateBilanca(id){
	$.ajax({ 
			 type: "GET",                           
			url: 'php/dbIns.php?q=update bilanca set year='+document.getElementById('1').value+', novac='+document.getElementById('2').value+', krOb='+document.getElementById('3').value+', potrazivanja='+document.getElementById('4').value+', potrazivanjaK='+document.getElementById('5').value+', krIm='+document.getElementById('6').value+', dugIm='+document.getElementById('7').value+', kapital='+document.getElementById('8').value+', dugOb='+document.getElementById('9').value+', amo='+document.getElementById('10').value+', kamate='+document.getElementById('11').value+', zadDob='+document.getElementById('12').value+', zalihe='+document.getElementById('13').value+', brojDionica='+document.getElementById('14').value+' where id='+id+
';'
	});
	document.getElementById('main').innerHTML='<table class="center"><tr><td>Uspješno ste uredili bilancu</td></tr></table>';
}
function updateRdg(id){
	$.ajax({ 
			 type: "GET",                           
			url: 'php/dbIns.php?q=update rdg set year='+document.getElementById('1').value+', pProd='+document.getElementById('2').value+' rProd='+document.getElementById('3').value+', pFin='+document.getElementById('4').value+', rFin='+document.getElementById('5').value+', pIzv='+document.getElementById('6').value+', rIzv='+document.getElementById('7').value+', dobitDio='+document.getElementById('8').value+', trzCjDio='+document.getElementById('9').value+' where id='+id+';'
	});
	document.getElementById('main').innerHTML='<table class="center"><tr><td>Uspješno ste uredili račun dobiti i gubitka</td></tr></table>';
}
function rdgAdd(comp,id_user){
	var mn=document.getElementById('main');
	document.getElementById('mainT').innerHTML='Unos računa dobiti i gubitka';
	mn.innerHTML='';
	var tab='<table class="center"><tr><td>Dodavanje rdg-a</td></tr>';	
	tab+='<tr><td style="width: 150px;"><label style="width: 150px;">Godina</label><input type="text" id="1"></input><label id="l1" ></label></td></tr>';
	tab+='<tr><td><label>Poslovni prihodi</label><input type="text" id="2"></input><label id="l2" ></label></td></tr>';
	tab+='<tr><td><label>Troškovi poslovanja</label><input type="text" id="3"></input><label id="l3" ></label></td></tr>';
	tab+='<tr><td><label>Financijski prihodi</label><input type="text" id="4"></input><label id="l4" ></label></td></tr>';
	tab+='<tr><td><label>Financijski rashodi</label><input type="text" id="5"></input><label id="l5" ></label></td></tr>';
	tab+='<tr><td><label>Izvanredni prihodi</label><input type="text" id="6"></input><label id="l6" ></label></td></tr>';
	tab+='<tr><td><label>Izvanredni rashodi</label><input type="text" id="7"></input><label id="l7" ></label></td></tr>';
	tab+='<tr><td><label>Dio dobiti namjenjen za dioničare</label><input type="text" id="8"></input><label id="l8" ></label></td></tr>';
	tab+='<tr><td><label>Tržišna cijena dionica</label><input type="text" id="9"></input><label id="l9" ></label></td></tr>';
	tab+='<tr><td><a class="aButton" id="gumb" href="javascript:pohraniRdg('+comp+','+id_user+')">Pohrani  rdg</a></td><td></td></tr>';	
	tab+='</table>';
	mn.innerHTML=tab;
	delete mn,tab;
	var lab = document.getElementsByTagName("input");
	for (var i=0;i<lab.length;i++){
		lab[i].addEventListener("blur", function() 
			{
				if(this.id=='1' && (this.value.length!=4 || isNaN(this.value))){
					document.getElementById('l1').innerHTML="Unesite godinu";
					document.getElementById('gumb').style.visibility="hidden";
					}
				else if(this.id=='1' && this.value.length==4 && !isNaN(this.value)){
					$.ajax({                             
						url: 'php/db.php?q=select id from rdg where year="'+this.value+'" and id_company="'+comp+'";',
						data: "data",            
						dataType: 'json',             
						success: function(rows){
							if(rows!=''){
								document.getElementById('l1').innerHTML="Rdg za unesenu godinu postoji";
								document.getElementById('gumb').style.visibility="hidden";						
							}
							else
								document.getElementById('l1').innerHTML="";
						}});				
				} 
				else if(isNaN(this.value)){
					document.getElementById('l'+this.id).innerHTML="Unesite broj";
					document.getElementById('gumb').style.visibility="hidden";
				}
				else{
					document.getElementById('l'+this.id).innerHTML="";
					var test=false;
					for(var j=1;j<10;j++)
						if(document.getElementById('l'+j).innerHTML!="")
							test=true;
					if(!test)
						document.getElementById('gumb').style.visibility="visible";
					delete test,j;
				}
					
			});
	}
	delete lab;
}
function rdgEdit(id){
	$.ajax({                             
        	url: 'php/db.php?q=select * from rdg where id='+id+';',
                data: "data",            
                dataType: 'json',             
                success: function(rows){
		var mn=document.getElementById('main');
		document.getElementById('mainT').innerHTML='Uređenje računa dobiti i gubitka';
		mn.innerHTML='';
		var tab='<table class="center"><tr><td>Uređivanje rdg-a</td></tr>';	
		tab+='<tr><td style="width: 150px;"><label style="width: 150px;">Godina</label><input value="'+rows[0][2]+'" type="text" id="1"></input><label id="l1" ></label></td></tr>';
		tab+='<tr><td><label>Poslovni prihodi</label><input value="'+rows[0][3]+'" type="text" id="2"></input><label id="l2" ></label></td></tr>';
		tab+='<tr><td><label>Troškovi poslovanja</label><input value="'+rows[0][4]+'" type="text" id="3"></input><label id="l3" ></label></td></tr>';
		tab+='<tr><td><label>Financijski prihodi</label><input value="'+rows[0][5]+'" type="text" id="4"></input><label id="l4" ></label></td></tr>';
		tab+='<tr><td><label>Financijski rashodi</label><input type="text" value="'+rows[0][6]+'" id="5"></input><label id="l5" ></label></td></tr>';
		tab+='<tr><td><label>Izvanredni prihodi</label><input type="text" value="'+rows[0][7]+'" id="6"></input><label id="l6" ></label></td></tr>';
		tab+='<tr><td><label>Izvanredni rashodi</label><input type="text" value="'+rows[0][8]+'" id="7"></input><label id="l7" ></label></td></tr>';
		tab+='<tr><td><label>Dio dobiti namjenjen za dioničare</label><input value="'+rows[0][9]+'" type="text" id="8"></input><label id="l8" ></label></td></tr>';
		tab+='<tr><td><label>Tržišna cijena dionica</label><input type="text" value="'+rows[0][10]+'" id="9"></input><label id="l9" ></label></td></tr>';
		tab+='<tr><td><a class="aButton" id="gumb" href="javascript:updateRdg('+id+')">Pohrani  rdg</a></td><td></td></tr>';	
		tab+='</table>';
		mn.innerHTML=tab;
		delete mn,tab;
		var lab = document.getElementsByTagName("input");
		for (var i=0;i<lab.length;i++){
			lab[i].addEventListener("blur", function() 
				{
					if(this.id=='1' && (this.value.length!=4 || isNaN(this.value))){
						document.getElementById('l1').innerHTML="Unesite godinu";
						document.getElementById('gumb').style.visibility="hidden";
						}
					else if(isNaN(this.value)){
						document.getElementById('l'+this.id).innerHTML="Unesite broj";
						document.getElementById('gumb').style.visibility="hidden";
					}
					else{
						document.getElementById('l'+this.id).innerHTML="";
						var test=false;
						for(var j=1;j<10;j++)
							if(document.getElementById('l'+j).innerHTML!="")
								test=true;
						if(!test)
							document.getElementById('gumb').style.visibility="visible";
						delete test,j;
					}
					
				});
		}
		delete lab;
		}
	});
}
function pohraniBilancu(comp,id_user){
	$.ajax({ 
			 type: "GET",                           
			url: 'php/dbIns.php?q=insert into bilanca value(default,'+comp+','+document.getElementById('1').value+','+document.getElementById('2').value+','+document.getElementById('3').value+','+document.getElementById('4').value+','+document.getElementById('5').value+','+document.getElementById('6').value+','+document.getElementById('7').value+','+document.getElementById('8').value+','+document.getElementById('9').value+','+document.getElementById('10').value+','+document.getElementById('11').value+','+document.getElementById('12').value+','+document.getElementById('13').value+','+document.getElementById('14').value+');'
	});
	document.getElementById('main').innerHTML='<table class="center"><tr><td>Uspješno ste dodali novu bilancu</td></tr><tr><td><a href="javascript:bilancaAdd('+comp+','+id_user+')">Unesite još jednu bilancu</a></td></tr></table>';
}
function pohraniRdg(comp,id_user){
	$.ajax({ 
			 type: "GET",                           
			url: 'php/dbIns.php?q=insert into rdg value(default,'+comp+','+document.getElementById('1').value+','+document.getElementById('2').value+','+document.getElementById('3').value+','+document.getElementById('4').value+','+document.getElementById('5').value+','+document.getElementById('6').value+','+document.getElementById('7').value+','+document.getElementById('8').value+','+document.getElementById('9').value+');'
	});
	document.getElementById('main').innerHTML='<table class="center"><tr><td>Uspješno ste dodali novi račun dobiti i gubitka</td></tr><tr><td><a href="javascript:rdgAdd('+comp+','+id_user+')">Unesite još jedan </a></td></tr></table>';
}
function selectComp(comp,id_user){
	if(comp==1)
		comp=document.getElementById('comp').value;
	var rez;
	$.getJSON("data/company.json", function(data){
	    for (var i=0, len=data.length; i < len; i++) {
			if(data[i]['Name']==comp){
				rez=data[i]['Symbol'];
			}
	    }
		$.ajax({ 
			 type: "GET",                           
			url: 'php/dbIns.php?q=insert into company value(default,'+id_user+',"'+comp+'","'+rez+'");'
		});
	});
	var mn=document.getElementById('main');
	var elem='<table class=center><tr><td>Uspješno ste dodali tvrtku<br></td><td>'+comp+'</td></tr>';
	elem+='<tr><td><a href="javascript:home('+id_user+');" class="aSimple"><label>Početna stranica</label></a></td></tr><tr><td><a href="javascript:listT('+id_user+');" class="aSimple"><label>pregled vaših tvrtki</label></a></td></tr>';
	elem+='</table>';
	mn.innerHTML=elem;
	delete elem,mn;
}
function companyAdd(id_user){
	var mn=document.getElementById('main');
	mn.innerHTML='<table class="center"><tr><td><input id="comp" size="20" maxlength="40" name="comp" required placeholder="Naziv tvrtke"></td><td><a href="javascript:selectComp(1,'+id_user+');" class="aSimple">Dodaj</a></td></tr><tr><td class="ui-widget"></td></tr></table>';
	var compN = [];
	$.getJSON("data/company.json", function(data){
	    for (var i=0, len=data.length; i < len; i++) {
			compN[i]=data[i]['Name'];
	    }
	});
	$( "#comp" ).autocomplete({
		source: compN	
	});
}
function listT(id_user){
	var mnLb=document.getElementById('main');
	mnLb.innerHTML='';
	document.getElementById('mainT').innerHTML="Tvrtke";
	$.ajax({                             
        	url: 'php/db.php?q=select id,name from company where id_user='+id_user+';',
                data: "data",            
                dataType: 'json',             
                success: function(rows){
			var tab='<form><table id="ludaTAB" class="center"><thead><tr><th>Pregled podataka</th><th></th><th></th><th></th></tr></thead><tbody id="ludaTAB">';
			for(var i in rows)
				tab+='<tr><td><a href="javascript:company('+rows[i][0]+','+id_user+');" class="aSimple"><label>'+rows[i][1]+'</label></a></td><td><a href="javascript:bilancaAdd('+rows[i][0]+','+id_user+');" class="aSimple"><label>Dodaj bilancu</label></a></td><td><a href="javascript:rdgAdd('+rows[i][0]+','+id_user+');" class="aSimple"><label>Dodaj rdg</label></a></td><td><a href="javascript:companyRm('+rows[i][0]+','+id_user+');" class="aSimple"><label>Ukloni tvrtku</label></a></td></tr>';
			tab+='</tbody></table></form>';
			mnLb.innerHTML=tab;
			$('#ludaTAB').dataTable({'bFilter': false});
			delete mnLb,tab;
		}
	});
	
}
function companyComp(id_user){
	var mn=document.getElementById('main');
	mn.innerHTML='<table class="center"><tr><td><input id="comp1" size="20" maxlength="40" name="comp1" required placeholder="Naziv tvrtke"></td><td><input id="comp2" size="20" maxlength="40" name="comp2" required placeholder="Naziv tvrtke"></td><td><a href="javascript:compComp('+id_user+');" class="aSimple">Dodaj</a></td></tr><tr><td class="ui-widget"></td></tr></table>';
	var compN = [];
	$.getJSON("data/company.json", function(data){
	    for (var i=0, len=data.length; i < len; i++) {
			compN[i]=data[i]['Name'];
	    }
	});
	$( "#comp1" ).autocomplete({
		source: compN	
	});
	$( "#comp2" ).autocomplete({
		source: compN	
	});
	
}
function compComp(id_user){
	var comp1=document.getElementById('comp1').value;
	var comp2=document.getElementById('comp2').value;
	$.getJSON("data/company.json", function(data){
	    	for (var i=0, len=data.length; i < len; i++) {
			if(data[i]['Name']==comp1){
				comp1=data[i]['Symbol'];
			}
			else if(data[i]['Name']==comp2){
				comp2=data[i]['Symbol'];
			}
	    	}
		var mn=document.getElementById('main');
		mn.innerHTML='';
			document.getElementById('mainT').innerHTML=company[0];
			var feed = new google.feeds.Feed("http://finance.yahoo.com/rss/headline?s="+comp1+","+comp2);
			feed.includeHistoricalEntries();
			feed.setNumEntries(50);
			var tabl;
			feed.load(function(result) {
				if (!result.error) {
					tabl='<form><table id="ludaTAB" class="center"><thead><tr><th><br>Pregled novosti<br></th></tr></thead><tbody id="ludaTAB">';
					for (var i = 0; i < result.feed.entries.length; i++) {
						tabl+='<tr><td><a class="aSimple" href="'+result.feed.entries[i].link+'" target="_tab"><label>'+result.feed.entries[i].title+'</label></a></td></tr>';
					}
					tabl+='</tbody></table></form>';
					var tab='<table class="center"><tr><td><br><br></td></tr><tr><td><img src="http://chart.finance.yahoo.com/z?s='+comp1+'&t=5y&q=l&l=on" /></td><td><img src="http://chart.finance.yahoo.com/z?s='+comp2+'&t=5y&q=l&l=on" /></td></tr></table><br>'+tabl;
					delete tabl;
					mn.innerHTML=tab;
					$('#ludaTAB').dataTable({'bFilter': false});	
					delete mn,tab;		
			}});	
	});
	delete comp1,comp2;
}
function companyRm(comp,id_user){
	$.ajax({ 
			 type: "GET",                           
			url: 'php/dbIns.php?q=delete from company where id='+comp+';'
	});	
	listT(id_user);
}
function home(id){
	var elm=document.getElementById('main');
	elm.innerHTML='';
	document.getElementById('mainT').innerHTML="Home";
	var mnn=document.getElementById('menuTop');
	mnn.innerHTML='<a href="javascript:home('+id+');" class="topHome">HOME</a>';
	$.ajax({                             
        	url: 'php/db.php?q=select name from user where id='+id+';',
                data: "data",            
                dataType: 'json',             
                success: function(rows){
			mnn.innerHTML+='<label class="topName">'+rows[0][0]+'</label>';
		}
	});
	delete mn;
	var men=document.getElementById('menuLeft');
	var mn='<ul id="panel">'; 
        mn+='<li id="leftMenuT" class="animation"><a href="javascript:listT('+id+');">Vaše tvrtke</a></li>'; 
        mn+='<li class="animation"><a href="javascript:companyAdd('+id+')">Dodaj tvrtku</a></li>'; 
        mn+='<li class="animation"><a href="javascript:companyComp('+id+')">Usporedi tvrtke</a></li>'; 
	mn+='</ul>';
	men.innerHTML=mn;
	delete mn, men;	
	$.ajax({                             
        	url: 'php/db.php?q=select company.key from company where id_user='+id+';',
                data: "data",            
                dataType: 'json',             
                success: function(rows){
			var com=[];
			for (var i in rows)
				com[i]=rows[i][0];
		      var feed = new google.feeds.Feed("http://finance.yahoo.com/rss/headline?s="+com);
			feed.includeHistoricalEntries();
			feed.setNumEntries(50);
		      feed.load(function(result) {
			if (!result.error) {
			  var tab='<form><table id="ludaTAB" class="center"><thead><tr><th>Pregled novosti</th></tr></thead><tbody id="ludaTAB">';
			  var mnLb = document.getElementById("main");
			  for (var i = 0; i < result.feed.entries.length; i++) {
				tab+='<tr><td><a class="aSimple" href="'+result.feed.entries[i].link+'" target="_tab"><label>'+result.feed.entries[i].title+'</label></a></td></tr>';
			  }
			tab+='</tbody></table></form>';
			mnLb.innerHTML=tab;
			$('#ludaTAB').dataTable({'bFilter': false});
			delete mnLb,tab;
			}
		      });
		}	
	});
	
}
