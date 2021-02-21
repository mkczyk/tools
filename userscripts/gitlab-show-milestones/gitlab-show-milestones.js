// ==UserScript==
// @name         GitLab show milestones
// @namespace    https://github.com/mkczyk/tools
// @version      0.1
// @description  GitLab show milestones on board in tasks
// @author       mkczyk
// @include      *gitlab*/boards/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(main, 500);
})();

function main() {
    'use strict';

    console.log("GitLab show milestones");

    var pageId = document.getElementsByTagName('body')[0].getAttribute("data-page-type-id");

    [].forEach.call(document.getElementsByClassName('board'), function (boardElems) {
        var boardId = boardElems.getAttribute("data-id");

        GM_xmlhttpRequest({
            method: 'GET',
            url: `/-/boards/${pageId}/lists/${boardId}/issues`,
            onload: function (response) {
                var issues = JSON.parse(response.responseText);

                var cardElems = boardElems.getElementsByClassName('board-card');

                [].forEach.call(cardElems, function (elem, index) {
                    var issueId = elem.getAttribute("data-issue-id");
                    var issue = Object.entries(issues.issues).find(([key, value]) => value.id == issueId)[1];
                    var milestone = issue.milestone;
                    if (milestone) {
                        var color = milestone.id * 150 % 360;
                        var numberElem = elem.getElementsByTagName('span')[0];
                        numberElem.innerHTML = `<span>${numberElem.innerHTML} | <b style="color: hsl(${color}, 80%, 40%)">${milestone.title}</b></span>`;
                    }
                });
            }
        });


    });
}