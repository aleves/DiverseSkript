/* eslint-disable no-control-regex */
/* eslint-disable no-undef */
// ==UserScript==
// @name        Bildelsbasen - Helper
// @namespace   Violentmonkey Scripts
// @match       https://www.bildelsbasen.se/*
// @exclude     https://www.bildelsbasen.se/sv-se/*
// @grant       none
// @version     1.03
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

    // Placerar en sidväljare bredbvid huvudrutan

    function getCurrentPageFromURL()
    {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get("page")) || 1;
    }

    function updateURLWithPage(pageNumber)
    {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("page", pageNumber);
        const newURL = window.location.pathname + "?" + urlParams.toString();
        window.location.href = newURL;
    }

    if (document.querySelector("body [class='box_none']"))
    {
        const currentURL = window.location.href;
        console.log("Current URL:", currentURL);

        let currentPage = getCurrentPageFromURL();
        console.log("Current Page:", currentPage);

        const pageCountElement = document.querySelector("body [class='fntSml color1Med']");
        const totalPages = parseInt(pageCountElement.textContent);

        const pageSelectorDiv = document.querySelector("body [class='parttypeTabHolder']");

        const backgroundBox = document.createElement("div");
        backgroundBox.style.backgroundColor = "#f4f4f4";
        backgroundBox.style.padding = "5px";
        backgroundBox.style.borderRadius = "5px";
        backgroundBox.style.position = "fixed";
        backgroundBox.style.left = "4%";

        const pageSelector = document.createElement("select");

        for (let i = 1; i <= totalPages; i++)
        {
            const option = document.createElement("option");
            option.text = `Sida ${i}`;
            option.value = i;
            pageSelector.appendChild(option);
        }

        pageSelector.value = currentPage;

        pageSelector.addEventListener("change", (event) =>
        {
            const selectedPage = parseInt(event.target.value);
            updateURLWithPage(selectedPage);
            currentPage = selectedPage;
            console.log("Updated URL with Page:", window.location.href);
        });

        backgroundBox.appendChild(pageSelector);
        pageSelectorDiv.appendChild(backgroundBox);
    }

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