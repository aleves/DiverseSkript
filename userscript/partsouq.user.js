/* eslint-disable no-control-regex */
/* eslint-disable no-undef */
// ==UserScript==
// @name         PartSouq Helper
// @namespace    Violentmonkey Scripts
// @version      1.02
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
        const priceDivide = () =>
        {
            const elements = document.querySelectorAll("#gf-result-table [class*=sr-price]");
            elements.forEach(element =>
            {
                const newElement = document.createElement("div");
                newElement.textContent = "/ " + (parseFloat(element.textContent) / 2).toFixed(2).replace(".", ",");
                element.after(newElement);
            });

            if (document.querySelector("[class*=caption]"))
            {
                const elements = document.querySelectorAll("[class*=price-new]");
                elements.forEach(element =>
                {
                    const newElement = document.createElement("div");
                    newElement.textContent = "/ " + (parseFloat(element.textContent) / 2).toFixed(2).replace(".", ",");
                    element.after(newElement);
                });
            }
        }

        if (document.querySelector("#gf-result-table [class*=sr-price]"))
        {
            priceDivide();
        }

        const observer = new MutationObserver((mutationsList) =>
        {
            for (const mutation of mutationsList)
            {
                const { removedNodes } = mutation;
                if (
                    mutation.type === "childList" &&
                removedNodes[0]?.nodeName === "IMG" &&
                removedNodes[0]?.getAttribute("alt") === "wait" &&
                removedNodes[0]?.getAttribute("src") === "/images/dashinfinity.gif"
                )
                {
                    priceDivide();
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Gör om PC-nummer i rutorna som öppnas till knappar som kopierar numret åt användaren

    if (document.querySelector("#content"))
    {
        const addBtns = () =>
        {
            const partnoTds = document.querySelectorAll("#gf-result-table [class*=sr-number]");
            partnoTds.forEach(td =>
            {
                if (td.innerText.trim() === "")
                {
                    return;
                }

                const btn = document.createElement("button");
                btn.innerText = td.innerText;
                btn.title = "Kopiera nummer";
                btn.addEventListener("click", event =>
                {
                    navigator.clipboard.writeText(td.innerText.trim());
                    const notification = document.createElement("div");
                    notification.innerText = "Kopierad!";
                    Object.assign(notification.style,
                        {
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
                            zIndex: "9999",
                            transition: "opacity 0.4s ease-out"
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
                    event.preventDefault();
                    event.stopPropagation();
                });
                Object.assign(btn.style,
                    {
                        padding: "4px 10px 2px 10px",
                        border: "1px solid white",
                        borderRadius: "4px",
                        backgroundColor: "#e0e7ff",
                        color: "black",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        verticalAlign: "top",
                        cursor: "pointer",
                        margin: "0 auto 0 auto",
                        borderBottom: "1px solid #e0e0e0",
                        display: "block",
                        width: "100%",
                        boxSizing: "border-box",
                        textAlign: "center"
                    });
                td.innerText = "";
                td.appendChild(btn);
            });

            if (document.querySelector("[class*=caption]"))
            {
                const elements = [...document.querySelectorAll("[class*=search-result-container]")];
                console.warn(elements)
                elements.forEach(element =>
                {
                    const h2Elements = element.querySelectorAll("h2");
                    h2Elements.forEach(h2Element =>
                    {
                        const textContent = h2Element.textContent;
                        const regex = /Part number: (.+)/;
                        const match = textContent.match(regex);

                        if (match)
                        {
                            const partNumber = match[1];

                            if (partNumber.trim() === "")
                            {
                                return;
                            }

                            const wrapper = document.createElement("div");
                            wrapper.style.display = "flex";
                            wrapper.style.alignItems = "center";
                            const textElement = document.createElement("span");
                            textElement.innerText = "Part number: ";
                            textElement.style.marginRight = "4px";
                            wrapper.appendChild(textElement);

                            const btn = document.createElement("button");
                            btn.innerText = partNumber;
                            btn.title = "Kopiera nummer";
                            btn.addEventListener("click", event =>
                            {
                                navigator.clipboard.writeText(partNumber.trim());
                                const notification = document.createElement("div");
                                notification.innerText = "Kopierad!";
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
                                    zIndex: "9999",
                                    transition: "opacity 0.4s ease-out"
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
                                event.preventDefault();
                                event.stopPropagation();
                            });
                            Object.assign(btn.style, {
                                padding: "4px 10px 2px 10px",
                                border: "1px solid white",
                                borderRadius: "4px",
                                backgroundColor: "#e0e7ff",
                                color: "black",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                verticalAlign: "top",
                                cursor: "pointer",
                                borderBottom: "1px solid #e0e0e0",
                                display: "block",
                                boxSizing: "border-box",
                                textAlign: "center",
                                margin: 0
                            });
                            wrapper.appendChild(btn);
                            h2Element.innerText = "";
                            h2Element.appendChild(wrapper);
                        }
                    });
                });
            }
        }

        if (document.querySelector("#gf-result-table [class*=sr-number]"))
        {
            addBtns();
        }

        const observer = new MutationObserver((mutationsList) =>
        {
            for (let mutation of mutationsList)
            {
                if (mutation.type === "childList" && mutation.removedNodes.length > 0)
                {
                    const removedNode = mutation.removedNodes[0];
                    if (
                        removedNode.nodeName === "IMG" &&
                    removedNode.getAttribute("alt") === "wait" &&
                    removedNode.getAttribute("src") === "/images/dashinfinity.gif"
                    )
                    {
                        addBtns();
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    //

    var illustPanel = document.querySelector("[id*=zoom_container]");
    illustPanel.style.border = "1px solid #d3d0d9";
    illustPanel.style.borderRadius = "4px";
})();