// ==UserScript==
// @name         Insert DU Artikel 31GG
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  News News News
// @author       Anis Fencheltee
// @match        https://31gg-31.tumblr.com/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_xmlhttpRequest
//@grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    var link = getArticleLink();
    GM_addStyle('summary{cursor:pointer;}');
    // Your code here...
})();

function getArticleLink(){
    GM_xmlhttpRequest ( {
        method:     "GET",
        url:        "http://www.deinupdate.de/?feed=atom",
        onload:     function (response) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(response.responseText,"text/xml");
            var links = [];
            var docs = xmlDoc.getElementsByTagName("entry");
            for (var i=0; i < docs.length; i++){
                links.push(docs[i].getElementsByTagName("link")[0].getAttribute('href'));
            }
            console.log(links);
            getArticle(links);
        }
    } );
}

function getArticle(link){
    for (var i=0;i<link.length;i++){

        GM_xmlhttpRequest ( {
            method:     "GET",
            url:        link[i],
            onload:     function (response) {
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(this.responseText,"text/html");
                //console.log(htmlDoc.getElementsByTagName("article"));
                //var link = xmlDoc.getElementsByTagName("item")[0].getElementsByTagName("link")[0].innerHTML;
                createDiv(htmlDoc);

            }
        } );
    }

}
function createDiv(article){
    console.log("CreateDiv");
    console.log(article);
    var header =  article.getElementsByTagName("h2")[0].getElementsByTagName("a")[0].innerHTML;
    var textTree = article.getElementsByTagName("article")[0];
    var scripts = textTree.getElementsByTagName("script");
    var remScripts = [];
    for (var i = 0;i<scripts.length;i++){
        if(textTree.getElementsByTagName("script")[i].src == "" || textTree.getElementsByTagName("script")[i].src == undefined){
            remScripts.push(i);
        }
    }

    console.log(textTree)
    for (var j=0;j<remScripts.length;j++){
        var index = remScripts-j;
        textTree.getElementsByTagName("script")[index].remove();
    }
    textTree.getElementsByClassName("deinu-vor-dem-inhalt")[0].remove();
   //console.log("Check image Src");
    for (var k = 0; k<textTree.getElementsByTagName("img").length;k++){
        //console.log(textTree.getElementsByTagName("img")[k].src+": "+textTree.getElementsByTagName("img")[k].src.indexOf("deinupdate"));
        if (textTree.getElementsByTagName("img")[k].src.indexOf("deinupdate")>-1){
            textTree.getElementsByTagName("img")[k].src = textTree.getElementsByTagName("img")[k].src.replace("http:","https:");
            textTree.getElementsByTagName("img")[k].srcset = textTree.getElementsByTagName("img")[k].srcset.replace("http:","https:");
        }
    }
    //textTree.getElementById("vc-feelback-main").remove();
    var text = textTree.innerHTML;
    //console.log(header);
    //console.log(textTree);
    var container;
    if (!$("#articleContainer").length){
        container = document.createElement("details")
        container.id="articleContainer";
        container.innerHTML += "<summary style='margin-top:20px;margin-bottom:20px'>DeinUpdate Artikel</summary>";
        //container.style = "display:none";
        var foo = $("#foo");
        foo.after(container);
        //addButton();
    }else{
        container = $("#articleContainer")
    }
    var articleDetails = document.createElement("details");
    articleDetails.classList.add("articleDetails");
    articleDetails.innerHTML = "<summary style='font-weight: bold;margin-bottom:20px'>"+header+"</summary>"
    articleDetails.innerHTML += text
    container.append(articleDetails);
    var spacer = document.createElement("hr");
    container.append(spacer);
}
function addButton(){
    console.log("AddButton")
    var credit2 = $(".credit2")[0];
    console.log(credit2)
    var button = document.createElement("button");
    button.id = "toggleArticle";
    button.type = "button";
    button.value = "Artikel";
    button.innerHTML = "Artikel";
    credit2.append(button);
    $("#toggleArticle").click(function(){toggleArticle();});
}

function toggleArticle(){
    console.log("Click")
    $("#articleContainer").toggle();
}
