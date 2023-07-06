/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-control-regex */
/* eslint-disable no-undef */
// ==UserScript==
// @name         PL24 Helper - Volvo
// @namespace    Violentmonkey Scripts
// @version      1.01
// @description  PL24 Helper - Volvo
// @author       aleves
// @match        https://www.partslink24.com/volvo/volvo_parts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=partslink24.com
// @grant        none

// ==/UserScript==
(function()
{
    "use strict";

    // Logotyp för att indikera att skriptet är igång

    const logoDiv = document.createElement("div");
    logoDiv.textContent = "PL24 Helper - Volvo";
    Object.assign(logoDiv.style,
        {
            display: "inline-block",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#ffffff",
            background: "linear-gradient(to top right, #008080, #66b2b2)",
            padding: "5px 10px",
            borderRadius: "8px",
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: "666"
        });
    document.querySelector("#linksAndBreadCrumbs")
        .appendChild(logoDiv);

    // Scrollhjulet kan zooma illustrationen in och ut

    if (document.querySelector("#illustration-imageview-container"))
    {
        const debounce =
        (func, wait = 10) =>
            (...args) =>
                setTimeout(() => func(...args), wait);

        const zoomPlusButton = document.querySelector("#zoom-plus");
        const zoomMinusButton = document.querySelector("#zoom-minus");
        //const glassPane = document.querySelector("#GlassPane");

        const handleScrollInsideGlassPane = debounce((event) =>
        {
            const isZoomInDisabled =
            zoomPlusButton.classList.contains("toolbarBtnDisabled");
            const isZoomOutDisabled =
            zoomMinusButton.classList.contains("toolbarBtnDisabled");

            if (
                event.target.closest("#GlassPane") &&
            event.deltaY < 0 &&
            !isZoomInDisabled
            )
            {
                ImageView.sendMessage("ZoomIn", null);
            }

            if (
                event.target.closest("#GlassPane") &&
            event.deltaY > 0 &&
            !isZoomOutDisabled
            )
            {
                ImageView.sendMessage("ZoomOut", null);
            }
        });

        window.addEventListener("wheel", handleScrollInsideGlassPane);
    }

    // Om ett cirkapris saknas skapas en knapp för att söka direkt på Bildelsbasen (öppnas i ny flik)

    if (document.querySelector("#partin4dlg"))
    {
        const targetNode = document.querySelector("#partin4dlg");
        const runCode = () =>
        {
            const existingNewPrices = document.querySelectorAll("#partin4content td.partinfoPriceCol span.new-price");
            if (existingNewPrices.length > 0) return;

            const priceTds = document.querySelectorAll("#partin4content td.partinfoPriceCol:not(.partin4partspromCol)");
            priceTds.forEach((td) =>
            {
                const priceText = td.innerText.trim()
                    .replace(/\s/g, "");
                const price = parseFloat(priceText);
                if (!isNaN(price))
                {
                    const newPrice = price / 2;
                    const span = document.createElement("span");
                    span.innerText = `\n / ${newPrice.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    span.style.fontSize = "9.25px";
                    span.classList.add("new-price");
                    td.appendChild(span);
                }
                else
                {
                    const partNumber = td.closest("tr")
                        .querySelector(".partinfoPartnoCol")
                        .innerText.trim();
                    const button = document.createElement("button");
                    button.innerText = td.innerText;
                    button.title = "Sök på Bildelsbasen (Ny flik)";
                    button.addEventListener("click", (event) =>
                    {
                        const searchUrl = `https://www.bildelsbasen.se/se-sv/OEM/${partNumber}/?page=1&order=price&asc=1`;
                        window.open(searchUrl, "_blank");
                        event.preventDefault();
                        event.stopPropagation();
                    });
                    const buttonStyle = {
                        padding: "4px 10px 2px 10px",
                        border: "1px solid white",
                        borderRadius: "4px",
                        backgroundColor: "#e0e7ff",
                        color: "black",
                        verticalAlign: "top",
                        cursor: "pointer",
                        margin: "0 auto 0 auto",
                        borderBottom: "1px solid #e0e0e0",
                        display: "block",
                        width: "150%",
                        boxSizing: "border-box",
                        textAlign: "center"
                    };
                    Object.assign(button.style, buttonStyle);
                    td.innerText = "";
                    td.appendChild(button);
                }
            });
        };
        const observer = new MutationObserver((mutationsList) =>
        {
            mutationsList.forEach((mutation) =>
            {
                if (mutation.type === "childList" && document.querySelector("#partin4dlg > div.blockUI.blockOverlay"))
                {
                    const intervalId = setInterval(() =>
                    {
                        const partinfoTable = document.querySelector("#partin4MainTable tbody");
                        if (partinfoTable && partinfoTable.childElementCount > 0)
                        {
                            clearInterval(intervalId);
                            runCode();
                        }
                    }, 75);
                }
            });
        });
        observer.observe(targetNode,
            {
                childList: true
            });
    }

    // Gör om PC-nummer i rutorna som öppnas till knappar som kopierar numret åt användaren

    if (document.querySelector("#partin4dlg"))
    {
        const targetNode = document.querySelector("#partin4dlg");
        const runCode = () =>
        {
            const partnoTds = document.querySelectorAll("#partin4content td.partinfoPartnoCol");
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
        };

        new MutationObserver(mutationsList =>
        {
            mutationsList.forEach(mutation =>
            {
                if (mutation.type === "childList" && document.querySelector("#partin4dlg > div.blockUI.blockOverlay"))
                {
                    const intervalId = setInterval(() =>
                    {
                        const partinfoTable = document.querySelector("#partin4MainTable tbody");
                        if (partinfoTable && partinfoTable.childElementCount > 0)
                        {
                            clearInterval(intervalId);
                            runCode();
                        }
                    }, 75);
                }
            });
        })
            .observe(targetNode,
                {
                    childList: true
                });
    }

    // Ändrar färgen på 'Nummerändring' så att risken att man missar det är lägre

    // Då jag inte har funnit ett exempel på detta hittills så är detta inaktiverat tillsvidare

    /*
    if (document.querySelector("#partin4content"))
    {
        const partin4content = document.querySelector("#partin4content");
        const observer = new MutationObserver(() =>
        {
            const partin4TabSupersessionsLink = document.querySelector("#partin4Tab-reman > a");
            if (partin4TabSupersessionsLink && partin4TabSupersessionsLink.getAttribute("href") === "#partin4TabDiv-reman")
            {
                const partInfoTabsUl = document.querySelector("#partInfoTabs > ul");
                if (partInfoTabsUl)
                {
                    partInfoTabsUl.style.backgroundImage = "linear-gradient(to right, #ff6a2b, #f7c400)";
                }
            }
        });

        observer.observe(partin4content, { childList: true });
    }
    */

    // Skapar en knapp så att man kan ladda ner illustrationen som är framme

    if (document.querySelector("#illustration-imageview-container"))
    {
        const illustrationButtons = document.getElementById("illustration-buttons");

        const newTdElement = document.createElement("td");
        newTdElement.classList.add("illuBtn");

        const newAElement = document.createElement("a");
        newAElement.id = "new-btn";
        newAElement.classList.add("toolbarBtn", "toolbarBtnActive");
        newAElement.href = "#";
        newAElement.tabIndex = "-1";
        newAElement.title = "Ladda ner illustration (PNG)";

        const newSvgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        newSvgElement.setAttribute("viewBox", "0 0 121 123");
        newSvgElement.setAttribute("fill", "#fff");
        newSvgElement.innerHTML = "<path d=\"M0 0h121v94H88V84h22V10H11v74h21v10H0V0zm52 101V84h17v17h12l-21 22-20-22zM34 25a8 8 0 11-8 8 8 8 0 018-8zm33 34 16-28 16 43H22v-6h6l7-16 3 12h10l8-22 11 17z\"/>";
        Object.assign(newSvgElement.style,
            {
                width: "100%",
                height: "80%",
                maxWidth: "100%",
                maxHeight: "100%"
            });
        newAElement.appendChild(newSvgElement);

        Object.assign(newAElement.style,
            {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "transparent"
            });

        newAElement.addEventListener("mouseover", () =>
        {
            newAElement.style.backgroundColor = "#9a9b9d";
        });

        newAElement.addEventListener("mouseout", () =>
        {
            newAElement.style.backgroundColor = "transparent";
        });

        newTdElement.appendChild(newAElement);

        const trimTdElement = illustrationButtons.querySelector(".trim");
        trimTdElement.parentNode.insertBefore(newTdElement, trimTdElement);

        const downloadBtn = document.getElementById("new-btn");
        downloadBtn.addEventListener("click", () =>
        {
            ImageView.sendMessage("FitToWindow", null);

            const mainImage = document.querySelector("#MainImage");
            const imageSrc = mainImage.getAttribute("src");

            const bboxRegex = /&bbox=[^&]*?(\d+)%2C(\d+)%2C(\d+)%2C(\d+)/;
            const bboxMatch = imageSrc.match(bboxRegex);
            const [, , , width, height] = bboxMatch;

            const modifiedImageSrc = imageSrc
                .replace(/(&bbox=[^&]*?)0*\d{1,3}(?=[^&]*?(&|$))/, "$10")
                .replace(/&width=[^&]*/, "&width=" + width)
                .replace(/&height=[^&]*/, "&height=" + height)
                .replace(/&scalefac=[^&]*/, "&scalefac=1");

            const link = document.createElement("a");
            const [, , number] = modifiedImageSrc.split("?path=")[1].split("&")[0].split("/");
            const filename = `Volvo_${number}`;
            link.download = filename;
            link.href = modifiedImageSrc;
            link.click();
        });
    }

    // Markerar färgkoder

    if (document.querySelector("#bom-comtainer"))
    {
        //const curInCRC = [...document.querySelectorAll("#vinTabsGeneral [class*=vinInfoTable] tbody tr td")].find(el => el.textContent.includes("Kod för klädsel/inredning")).nextSibling;
        const curOutCRC = [...document.querySelectorAll("#vinTabsGeneral [class*=vinInfoTable] tbody tr td")].find(el => el.textContent.includes("Ytterfärg")).nextSibling;
        const bomOptionsOutCRC = [...document.querySelectorAll("#bom-comtainer tbody td div")]
            .filter(e => e.textContent.toLowerCase().includes("colour code"));
        const bomOptionsInCRC = [...document.querySelectorAll("#bom-comtainer tbody td div")]
            .filter(e => e.textContent.toLowerCase().includes("interior code"));

        //console.log(curInCRC)
        //console.log(bomOptionsOutCRC)

        bomOptionsOutCRC.forEach(div =>
        {
            //const regex = /\bALTER\b.*|\D/g;
            //const crc = div.textContent.replace(regextest, "");
            const regex = /(?<=Colour code: )\d+/
            const crc = div.textContent.match(regex)
            console.log(crc)
            if (curOutCRC.textContent.includes(crc))
            {
                console.log("TRUE")
                div.innerHTML = div.innerHTML.replace(div.textContent, `<span style="background-color: #00f7c4">${div.textContent}</span>`);
            }
        });

        bomOptionsInCRC.forEach(div =>
        {
            const regex = /\bALTER\b.*|\D/g;
            const crc = div.textContent.replace(regex, "");
            //console.log(div.textContent)
            if (curOutCRC.textContent.includes(crc))
            {
                console.log("TRUE")
                div.innerHTML = div.innerHTML.replace(div.textContent, `<span style="background-color: #00f7c4">${div.textContent}</span>`);
            }
        });
    }

    // Markerar nuvarande chassinr

    if (document.querySelector("#bom-comtainer"))
    {
        const curChassiTds = [...document.querySelectorAll("#vinTabsGeneral [class*=vinInfoTable] tbody tr td")].find(el => el.textContent.includes("Partnergrupp")).previousSibling;
        const curFCTds = [...document.querySelectorAll("#vinTabsGeneral [class*=vinInfoTable] tbody tr td")].find(el => el.textContent.includes("Fabrikskod")).nextSibling;
        const curModelTds = [...document.querySelectorAll("#vinTabsGeneral [class*=vinInfoTable] tbody tr td")].find(el => el.textContent.includes("Modell")).nextSibling;

        const curChassi = parseInt(curChassiTds.textContent.trim().replace(/^0+/, ""));
        //console.log(curChassi)
        const curFC = curFCTds.textContent.trim();
        const curModel = curModelTds.textContent.match(/\w+/)[0];
        const resChassiTds = [...document.querySelectorAll("#bom-comtainer tbody td div")];
        resChassiTds.forEach(el =>
        {
            const chMatches = el.textContent.matchAll(/(FC\s*\d+;\s*)?(\w+\s*)?CH\s*(-?\d+)?\s*-\s*(-?\d+)?/g);
            for (const chMatch of chMatches)
            {
                //console.log(chMatch)
                const fcMatch = chMatch[1];
                const modelMatch = chMatch[2];
                const chStart = parseInt(chMatch[3]);
                const chEnd = parseInt(chMatch[4]);
                if ((!fcMatch || fcMatch.includes(curFC)) && (!modelMatch || modelMatch.includes(curModel)) && (!chStart || curChassi >= chStart) && (!chEnd || curChassi <= chEnd))
                {
                    //console.log(chMatch[0])
                    const text = el.innerHTML.replace(chMatch[0], `<span style="background-color: #aff700">${chMatch[0]}</span>`);
                    el.innerHTML = text;
                    //el.parentElement.style.backgroundColor = "#b1d2ff";
                }
            }
        });
    }

    // Markerar nuvarande utrustning + ger dess beskrivning när man hovrar markeringarna

    if (document.querySelector("#bom-comtainer"))
    {
        const vinOptionTrs = [
            ...document.querySelectorAll("#vinTabsVariDesign [class*=vinInfoTable] tbody tr [class*=vinOption]")
        ];
        const vinOptionBOM = [...document.querySelectorAll("#bom-comtainer tbody td div")]
            .filter(e =>
            {
                const text = e.textContent.toLowerCase();
                return /variant|varaint/.test(text);
            });

        vinOptionTrs.forEach(tr =>
        {
            const searchStr = tr.textContent.trim();
            vinOptionBOM.forEach(div =>
            {
                const excludeRegex = /(FC\s*\d+;\s*)?(\w+\s*)?CH\s*(-?\d+)?\s*-\s*(-?\d+)?/g;
                if (div.textContent.includes(searchStr))
                {
                    const variantCodeRegex = /Variant code:\s*(\w+)/g;
                    const variantCodeMatches = variantCodeRegex.exec(div.textContent);
                    const hasVariantCode = variantCodeMatches && variantCodeMatches[1];
                    if (!excludeRegex.test(div.textContent) || hasVariantCode)
                    {
                        const highlightedText = div.innerHTML.replace(new RegExp(searchStr, "g"),
                            `<span class="highlight" style="background-color: #d4de00;">${searchStr}</span>`);
                        div.innerHTML = highlightedText;
                        const highlightSpans = div.querySelectorAll(".highlight");
                        highlightSpans.forEach(span =>
                        {
                            const description = tr.nextSibling.textContent.trim();
                            span.setAttribute("title", description);

                            span.addEventListener("mouseover", () =>
                            {
                                span.style.backgroundColor = "#45c9ff";
                            });
                            span.addEventListener("mouseout", () =>
                            {
                                span.style.backgroundColor = "#d4de00";
                            });

                            //span.parentElement.parentElement.style.backgroundColor = "#b1d2ff";

                            if (div.textContent.trim().includes(" and "))
                            {
                                if (highlightSpans.length === 2)
                                {
                                    span.parentElement.parentElement.style.textDecoration = "";
                                }
                                else
                                {
                                    span.parentElement.parentElement.style.textDecoration = "line-through";
                                }
                            }
                        });
                    }
                }
                else
                {
                    //if ()
                    //div.parentElement.style.backgroundColor = "#b1d2ff";
                }
            });
        });
    }

    // Markerar fälg/däck storlekar

    const navRows = [...document.querySelectorAll("#nav-group3-table tbody tr [class*='name tc-lcell'] a")];
    const vinRows = [...document.querySelectorAll("#vinTabsVariDesign [class*=vinInfoTable] tbody tr")];

    navRows.forEach(navRow =>
    {
        const numberRegex = /\d+/; // Regular expression to match a number
        const navText = navRow.textContent;
        const number = navText.match(numberRegex)?.[0]; // Extract the number from the text

        // Check if the navRow's text contains a number followed by "
        if (number && navText.includes("\""))
        {
            // Check if the number matches any of the vinRows with "TYRE SIZE" or "WHEEL, INCH"
            const matchingVinRow = vinRows.find(vinRow =>
            {
                const vinTd = vinRow.querySelector("td:nth-child(2)");
                const vinText = vinTd?.textContent;

                return vinText && (vinText.includes(number) && (vinText.includes("TYRE SIZE") || vinText.includes("WHEEL, INCH")));
            });

            if (matchingVinRow)
            {
                navRow.parentElement.style.backgroundColor = "#b1d2ff"; // Highlight the parent element
            }
        }
    });


    // Förbättringar att förklara "Chassikod" och markerar "MARKED" som stämmer överens

    let result;

    const elements = [...document.querySelectorAll("#vinTabsGeneral [class*=vinInfoTable] tbody tr td")];
    const indexChassikod = elements.findIndex(element => element.textContent === "Chassikod");
    const indexArsmodell = elements.findIndex(element => element.textContent === "Årsmodell");

    if (indexChassikod !== -1 && indexArsmodell !== -1 && indexChassikod < elements.length - 1 && indexArsmodell < elements.length - 1)
    {
        const nextElementChassikod = elements[indexChassikod + 1];
        const nextElementArsmodell = elements[indexArsmodell + 1];
        const textChassikod = nextElementChassikod.textContent.trim();
        const textArsmodell = nextElementArsmodell.textContent.trim();

        if (textChassikod.length === 8)
        {
            const year = parseInt(textArsmodell, 10);
            if (year <= 2000)
            {
                nextElementChassikod.innerHTML = replaceWithColorsAndTooltips(textChassikod, "AABCDEFG", "8-char-and-below-2000");
            }
            else
            {
                nextElementChassikod.innerHTML = replaceWithColorsAndTooltips(textChassikod, "AABCCDEF", "8-char-and-above-2000");
            }
        }
        else if (textChassikod.length === 12)
        {
            nextElementChassikod.innerHTML = replaceWithColorsAndTooltips(textChassikod, "AABBCDDEEFGH", "12-char");
        }
        else
        {
            console.log("Chassikod is not 8 or 12 characters long.");
        }
    }
    else
    {
        console.log("Element not found or no elements exist next to them.");
    }

    function replaceWithColorsAndTooltips(string, positions, className)
    {
        result = "";
        for (let i = 0; i < string.length; i++)
        {
            const char = string.charAt(i);
            const position = positions.charAt(i);
            let color, tooltip;

            switch (position)
            {
                case "A":
                    color = "background-color: #ffd5d5;";
                    if (className === "12-char")
                    {
                        tooltip = "Front Suspension Spring Code";
                        break;
                    }
                    tooltip = "Front Suspension Spring & Strut Code";
                    break;
                case "B":
                    color = "background-color: #ffead1;";
                    if (className === "12-char")
                    {
                        tooltip = "Front Suspension Strut Code";
                        break;
                    }
                    tooltip = "Front Anti-sway Bar Code";
                    break;
                case "C":
                    color = "background-color: #fdfed9;";
                    if (className === "8-char-and-below-2000")
                    {
                        tooltip = "Rear Suspension Shock Code";
                        break;
                    }
                    else if (className === "8-char-and-above-2000")
                    {
                        tooltip = "Rear Suspension Spring & Shock Code";
                        break;
                    }
                    tooltip = "Front Anti-Sway Bar Code";
                    break;
                case "D":
                    color = "background-color: #e4fedd;";
                    if (className === "8-char-and-above-2000")
                    {
                        tooltip = "Rear Anti-Sway Bar Code";
                        break;
                    }
                    tooltip = "Rear Suspension Spring Code";
                    break;
                case "E":
                    color = "background-color: #cdf8fd;";
                    if (className === "8-char-and-below-2000")
                    {
                        tooltip = "Rear Suspension Anti-Sway Bar Code";
                        break;
                    }
                    else if (className === "8-char-and-above-2000")
                    {
                        tooltip = "Front Suspension Bump Stop Code";
                        break;
                    }
                    tooltip = "Rear Suspension Shock Code";
                    break;
                case "F":
                    color = "background-color: #cfdffd;";
                    if (className === "8-char-and-below-2000")
                    {
                        tooltip = "Suspension Bump Stop Code";
                        break;
                    }
                    else if (className === "8-char-and-above-2000")
                    {
                        tooltip = "Rear Suspension Bump Stop Code";
                        break;
                    }
                    tooltip = "Rear Anti-Sway Bar Code";
                    break;
                case "G":
                    color = "background-color: #ded7fd;";
                    if (className === "8-char-and-below-2000")
                    {
                        tooltip = "Steering Rack Code";
                        break;
                    }
                    else if (className === "8-char-and-above-2000")
                    {
                        tooltip = "N/A";
                        break;
                    }
                    tooltip = "Front Suspension Bump Stop Code";
                    break;
                case "H":
                    color = "background-color: #ffe1fc;";
                    if (className === "12-char")
                    {
                        tooltip = "Rear Suspension Bump Stop Code";
                        break;
                    }
                    tooltip = "N/A";
                    break;
                default:
                    color = "";
                    tooltip = "";
                    break;
            }

            result += `<span style="${color}" title="${tooltip}">${char}</span>`;
        }
        return result;
    }

    if (document.querySelector("#bom-comtainer"))
    {
        const regex = /<span[^>]+title="([^"]+)">([^<]+)<\/span>/g;
        const input = result;
        const resultMap = {};

        let match;

        while ((match = regex.exec(input)))
        {
            const [, title, value] = match;
            resultMap[title] = (resultMap[title] || "") + value;
        }

        const combinedResults = Object.entries(resultMap).map(
            ([title, value]) => `title="${title}">${value}</span>`
        );

        const partNames = Array.from(document.querySelectorAll("#bom-comtainer tbody [class*=partName]"));
        const restrictionElements = Array.from(document.querySelectorAll("#bom-comtainer tbody [class*=restrictionHtml]"));

        const translationMap = {
            "fjädring bak, skruvfjäder och torsionsfjäder": ["Rear Suspension Spring Code", "Rear Suspension Shock Code"],
            "fjädring bak, skruvfjäder och torsionsfjäder, 2WD": ["Rear Suspension Spring Code", "Rear Suspension Shock Code"],
            "fjädring fram, skruvfjäder och torsionsfjäder": ["Front Suspension Spring Code", "Front Suspension Bump Stop Code"],
            "Stötdämpare bakre": ["Rear Suspension Bump Stop Code", "Rear Suspension Shock Code"],
            "Stötdämpare främre": ["Front Suspension Strut Code", "Front Suspension Bump Stop Code"],
            "krängningshämmare bakre": ["Rear Anti-Sway Bar Code"],
            "krängningshämmare främre": ["Front Anti-Sway Bar Code"]
        };

        const translationMapAlt = {
            "Bakfjäder": "Rear Suspension Spring Code",
            "Framfjäder": "Front Suspension Spring Code"
        };

        const extractedTitles = combinedResults.map(result =>
            (result.match(/title="([^"]+)">/) || [])[1]
        );

        const extractedValues = combinedResults.map(result =>
            (result.match(/>([^<]+)<\/span>/) || [])[1]
        );

        const partNameElementTop = partNames[0]?.firstChild;
        const partNameTranslation = translationMap[partNameElementTop?.textContent];

        if (partNameTranslation)
        {
            partNameTranslation.forEach(translatedPartName =>
            {
                restrictionElements.forEach(restrictionElement =>
                {
                    const restrictionText = restrictionElement.firstChild?.textContent;

                    if (restrictionText?.includes("MARKED"))
                    {
                        const markedValue = restrictionText.split("MARKED")[1]?.trim();
                        const titleIndex = extractedTitles.findIndex(title => title === translatedPartName);

                        if (titleIndex !== -1)
                        {
                            const extractedValue = extractedValues[titleIndex];
                            const pattern = new RegExp(`(^|[^\\d])${extractedValue}(?![\\d])`);
                            if (pattern.test(markedValue))
                            {
                                console.log("Match found!");
                                console.log("Matched Value:", extractedValue);
                                restrictionElement.style.backgroundColor = "#b1d2ff";

                                restrictionElements.forEach((restrictionElement, i) =>
                                {
                                    const partNameElem = partNames[i]?.firstChild;

                                    if (restrictionElement.firstChild?.textContent.includes("MARKED") &&
                                        Object.prototype.hasOwnProperty.call(translationMapAlt, partNameElem?.textContent))
                                    {
                                        const translatedPartName = translationMapAlt[partNameElem.textContent];
                                        const titleIndex = extractedTitles.findIndex(title => title === translatedPartName);

                                        if (titleIndex !== -1)
                                        {
                                            const extractedValue = extractedValues[titleIndex];
                                            const pattern = new RegExp(`(^|[^\\d])${extractedValue}(?![\\d])`);
                                            if (pattern.test(restrictionElement.textContent))
                                            {
                                                console.log("Match found!");
                                                console.log("Matched Value:", extractedValue);
                                                restrictionElement.style.backgroundColor = "#b1d2ff";

                                                if (partNameElem?.textContent === "Framfjäder")
                                                {
                                                    restrictionElements.forEach((restrictionElement, i) =>
                                                    {
                                                        const partNameElem = partNames[i]?.firstChild;
                                                        if (restrictionElement.firstChild?.textContent.includes("MARKED") &&
                                                            partNameElem?.textContent === "Stötdämpare")
                                                        {
                                                            const titleIndex = extractedTitles.findIndex(title => title === "Front Suspension Strut Code");
                                                            if (titleIndex !== -1)
                                                            {
                                                                const extractedValue = extractedValues[titleIndex];
                                                                const pattern = new RegExp(`(^|[^\\d])${extractedValue}(?![\\d])`);

                                                                if (pattern.test(restrictionElement.textContent))
                                                                {
                                                                    console.log("Match found!");
                                                                    console.log("Matched Value:", extractedValue);
                                                                    restrictionElement.style.backgroundColor = "#b1d2ff";
                                                                }
                                                            }
                                                        }
                                                    });
                                                }

                                                if (partNameElem?.textContent === "Bakfjäder")
                                                {
                                                    restrictionElements.forEach((restrictionElement, i) =>
                                                    {
                                                        const partNameElem = partNames[i]?.firstChild;
                                                        if (restrictionElement.firstChild?.textContent.includes("MARKED") &&
                                                            partNameElem?.textContent === "Stötdämpare")
                                                        {
                                                            const titleIndex = extractedTitles.findIndex(title => title === "Rear Suspension Shock Code");
                                                            if (titleIndex !== -1)
                                                            {
                                                                const extractedValue = extractedValues[titleIndex];
                                                                const pattern = new RegExp(`(^|[^\\d])${extractedValue}(?![\\d])`);

                                                                if (pattern.test(restrictionElement.textContent))
                                                                {
                                                                    console.log("Match found!");
                                                                    console.log("Matched Value:", extractedValue);
                                                                    restrictionElement.style.backgroundColor = "#b1d2ff";
                                                                }
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                            else
                                            {
                                                console.log("Match not found or values don't match.");
                                            }
                                        }
                                    }
                                });
                            }
                            else
                            {
                                console.log("Match not found or values don't match.");
                            }
                        }
                    }
                });
            });
        }
    }
})();