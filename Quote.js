const apiKey = "mdb_1ur9vVVneT4lmzfyCVsL5XrAwFbawJs9THkAcSFgtRvM";
const apiUrl = "https://llm.mdb.ai/v1/chat/completions";

const generateButton = document.getElementById("generate-button");
const promptInput = document.getElementById("prompt");
const outputBox = document.getElementById("output-box");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");

generateButton.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (!isValidPrompt(prompt)) {
        alert("Please enter a valid prompt related to quotes!");
        return;
    }

    quoteText.innerText = "Generating quote...";
    authorText.innerText = "";
    outputBox.style.display = "block";

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "Generate a quote and its author." },
                    { role: "user", content: prompt },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const quoteResponse = data.choices[0].message.content;
        displayQuote(quoteResponse);
    } catch (error) {
        console.error("Error fetching the quote:", error);
        quoteText.innerText = "An error occurred. Please try again.";
        authorText.innerText = "";
    }
});

function displayQuote(quoteResponse) {
    if (quoteResponse.includes(" - ")) {
        const [quote, author] = quoteResponse.split(" - ");
        quoteText.innerText = `"${quote.trim()}"`;
        authorText.innerText = `- ${author.trim() || "Unknown"}`;
    } else {
        quoteText.innerText = `"${quoteResponse.trim()}"`;
        authorText.innerText = "- Unknown";
    }
}

function isValidPrompt(prompt) {
    const keywords = ["quote", "inspiration", "life", "motivation", "success"];
    return keywords.some((keyword) => prompt.toLowerCase().includes(keyword));
}
