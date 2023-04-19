/* eslint-disable no-control-regex */
/* eslint-disable no-undef */
// ==UserScript==
// @name        carparts-pros - Helper
// @namespace   Violentmonkey Scripts
// @match       https://www.carparts-pros.com/*
// @grant       none
// @version     1.00
// @author      aleves
// @description carparts-pros - Helper
// ==/UserScript==

(function()
{
    "use strict";

    let debugMode = true;

    // Logotyp för att indikera att skriptet är igång

    const menubar = document.querySelector("[class='komplett debug']");
    const logoDiv = document.createElement("div");
    logoDiv.textContent = "carparts-pros Helper";
    Object.assign(logoDiv.style,
        {
            display: "inline-block",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            fontWeight: "normal",
            color: "#ffffff",
            background: "linear-gradient(to top, #718aab, #283f61)",
            padding: "5px 10px",
            borderRadius: "8px",
            position: "absolute",
            left: "30%",
            marginTop: "-2px",
            top: "5%",
            transform: "translateY(-50%)",
            zIndex: "666"
        });
    menubar.insertBefore(logoDiv, menubar.firstElementChild);

    // Byter ut EUR till SEK vid konvertering från GBP

    if (document.querySelector("#dnutzb [class=tab_typen]"))
    {
        const fetchRates = async () =>
        {
            if (debugMode) console.log("Fetching rates from API...");
            try
            {
                const response = await fetch("https://api.vatcomply.com/rates?base=EUR");
                const data = await response.json();
                if (debugMode) console.log("Rates fetched successfully!");
                return data;
            }
            catch (error)
            {
                if (debugMode) console.log("Error fetching rates:", error);
                throw error;
            }
        };

        const updateRates = () =>
        {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const cachedDate = localStorage.getItem("ratesDate");

            // Check if the cached date matches today's date
            if (cachedDate === formatDate(today))
            {
                const cachedRates = localStorage.getItem("ratesEUR");
                if (cachedRates)
                {
                    if (debugMode) console.log("Rates found in localStorage:", JSON.parse(cachedRates));
                    const rates = JSON.parse(cachedRates);
                    const sekRate = rates.rates.SEK;
                    const elements = document.querySelectorAll("*:not(script):not(style):not(title):not(meta):not(head):not(html):not(body):not(br)");
                    elements.forEach(element =>
                    {
                        for (let node of element.childNodes)
                        {
                            if (node.nodeType === 3 && node.textContent.includes("EUR"))
                            {
                                const newContent = node.textContent.replace(/(\d+(\.\d{1,2})?)(\s)?EUR/g, (match, p1) =>
                                {
                                    const price = parseFloat(p1.replace(",", ".").replace(/\s/g, ""));
                                    const convertedPrice = (price * sekRate / 1.19).toFixed(2).replace(".", ",");
                                    const convertedPriceSlashed = ((price / 2 / 1.19) * sekRate).toFixed(2).replace(".", ",");
                                    return `${convertedPrice} kr\n(½ ${convertedPriceSlashed} kr)`;
                                });
                                const newElement = document.createElement("span");
                                newElement.style.whiteSpace = "pre-wrap"; // Add the white-space property to the element
                                newElement.textContent = newContent;
                                newElement.setAttribute("title", `Svenska priser är beräknade via VATComply.\nDagens kurs från EUR till SEK är: ${sekRate}\nTysk moms (19%) avdragen`);
                                node.parentNode.replaceChild(newElement, node);
                            }
                        }
                    });
                    return;
                }
            }

            // If the cached date does not match today's date, fetch new rates and update the cache
            if (debugMode) console.log("Fetching rates from API...");
            fetchRates().then((data) =>
            {
                localStorage.setItem("ratesEUR", JSON.stringify(data));
                localStorage.setItem("ratesDate", formatDate(today));
                if (debugMode) console.log("Rates saved to localStorage:", data);
            }).catch((error) => console.log(error));
        };

        const formatDate = (date) =>
        {
            const year = date.getFullYear();
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const day = ("0" + date.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
        }

        updateRates();
    }
})();