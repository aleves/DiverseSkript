/* eslint-disable no-control-regex */
/* eslint-disable no-undef */
// ==UserScript==
// @name        Bildelsbasen - Helper
// @namespace   Violentmonkey Scripts
// @match       https://www.bildelsbasen.se/*
// @grant       none
// @version     2.01
// @author      aleves
// @description Bildelsbasen - Helper
// ==/UserScript==

(function()
{
    "use strict";

    // Logotyp för att indikera att skriptet är igång

    const menubar = document.querySelector("app-header [class*=align-items-stretch]");
    const logoDiv = document.createElement("div");
    logoDiv.textContent = "BDB Helper";
    Object.assign(logoDiv.style,
        {
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#ffffff",
            ["text-shadow"]: "-1px 1px .25px rgba(0, 0, 0, 0.67), -1px 0 .25px rgba(0, 0, 0, 0.67)",
            background: "linear-gradient(to top right, #32689B, #00AEEF)",
            padding: "5px 10px",
            borderRadius: "8px",
            position: "absolute",
            margin: "21px",
            whiteSpace: "nowrap",
            zIndex: "66667"
        });
    menubar.insertBefore(logoDiv, menubar.children[1]);

    // Placerar en sidväljare bredbvid huvudrutan

    /*     function getCurrentPageFromURL()
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
    } */

    // Tar priserna på sidan och drar av momsen med en text under

    const priceSlasher = () =>
    {
        let elements = document.querySelectorAll("app-products-list [class*=py-2] [class*=fw-semibold]");
        elements.forEach(function(element)
        {
            let newLi = document.createElement("li");
            let textContent = element.textContent;
            let number = parseFloat(textContent.replace(/[^0-9,]/g, ""));
            let result = number / 1.25;
            newLi.textContent = `(¾) ${result} SEK`;
            newLi.classList.add("fw-semibold");
            element.parentNode.insertBefore(newLi, element.nextSibling);
        });
    }

    // Markerar delar som är från Atracco Hedemora

    const markHedemora = () =>
    {
        let elements = document.querySelectorAll("app-products-list [class*='ms-md-2 me-2 me-md-0']");
        elements.forEach(function(element)
        {
            let divElements = element.querySelectorAll("div");
            divElements.forEach(function(divElement)
            {
                if (divElement.textContent.includes("Atracco AB - Hedemora"))
                {
                    divElement.style.backgroundColor = "#bbcf00";
                }
            });
        });
    }

    // Observerar element som behöver laddas in först innan kod körs

    if (document.querySelector("app-shell"))
    {
        var svgFound = false;
        const onSvgFound = () =>
        {
            if (!svgFound)
            {
                svgFound = true;
                observer.disconnect();
                setTimeout(function()
                {
                    priceSlasher();
                    markHedemora();
                }, 500);
            }
        }

        var observer = new MutationObserver(mutations =>
        {
            mutations.forEach(mutation =>
            {
                mutation.addedNodes.forEach(node =>
                {
                    if (node instanceof SVGElement)
                    {
                        onSvgFound();
                    }
                })
            })
        });
        observer.observe(document, { childList: true, subtree: true });

        let isElementPresent = false;
        new MutationObserver(mutationsList =>
        {
            mutationsList.forEach(mutation =>
            {
                if (mutation.type === "childList")
                {
                    const targetElement = document.querySelector("ngx-loading-bar [class*=ngx-spinner-icon]");
                    if (targetElement && !isElementPresent)
                    {
                        isElementPresent = true;
                    }
                    else if (!targetElement && isElementPresent)
                    {
                        isElementPresent = false;
                        priceSlasher();
                        markHedemora();
                    }
                }
            });
        }).observe(document.body, { subtree: true, childList: true });
    }
})();