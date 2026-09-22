/* eslint-disable no-control-regex */
/* eslint-disable no-undef */
// ==UserScript==
// @name         PartSouq Helper
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  PartSouq Helper
// @author       aleves
// @match        https://partsouq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=partsouq.com
// @grant        none
// ==/UserScript==
(function()
{
    "use strict";

    // Logotyp för att indikera att skriptet är igång

    const logoDiv = document.createElement("div");
    logoDiv.textContent = "PartSouq Helper";
    Object.assign(logoDiv.style, {
        display: "inline-block",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#ffffff",
        background: "linear-gradient(to top right, #008080, #66b2b2)",
        padding: "5px 10px",
        borderRadius: "8px",
        position: "relative",
        verticalAlign: "middle",
        right: "2em",
        zIndex: "666"
    });
    const headerRight = document.querySelector("#header [class*=header-right]");
    const firstElement = headerRight.firstElementChild;
    headerRight.insertBefore(logoDiv, firstElement);

    // Tar priserna och halverar dessa med text under ordinarie

    if (document.querySelector("#content"))
    {
        const targetNode = document.querySelector("#content");
        const priceDivide = () =>
        {
            const elements = document.querySelectorAll("[class*=part-catalog-search] [class*=search-product-price]");
            elements.forEach(element =>
            {
                const newElement = document.createElement("div");
                newElement.textContent = "/ " + (parseFloat(element.textContent) / 2).toFixed(2).replace(".", ",");
                element.append(newElement);
            });

            if (document.querySelector("[class*=caption]"))
            {
                const elements = document.querySelectorAll("[class*=price-new]");
                elements.forEach(element =>
                {
                    const newElement = document.createElement("div");
                    newElement.textContent = "/ " + (parseFloat(element.textContent) / 2).toFixed(2).replace(".", ",");
                    element.append(newElement);
                });
            }
        }

        if (document.querySelector("[class*=part-catalog-search] [class*=search-product-price]"))
        {
            priceDivide();
        }

        let spinnerVisible = false;

        const observeLoadAnimation = () =>
        {
            const spinner = document.querySelector("[class*=modal__loading]");
            if (spinner)
            {
                spinnerVisible = true;
            }
            else if (spinnerVisible)
            {
                spinnerVisible = false;
                priceDivide();
            }
        };

        observeLoadAnimation();
        new MutationObserver(observeLoadAnimation).observe(targetNode, { childList: true, subtree: true });
    }

    // Gör om PC-nummer i rutorna som öppnas till knappar som kopierar numret åt användaren

    if (document.querySelector("#content"))
    {
        const targetNode = document.querySelector("#content");
        const runCode = () =>
        {
            const partnoTds = [...document.querySelectorAll("#partCatalogSearchModalTitle")]
                .filter(e => !e.closest("[class*=_showPrintOnly]"));
            partnoTds.forEach(td =>
            {
                if (td.textContent.trim() === "")
                {
                    return;
                }

                let partno = td.textContent.trim().replace(/^Part\s+/, "");
                const btn = document.createElement("button");
                btn.textContent = td.textContent;
                btn.title = "Vänsterklick = Kopiera nummer\nHögerklick = Kopiera nummer utan mellanslag";
                btn.addEventListener("mouseup", event =>
                {
                    let notificationText = "";
                    if (event.button === 2)
                    {
                        const cleanedPartno = partno.replace(/\s/g, "");
                        navigator.clipboard.writeText(cleanedPartno);
                        notificationText = "Kopierad utan mellanslag!";
                    }
                    else
                    {
                        navigator.clipboard.writeText(partno.replace("* ", "").replace(/\s+/g, " "));
                        notificationText = "Kopierad!";
                    }

                    const notification = document.createElement("div");
                    notification.textContent = notificationText;
                    Object.assign(notification.style, {
                        position: "absolute",
                        top: `${event.pageY - 40}px`,
                        left: `${event.pageX - 10}px`,
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #cccccc",
                        borderRadius: "5px",
                        padding: "10px",
                        fontWeight: "bold",
                        color: "#333333",
                        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.3)",
                        zIndex: "99999",
                        transition: "opacity 0.4s ease-out",
                        pointerEvents: "none"
                    });
                    document.body.appendChild(notification);
                    setTimeout(() =>
                    {
                        notification.style.opacity = 0;
                        setTimeout(() =>
                        {
                            document.body.removeChild(notification);
                        }, 200);
                    }, 500);
                });
                Object.assign(btn.style, {
                    padding: "4px 10px 2px 10px",
                    border: "1px solid white",
                    borderRadius: "4px",
                    backgroundColor: "#e0e7ff",
                    color: "black",
                    fontWeight: "bold",
                    verticalAlign: "top",
                    cursor: "pointer",
                    margin: "0 auto 0 auto",
                    borderBottom: "1px solid #e0e0e0",
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                    textAlign: "center"
                });
                btn.addEventListener("contextmenu", event =>
                {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                });
                td.textContent = "";
                td.appendChild(btn);
            });
        };

        let spinnerVisible = false;

        const observeLoadAnimation = () =>
        {
            const spinner = document.querySelector("[class*=modal__loading]");
            if (spinner)
            {
                spinnerVisible = true;
            }
            else if (spinnerVisible)
            {
                spinnerVisible = false;
                runCode();
            }
        };

        observeLoadAnimation();
        new MutationObserver(observeLoadAnimation).observe(targetNode, { childList: true, subtree: true });
    }

    // Ändrar färgen på 'Substitutions' så att risken att man missar det är lägre

    if (document.querySelector("#content"))
    {
        const targetNode = document.querySelector("#content");
        const runCode = () =>
        {
            const table = document.querySelectorAll("[class*=col-xs-12] h3");
            for (const title of table)
            {
                if (title.textContent.trim() === "Substitutions")
                {
                    Object.assign(title.style, {
                        backgroundImage: "linear-gradient(to right, #ffe6dc, #fff9e3)"
                    });
                }
            }
        }

        let spinnerVisible = false;

        const observeLoadAnimation = () =>
        {
            const spinner = document.querySelector("[class*=modal__loading]");
            if (spinner)
            {
                spinnerVisible = true;
            }
            else if (spinnerVisible)
            {
                spinnerVisible = false;
                runCode();
            }
        };

        observeLoadAnimation();
        new MutationObserver(observeLoadAnimation).observe(targetNode, { childList: true, subtree: true });
    }
})();