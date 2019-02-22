// ==UserScript==
// @name         Insert DU Artikel 31GG
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  News News News
// @author       Anis Fencheltee
// @match        https://31gg-31.tumblr.com/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_xmlhttpRequest
//@grant        GM_addStyle
// ==/UserScript==

var x = 0;

var anfrage = false;
var request = false;
(function() {
    var container1 = document.createElement("div")
    container1.id="articles";
    foo.after(container1);
    'use strict';
    GM_addStyle('summary{cursor:pointer;}');
    getArticleLink("http://www.deinupdate.de/?feed=atom");
    var interval;
    interval = window.setInterval(function(){
        if(!anfrage){
            getArticleLink("https://myrap.com/feed/atom/");
            clearInterval(interval)

        }else{
            console.log("Warte auf Slot")
        }
    },1000);
    window.setInterval(function(){
        var open=false;
        var elements = document.getElementsByClassName("articleDetails");
        for (var x = 0;x<elements.length;x++){
            open = elements[x].open;
            if(open) break;
        }
        console.log(open);
        if (!open){
            $("#articleContainerMR").remove();
            $("#articleContainerDU").remove();
            getArticleLink("http://www.deinupdate.de/?feed=atom");
            interval = window.setInterval(function(){
                if(!anfrage){
                    getArticleLink("https://myrap.com/feed/atom/");
                    clearInterval(interval)
                }else{
                    console.log("Warte auf Slot")
                }
            },1000);
        }
    },60000)
    // Your code here...
})();

function getArticleLink(feed){
    anfrage=true;
    GM_xmlhttpRequest ( {
        method:     "GET",
        url:        feed,
        onload:     function (response) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(response.responseText,"text/xml");
            var links = [];
            var docs = xmlDoc.getElementsByTagName("entry");
            var title = xmlDoc.getElementsByTagName("title")[0].innerHTML;
            if (title=="") title="Deinupdate"
            console.log(title)
            for (var i=0; i < docs.length; i++){
                links.push(docs[i].getElementsByTagName("link")[0].getAttribute('href'));
            }
            console.log(links);
            getArticle(links,title);
        }
    } );
}

function getArticle(link,title){
    if (title=="Deinupdate"){
        if ($("#articleContainerDU").length){
        }
    }else{
        if ($("#articleContainerMR").length){
        }
    }
    x=0;
    loopArray(link,title)
}

var loopArray = function(arr,title) {
        customAlert(arr[x],title,function(){
            // set x to next item
            x++;
            // any more items in array? continue loop
            if(x < arr.length) {
                loopArray(arr,title);
            }else{
                anfrage=false;
                var add=""
                if (title=="Deinupdate")add="DU"
                else add="MR"
                $("#articleContainer"+add).children().first().show();
                $("#articleContainer"+add).on("toggle",function(){
                    if(!this.open){
                        var children = $(this).find(".articleDetails");
                        for (var z = 0; z<children.length; z++){
                            if(children[z].open)children[z].open=false;
                        }
                    }
                });
            }
        });
    }

    function customAlert(link,title,callback) {
        GM_xmlhttpRequest ( {
            method:     "GET",
            url:        link,
            onload:     function (response) {
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(this.responseText,"text/html");
                //console.log(htmlDoc.getElementsByTagName("article"));
                //var link = xmlDoc.getElementsByTagName("item")[0].getElementsByTagName("link")[0].innerHTML;
                createDiv(htmlDoc,title);
                callback();
            }
        });
        // do callback when ready
    }

function createDiv(article,title){
    //console.log("CreateDiv");
    console.log(title);
    var add=""
    if (title=="Deinupdate")add="DU"
    else add="MR"
    if (article.getElementsByTagName("h2")[0].classList.contains('site-title')){
        var header =  article.getElementsByTagName("h1")[0].innerHTML;
    }else{
        var header =  article.getElementsByTagName("h2")[0].getElementsByTagName("a")[0].innerHTML;
    }
    var textTree = article.getElementsByTagName("article")[0];
    var scripts = textTree.getElementsByTagName("script");
    var remScripts = [];
    for (var i = 0;i<scripts.length;i++){
        if(textTree.getElementsByTagName("script")[i].src == "" || textTree.getElementsByTagName("script")[i].src == undefined){
            remScripts.push(i);
        }
    }

    //console.log(textTree)
    for (var j=0;j<remScripts.length;j++){
        var index = remScripts-j;
        textTree.getElementsByTagName("script")[index].remove();
    }
    if (textTree.getElementsByClassName("deinu-vor-dem-inhalt").length > 0) textTree.getElementsByClassName("deinu-vor-dem-inhalt")[0].remove();
   //console.log("Check image Src");
    for (var k = 0; k<textTree.getElementsByTagName("img").length;k++){
        //console.log(textTree.getElementsByTagName("img")[k].src+": "+textTree.getElementsByTagName("img")[k].src.indexOf("deinupdate"));
        if (textTree.getElementsByTagName("img")[k].src.indexOf("deinupdate")>-1){
            textTree.getElementsByTagName("img")[k].src = textTree.getElementsByTagName("img")[k].src.replace("http:","https:");
            textTree.getElementsByTagName("img")[k].srcset = textTree.getElementsByTagName("img")[k].srcset.replace("http:","https:");
        }
    }
    for (var l = 0; l<textTree.getElementsByTagName("iframe").length;l++){
        //console.log(textTree.getElementsByTagName("img")[k].src+": "+textTree.getElementsByTagName("img")[k].src.indexOf("deinupdate"));
        var ratio = textTree.getElementsByTagName("iframe")[l].height/textTree.getElementsByTagName("iframe")[l].width
        textTree.getElementsByTagName("iframe")[l].width = document.getElementsByClassName("menu")[0].offsetWidth
        textTree.getElementsByTagName("iframe")[l].height = textTree.getElementsByTagName("iframe")[l].width * ratio
    }
    //textTree.getElementById("vc-feelback-main").remove();
    var text = textTree.innerHTML;
    //console.log(header);
    //console.log(textTree);
    var container;
    if (!$("#articleContainer"+add).length){
        container = document.createElement("details")
        container.id="articleContainer"+add;
        container.innerHTML += "<summary style='margin-top:20px;margin-bottom:20px;display:none'>"+title.replace(/ .*/,'')+" Artikel</summary>";
        //container.style = "display:none";
        var foo = $("#articles");
        foo.append(container);
        //addButton();
    }else{
        container = $("#articleContainer"+add)
    }
    var articleDetails = document.createElement("details");
    articleDetails.classList.add("articleDetails");
    articleDetails.innerHTML = "<summary style='font-weight: bold;margin-bottom:20px'>"+header+"</summary>"
    articleDetails.innerHTML += text
    container.append(articleDetails);
    var spacer = document.createElement("hr");
    container.append(spacer);
    request=false;
}
function addButton(){
    //console.log("AddButton")
    var credit2 = $(".credit2")[0];
    //console.log(credit2)
    var button = document.createElement("button");
    button.id = "toggleArticle";
    button.type = "button";
    button.value = "Artikel";
    button.innerHTML = "Artikel";
    credit2.append(button);
    $("#toggleArticle").click(function(){toggleArticle();});
}

function toggleArticle(){
    //console.log("Click")
    $("#articleContainer").toggle();
}
