/* eslint-disable no-control-regex */
/* eslint-disable no-undef */
// ==UserScript==
// @name         RecoPart Helper - DemoWeb
// @namespace    Violentmonkey Scripts
// @version      1.00
// @description  RecoPart Helper - DemoWeb
// @author       aleves
// @match        https://dismantlers.recopart.se/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=partslink24.com
// @grant        none
// ==/UserScript==
(function()
{
    "use strict";

    // Logotyp för att indikera att skriptet är igång

    const logoDiv = document.createElement("div");
    logoDiv.textContent = "RecoPart Helper - DemoWeb";
    Object.assign(logoDiv.style, {
        display: "inline-block",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        fontWeight: "bold",
        color: "#ffffff",
        ["text-shadow"]: "-1px 1px .25px rgba(0, 0, 0, 0.67), -1px 0 .25px rgba(0, 0, 0, 0.67)",
        background: "linear-gradient(to top right, #009f70, #bbcf00)",
        padding: "5px 10px",
        borderRadius: "8px",
        position: "relative",
        margin: "10px",
        left: "24rem",
        whiteSpace: "nowrap",
        zIndex: "66667"
    });

    const logoContainer = document.querySelector("#titleLogoContainer > div.titleLogo > div");
    logoContainer.appendChild(logoDiv);

    // Gör om text till knappar som kopierar dess innehåll

    function click2copy(input)
    {
        if (document.querySelector("#main-form"))
        {
            if (!input.textContent)
            {
                return;
            }
            const btn = document.createElement("button");
            btn.innerText = input.textContent;
            btn.title = "Kopiera nummer";
            btn.addEventListener("mousedown", event =>
            {
                navigator.clipboard.writeText(input.textContent.trim());
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
                    borderBottom: "1px solid #e0e0e0",
                    display: "block",
                    boxSizing: "border-box",
                    textAlign: "center"
                });
            input.textContent = "";
            input.appendChild(btn);
        }
    }

    // Gör om PC-nummer i rutorna som öppnas till knappar som kopierar numret åt användaren inuti "Delinformation"

    if (document.querySelector("#topControllerBarLeft").innerText == "Delinformation")
    {
        const pcElement = [...document.querySelectorAll("#main-form [class*=form-group] label")]
            .find(label => label.textContent === "Produktnummer")?.nextElementSibling;
        if (pcElement.textContent.trim() === "")
        {
            return;
        }
        click2copy(pcElement);
    }

    // Lägger till sökspalter där man vill ha dem inuti "Delinformation"

    function searchbox(dropdownIn)
    {
        if (document.querySelector("#topControllerBarLeft").innerText == "Delinformation")
        {
            const searchInput = Object.assign(document.createElement("input"), {type: "text", placeholder: "Sök..."});

            const dropdown = document.querySelector(dropdownIn);
            dropdown.parentNode.insertBefore(searchInput, dropdown);

            const toggleSearchInput = () => searchInput.disabled = dropdown.disabled;

            if (dropdown.disabled) toggleSearchInput();

            const resetOptions = () =>
            {
                dropdown.querySelectorAll("option").forEach(option => option.style.display = "");
            }

            const filterOptions = searchValue =>
            {
                const options = dropdown.querySelectorAll("option");
                options.forEach(option =>
                {
                    option.style.display = option.textContent.toLowerCase().includes(searchValue) ? "" : "none";
                });

                const visibleOptions = dropdown.querySelectorAll("option:not([style='display: none;'])");
                if (visibleOptions.length === 1)
                {
                    visibleOptions[0].selected = true;
                }

                dropdown.size = visibleOptions.length;
            }

            dropdown.addEventListener("change", () =>
            {
                if (!searchInput.value) resetOptions();
                dropdown.removeAttribute("size");
            });

            searchInput.addEventListener("focus", () => dropdown.removeAttribute("size"));

            searchInput.addEventListener("input", () => filterOptions(searchInput.value.toLowerCase()));

            document.addEventListener("click", event =>
            {
                if (!dropdown.contains(event.target) && !searchInput.contains(event.target))
                    dropdown.removeAttribute("size");
            });

            new MutationObserver(mutations =>
                mutations.forEach(mutation =>
                    mutation.attributeName === "disabled" && toggleSearchInput()
                )
            ).observe(dropdown, { attributes: true });
        }
    }

    // Lägger till en sökspalt ovanför "Delkod" i "Delinformation"

    if (document.querySelector("#topControllerBarLeft").innerText == "Delinformation")
    {
        searchbox("#PartCodeId");
    }

    // Lägger till en sökspalt ovanför "Bilkod" i "Delinformation"

    if (document.querySelector("#topControllerBarLeft").innerText == "Delinformation")
    {
        searchbox("#CarCodeId");
    }

    // Gömmer chat
    function setVisibilityHidden()
    {
        const element = document.querySelector("[title*=Knapp]");
        if (element)
        {
            const parent = element.parentElement.parentElement;
            parent.style.visibility = "hidden";
            observer.disconnect();
        }
    }
    const observer = new MutationObserver(setVisibilityHidden);
    observer.observe(document.body, { childList: true, subtree: true });
})();