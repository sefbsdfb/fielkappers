// ==UserScript==
// @name         FifaHiLite
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight some peeps
// @author       Nile
// @match        https://www.ea.com/fifa/ultimate-team/web-app/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let playerDataMap = new Map();
    function loadPlayerDataFromCsv() {
		console.log('**LOADING PLAYER DATA**');
        $.get( "https://raw.githubusercontent.com/sefbsdfb/fielkappers/main/Replace%20-%20Sheet1%20(3).csv",
			function( CSVdata) {
				var lines=CSVdata.split("\n");
				var headers=lines[0].split(",");

				for(var i=1;i<lines.length;i++){
					if(lines[i] != ""){
					var currentline=lines[i].replaceAll('"' , "").split(",");
						var name = currentline[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ");
						let key = name[name.length-1]+currentline[1];
						let value = currentline[2].trim();
						playerDataMap.set(key , value);
					}
				}
        });
		console.log('**LOADED PLAYER DATA**');
    }

	function addStyleElement(){
		if ($('style[title="highlightStyle"]').length > 0){
			return;
		}
		var t = document.createElement("style");
		t.type = "text/css",
		t.innerText = "\n    .SearchResults.ui-layout-left .listFUTItem {\n        height: 60px;\n    }\n    .SearchResults.ui-layout-left .listFUTItem .label {\n        font-size: 10px;\n  }\n    .SearchResults.ui-layout-left .auction {\n        margin-top: 0 !important;\n        font-size: 12px;\n        top: 4px;\n    }\n",
		document.head.appendChild(t);
	}

	function waitForSearchButton(){
		console.log('**WAITING FOR TRANSFER SEARCH BUTTON**');
		let searchButtonCandidate = $('.btn-standard.call-to-action');
		if (searchButtonCandidate.length > 0
			&& searchButtonCandidate[0]
			&& $(searchButtonCandidate[0]).text() === 'Search')
			{
				console.log('**SEARCH BUTTON FOUND**');
				$('.btn-standard.call-to-action').on("click",
					function(){
						addStyleElement();
						highlightValues();
					});
				console.log('**SEARCH BUTTON READY TO CLICK**');
        }
        else {
            setTimeout(function(){
                waitForSearchButton();
            }, 2000);
        }
    }

	function highlightValues(){
        setTimeout(function(){
            console.log('Getting Everything Ready');
            getPlayerDataFromSite();
			$('.pagination.prev').on('click', function(e){
				e.preventDefault();
				addStyleElement();
				console.log('**PREVIOUS**');
				setTimeout(function(){
					getPlayerDataFromSite();
				}, 500);
			});

			$('.pagination.next').on('click', function(e){
				e.preventDefault();
				addStyleElement();
				console.log('**NEXT**');
				setTimeout(function(){
					getPlayerDataFromSite();
				}, 500);
			});
        }, 1000);
    }

    function getPlayerDataFromSite(){
        for(var i=0;i<=19;i++){
            var name = $('.name:eq('+i+')').text();
            name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            var rating = $('.rating:eq('+i+')').text();
            var fullName = name.split(' ');
            var sitePlayerPrice = '';
            if($('.auction:eq('+i+')').children('div').eq(2).text().split(":")[1]!=undefined){
              sitePlayerPrice= $('.auction:eq('+i+')').children('div').eq(2).text().split(":")[1].replaceAll(",","");
            }
            var excelDataSheetPrice = playerDataMap.get(fullName[fullName.length-1]+""+rating);
            console.log('ExcelSheetPrice',fullName[fullName.length-1]+""+rating,"==>", excelDataSheetPrice);
            console.log('SitePrice',name+""+rating+"==>" , sitePlayerPrice);

			let sitePlayerPriceAsNumber = parseInt(sitePlayerPrice);
			if (!excelDataSheetPrice || !sitePlayerPriceAsNumber)
			{
				continue;
			}

			if(sitePlayerPriceAsNumber <= parseInt(excelDataSheetPrice*1.03)){
				console.log('**' + fullName + ' IS ORANGE NOW**')
                $('.name:eq('+i+')').parent().css('background-color','orange');
            }
            if(sitePlayerPriceAsNumber <= parseInt(excelDataSheetPrice)){
				console.log('**' + fullName + ' IS GREEN NOW**')
                $('.name:eq('+i+')').parent().css('background-color','green');
            }
            if(sitePlayerPriceAsNumber <= parseInt(excelDataSheetPrice*0.97)){
				console.log('**' + fullName + ' IS MAGENTA NOW**')
                $('.name:eq('+i+')').parent().css('background-color','magenta');
            }
            if(sitePlayerPriceAsNumber <= parseInt(excelDataSheetPrice*0.80)){
				console.log('**' + fullName + ' IS RED NOW**')
                $('.name:eq('+i+')').parent().css('background-color','red');
            }
        }
    }

	loadPlayerDataFromCsv();
	waitForSearchButton();
})();
