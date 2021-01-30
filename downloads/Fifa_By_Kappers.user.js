// ==UserScript==
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @name         Fifa By Kappers
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Kappers
// @match       https://www.ea.com/fifa/ultimate-team/web-app/
// @grant        none
// @updateURL   https://github.com/sefbsdfb/fielkappers/tree/main/downloads/Fifa_By_Kappers.user.js
// @downloadURL https://github.com/sefbsdfb/fielkappers/tree/main/downloads/Fifa_By_Kappers.user.js

// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let PlayerDataMap = new Map();
    function hightLightPlayer(){
        $.get( "https://raw.githubusercontent.com/sefbsdfb/fielkappers/main/01.%20-%20Sheet1.csv", function( CSVdata) {
            var lines=CSVdata.split("\n");
            var headers=lines[0].split(",");

            for(var i=1;i<lines.length;i++){
                if(lines[i] != ""){
                var currentline=lines[i].replaceAll('"' , "").split(",");
                    var name = currentline[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ");
                    let key = name[name.length-1]+currentline[1];
                    let value = currentline[2].trim();
                    PlayerDataMap.set(key , value);
                }
            }
            console.log('loading player data....');
            if($('.icon-transfer').length>0){
                console.log('Transfers Button is Ready to click');
                $('.icon-transfer').on('mouseover' , function(){
                    setTimeout(function(){
                        attachFunctionToTranfer();
                    }, 1000);
                });
            }else{
                setTimeout(function(){
                    hightLightPlayer();
                }, 2000);
            }

        });

    }
    hightLightPlayer();
    function attachFunctionToTranfer(){
        if($('.ut-tile-transfer-market').length>0){
            console.log('Transfers banner is Ready to click');
            $('.ut-tile-transfer-market').on("mouseover",function(){
                setTimeout(function(){
                    attachfunctionToSearch();
                }, 2000);
            });
        }
        else{
            attachFunctionToTranfer();
        }
    }
    function attachfunctionToSearch(){
        if( $('.btn-standard.call-to-action').length>0){
            console.log('Search Button is Ready to click');
            $('.btn-standard.call-to-action').on("mouseover",function(){
                highlightValues();
            });
        }
        else{
            setTimeout(function(){
                attachfunctionToSearch();
            }, 1000);

        }
    }
    function highlightValues(){
        setTimeout(function(){
            console.log('Getting Everything Ready');
            getPlayerDataFromSite();
        },1000);
    }

    function getPlayerDataFromSite(){
        for(var i=0;i<=19;i++){
            var name = $('.name:eq('+i+')').text();
            name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            var rating = $('.rating:eq('+i+')').text();
            var fullNAme = name.split(' ');
            var SitePlayerPrice = '';
            if($('.auction:eq('+i+')').children('div').eq(2).text().split(":")[1]!=undefined){
              SitePlayerPrice= $('.auction:eq('+i+')').children('div').eq(2).text().split(":")[1].replaceAll(",","");
            }
            var ExcelDataSheetPrice = PlayerDataMap.get(fullNAme[fullNAme.length-1]+""+rating);
            console.log('ExcelSheetPrice',fullNAme[fullNAme.length-1]+""+rating,"==>" , ExcelDataSheetPrice);
            console.log('SitePrice',name+""+rating+"==>" , SitePlayerPrice);
            if(ExcelDataSheetPrice!=undefined && parseInt(SitePlayerPrice)<=parseInt(ExcelDataSheetPrice)){
                $('.name:eq('+i+')').parent().css('background-color','green');
            }
        }
        $('.pagination.prev').on('click' , function(e){
            e.preventDefault();
            setTimeout(function(){
                getPlayerDataFromSite();
            }, 500);
        });

        $('.pagination.next').on('click' , function(e){
            e.preventDefault();
            setTimeout(function(){
                getPlayerDataFromSite();
            }, 500);
        });
    }








})();
