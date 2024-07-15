/* eslint-disable no-control-regex */
/* eslint-disable no-undef */
// ==UserScript==
// @name        Bildelsbasen - Helper
// @namespace   Violentmonkey Scripts
// @match       https://www.bildelsbasen.se/*
// @grant       none
// @version     2.09
// @author      aleves
// @description Bildelsbasen - Helper
// @grant       GM_xmlhttpRequest
// ==/UserScript==

(function()
{
    "use strict";

    const btnStyle = {
        border: "1px solid white",
        borderRadius: "4px",
        backgroundColor: "#e0e7ff",
        color: "black",
        cursor: "pointer",
        margin: "0 auto",
        borderBottom: "1px solid #e0e0e0",
        boxSizing: "border-box",
        textAlign: "center"
    };

    function copyPop(event)
    {
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
    }

    // Logotyp för att indikera att skriptet är igång

    const showLogo = () =>
    {
        const menubar = document.querySelector("app-header [class*=align-items-stretch]");
        const logoDiv = document.createElement("div");
        logoDiv.textContent = "BDB Helper";
        logoDiv.title = `v${GM_info.script.version}`
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
                zIndex: "66667",
                cursor: "default"
            });
        menubar.insertBefore(logoDiv, menubar.children[1]);
    }

    // Visar ändringar efter varje ny version

    if (document.querySelector("body"))
    {
        const showChangelogPopup = () =>
        {
            const savedVersion = localStorage.getItem("savedScriptVersion");
            const currentVersion = GM_info.script.version;
            if (savedVersion !== currentVersion)
            {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://raw.githubusercontent.com/aleves/DiverseSkript/main/userscript/bildelsbasen.changelog.txt",
                    onload: function(response)
                    {
                        if (response.status == 200)
                        {
                            const changelogText = response.responseText;

                            const popup = document.createElement("div");
                            popup.style.position = "fixed";
                            popup.style.top = "25%";
                            popup.style.left = "15%";
                            popup.style.transform = "translate(-50%, -50%)";
                            popup.style.background = "#fff";
                            popup.style.padding = "16px";
                            popup.style.border = "2px solid #000";
                            popup.style.zIndex = "9999";
                            popup.style.maxHeight = "50%";
                            popup.style.overflowY = "auto";

                            popup.innerHTML =
                            `
                                <h2>Förändringslogg</h2>
                                <pre style="max-height: 200px; overflow-y: auto;">${changelogText}</pre>
                                <button id="closeBtn">Stäng</button>
                            `;

                            popup.querySelector("#closeBtn").addEventListener("click", function()
                            {
                                localStorage.setItem("savedScriptVersion", currentVersion);
                                popup.remove();
                            });

                            document.body.appendChild(popup);

                        }
                    }
                });
            }
        }
        showChangelogPopup();
    }

    // Placerar en sidväljare bredbvid huvudrutan

    const sideWidget = () =>
    {
        if (!document.querySelector("[role*=tabpanel]"))
        {
            const getCurrentPageFromURL = () =>
            {
                const urlParams = new URLSearchParams(window.location.search);
                return parseInt(urlParams.get("page")) || 0;
            }

            const updateURLWithPage = (pageNumber) =>
            {
                const urlParams = new URLSearchParams(window.location.search);
                urlParams.set("page", pageNumber);
                const newURL = window.location.pathname + "?" + urlParams.toString();
                window.location.href = newURL;
                console.warn(newURL)
            }

            if (document.querySelector("body"))
            {
                let pageCount = null;
                let currentPage = getCurrentPageFromURL();

                const numOfItems = document.querySelector("[class*='mat-mdc-paginator-range-label']");
                const limOfItems = document.querySelector("[class*='mat-mdc-form-field-flex'] [class*='mat-mdc-select-min-line ng-tns']");
                try
                {
                    pageCount = Math.ceil(numOfItems.textContent.match(/of (\d+)/)[1] / limOfItems.textContent) - 1;
                }
                catch (error)
                {
                    // not present ig?
                }
                const totalPages = parseInt(pageCount);

                const pageSelectorDiv = document.querySelector("[class*=card]");

                // Remove the old background box if it exists
                const existingBackgroundBox = document.getElementById("backgroundBox");
                if (existingBackgroundBox)
                {
                    existingBackgroundBox.remove();
                }

                const backgroundBox = document.createElement("div");
                backgroundBox.id = "backgroundBox"; // Assign an ID for easy reference
                backgroundBox.style.backgroundColor = "#b4bad3";
                backgroundBox.style.padding = "5px";
                backgroundBox.style.borderRadius = "5px";
                backgroundBox.style.position = "fixed";
                backgroundBox.style.left = "4%";
                backgroundBox.style.zIndex = 999;

                const pageSelector = document.createElement("select");

                for (let i = 0; i <= totalPages; i++)
                {
                    const option = document.createElement("option");
                    option.text = `Sida ${i + 1}`;
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
        }
    }

    // Tar priserna på sidan och drar av momsen med en text under

    const priceSlasher = () =>
    {
        let elements = document.querySelectorAll("[class*='fs-7 ms-2 ng-star-inserted'], [class*='ms-1 fs-8 ng-star-inserted']");
        elements.forEach(function(elementPre)
        {
            const element = elementPre.previousSibling;
            let newLi = document.createElement("li");
            let textContent = element.textContent;
            let number = parseFloat(textContent.replace(/[a-zA-Z,]/g, ""));
            let result = number / 1.25;
            newLi.textContent = `(¾) ${result.toFixed(2)} SEK`;
            newLi.classList.add("fw-semibold");
            element.parentNode.insertBefore(newLi, element.nextSibling.nextSibling);
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

    // Aktiverar möjligheten att kunna spara bilder med högerklick

    if (document.querySelector("body"))
    {
        const mainScript = () =>
        {
            const imageItems = document.querySelectorAll(".g-image-item");
            imageItems.forEach(item =>
            {
                item.style.pointerEvents = "auto";
            });
            observeForLoadingElements();
        }

        const observeForLoadingElements = () =>
        {
            const targetNode = document.body;
            const observer = new MutationObserver(function(mutationsList, observer)
            {
                for (const mutation of mutationsList)
                {
                    if (mutation.type === "childList" && Array.from(mutation.addedNodes).some(node => node.matches && node.matches("[class*=g-loading]")) || Array.from(mutation.removedNodes).some(node => node.matches && node.matches("[class*=g-loading]")))
                    {
                        if (!document.querySelector("[class*=g-loading]"))
                        {
                            mainScript();
                            observer.disconnect();
                        }
                    }
                }
            });
            const config = { childList: true, subtree: true };
            observer.observe(targetNode, config);
        }
        observeForLoadingElements();
    }

    // Gör om PC-nummer till knappar som kopierar numret åt användaren

    const copyOriginal = () =>
    {
        try
        {
            const container = document.querySelector("app-products-list");
            const elements = container.querySelectorAll("[transloco*=\"label_original_no\"], [transloco*=\"label_new_code\"], [transloco*=\"label_visual_article_no\"], [transloco*=\"label_manufacturer_code\"]");
            const btns = document.querySelectorAll("app-products-list [class*='me-1 link-underline-hover']");

            elements.forEach((element, index) =>
            {
                const parentElement = element.parentElement;
                const btn = document.createElement("btn");
                btn.textContent = element.textContent;
                Object.assign(btn.style, btnStyle);

                btn.title = "Kopiera nummer";
                btn.addEventListener("click", event =>
                {
                    const elementText = btns[index].textContent;
                    navigator.clipboard.writeText(elementText)
                        .then(() =>
                        {
                            copyPop(event);
                        })
                        .catch(err =>
                        {
                            console.error("Failed to copy element text: ", err);
                        });

                    event.preventDefault();
                    event.stopPropagation();
                });

                parentElement.replaceChild(btn, element);
            });
        }
        catch (error)
        {
            // inga objekt att göra om till knappar
        }
    }

    // hjälpmedel på "Produktinformation"-sidan

    const productInfo = () =>
    {
        if (document.querySelector("[transloco*='label_stock_status']"))
        {
            const stockNo = document.querySelector("[class*='text-danger fw-bold ms-1']");
            const stockText = stockNo.previousSibling.previousSibling.previousSibling;
            const btn = document.createElement("btn");
            btn.textContent = stockText.textContent;
            Object.assign(btn.style, btnStyle);

            btn.title = "Kopiera nummer";
            btn.addEventListener("click", event =>
            {
                const elementText = stockNo.textContent;
                navigator.clipboard.writeText(elementText)
                    .then(() =>
                    {
                        copyPop(event);
                    })
                    .catch(err =>
                    {
                        console.error("Failed to copy element text: ", err);
                    });

                event.preventDefault();
                event.stopPropagation();
            });
            stockText.innerText = "";
            stockText.appendChild(btn);
        }

        if (document.querySelector("[transloco*='label_stock_status']"))
        {
            const companyNameDiv = document.querySelector("[class*='text-primary fw-semibold fs-6']");
            const companyName = companyNameDiv.getAttribute("title").trim();
            const btn = document.createElement("btn");
            btn.textContent = "Kopiera företagsnamn";
            Object.assign(btn.style, btnStyle);

            btn.title = "Kopiera nummer";
            btn.addEventListener("click", event =>
            {
                navigator.clipboard.writeText(companyName)
                    .then(() =>
                    {
                        copyPop(event);
                    })
                    .catch(err =>
                    {
                        console.error("Failed to copy element text: ", err);
                    });

                event.preventDefault();
                event.stopPropagation();
            });
            companyNameDiv.parentElement.insertBefore(btn, companyNameDiv.nextSibling);
        }
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
                    showLogo();
                    priceSlasher();
                    markHedemora();
                    copyOriginal();
                    productInfo();
                    sideWidget();
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
                        showLogo();
                        priceSlasher();
                        markHedemora();
                        copyOriginal();
                        productInfo();
                        sideWidget();
                    }
                }
            });
        }).observe(document.body, { subtree: true, childList: true });
    }
})();