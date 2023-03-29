/* eslint-disable no-control-regex */
/* eslint-disable no-undef */
// ==UserScript==
// @name        Bildelsbasen - Helper
// @namespace   Violentmonkey Scripts
// @match       https://www.bildelsbasen.se/*
// @exclude     https://www.bildelsbasen.se/sv-se/*
// @grant       none
// @version     1.02
// @author      aleves
// @description Bildelsbasen - Helper
// ==/UserScript==

(function()
{
    "use strict";

    // Logotyp för att indikera att skriptet är igång

    const menubar = document.querySelector("body div.menubar");
    const logoDiv = document.createElement("div");
    logoDiv.textContent = "BDB Helper";
    Object.assign(logoDiv.style,
        {
            display: "inline-block",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            fontWeight: "normal",
            color: "#ffffff",
            background: "linear-gradient(to top, #9a7646, #58370a)",
            padding: "5px 10px",
            borderRadius: "8px",
            position: "relative",
            right: "-5em",
            marginTop: "-2px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: "666"
        });
    menubar.insertBefore(logoDiv, menubar.children[1]);

    // Tar priserna på sidan och drar av momsen med en text under

    if (document.querySelector("body [class=box_none]"))
    {
        let elements = document.querySelectorAll("body [class='fntBld color3Drk']");
        elements.forEach(function(element)
        {
            let newLi = document.createElement("li");
            let textContent = element.textContent;
            let number = parseFloat(textContent.replace(/[^0-9]/g, ""));
            let result = number / 1.25;
            newLi.textContent = `(¾) ${result} SEK`;
            newLi.classList.add("fntBld", "fntSml", "color3Drk");
            element.parentNode.insertBefore(newLi, element.nextSibling);
        });
    }

    // Markerar delar som är från Atracco Hedemora

    if (document.querySelector("body [class=box_none]"))
    {
        let elements = document.querySelectorAll("li");
        elements.forEach(function(element)
        {
            if (element.textContent.includes("Atracco AB - Hedemora"))
            {
                element.style.backgroundColor = "#bbcf00";
            }
        });
    }
})();