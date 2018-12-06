// ==UserScript==
// @name         Insert DU Artikel 31GG
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  News News News
// @author       Anis Fencheltee
// @match        https://31gg-31.tumblr.com/
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';
    var link = getArticleLink();
    // Your code here...
})();

function getArticleLink(){
    GM_xmlhttpRequest ( {
        method:     "GET",
        url:        "http://www.deinupdate.de/?feed=rss2",
        onload:     function (response) {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(response.responseText,"text/xml");
            var links = [];
            var docs = xmlDoc.getElementsByTagName("item");
            for (var i=0; i < docs.length; i++){
                links.push(docs[i].getElementsByTagName("link")[0].innerHTML);
            }
            var link = xmlDoc.getElementsByTagName("item")[0].getElementsByTagName("link")[0].innerHTML;
            console.log(links);
            getArticle(links);
        }
    } );
}

function getArticle(links){
    for (var i=0;i<links.length;i++){
        GM_xmlhttpRequest ( {
            method:     "GET",
            url:        links[i],
            onload:     function (response) {
                var parser = new DOMParser();
                var htmlDoc = parser.parseFromString(response.responseText,"text/html");
                //console.log(htmlDoc.getElementsByTagName("article"));
                //var link = xmlDoc.getElementsByTagName("item")[0].getElementsByTagName("link")[0].innerHTML;
                createDiv(htmlDoc);

            }
        } );
    }
}
function createDiv(article){
    var header = article.getElementsByTagName("h2")[0].getElementsByTagName("a")[0].innerHTML;
    var textTree = article.getElementsByClassName("rhonda-full-entry")[0];
    while (textTree.getElementsByTagName("script").length > 0){
        textTree.getElementsByTagName("script")[0].remove();
    }
    //textTree.getElementById("vc-feelback-main").remove();
    var text = textTree.innerHTML;
    console.log(header);
    console.log(textTree);
    var container;
    if (!$("#articleContainer").length){
        container = document.createElement("div")
        container.id="articleContainer";
        container.innerHTML += "<h1>Deinupdate Artikel:</h1>";
        container.style = "display:none";
        var foo = $("#foo");
        foo.after(container);
        addButton();
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
