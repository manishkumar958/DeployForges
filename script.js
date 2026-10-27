(() => {
  const code = document.getElementById("code");
  const language = document.getElementById("language");
  const output = document.getElementById("output");
  const preview = document.getElementById("preview");
  const filename = document.getElementById("filename");
  const editorMode = document.getElementById("editor-mode");

  const samples = {
    hello: {
      language: "javascript",
      code: 'console.log("Hello, DeployForge!");'
    },
    loop: {
      language: "javascript",
      code: 'for (let i = 1; i <= 4; i++) console.log("Step " + i);'
    },
    html: {
      language: "html",
      code: '<h1>Hello, DeployForge!</h1><p>HTML preview works.</p>'
    }
  };

  const languageIds = {
    python: 71,
    c: 50,
    cpp: 54
  };

  function setMode() {
    const lang = language.value.toLowerCase();
    const names = {
      python: ["main.py", "PYTHON"],
      c: ["main.c", "C"],
      cpp: ["main.cpp", "C++"],
      javascript: ["main.js", "JAVASCRIPT"],
      html: ["index.html", "HTML"]
    };
    const selected = names[lang] || names.javascript;
    filename.textContent = selected[0];
    editorMode.textContent = selected[1];
  }

  async function runCode() {
    const lang = language.value.toLowerCase();
    preview.hidden = true;
    output.hidden = false;
    output.textContent = "Running code...";

    if (lang === "html") {
      preview.srcdoc = code.value;
      preview.hidden = false;
      output.hidden = true;
      return;
    }

    if (lang === "javascript") {
      try {
        const logs = [];
        const logger = (...args) => logs.push(args.map(String).join(" "));
        const safeConsole = { log: logger, warn: logger, error: logger };
        new Function("console", code.value)(safeConsole);
        output.textContent = logs.join("\n") || "Code executed successfully.";
      } catch (error) {
        output.textContent = "Error: " + error.message;
      }
      return;
    }

    const languageId = languageIds[lang];
    if (!languageId) {
      output.textContent = "Please select Python, C, C++, JavaScript or HTML.";
      return;
    }

    try {
const response = await fetch("https://deployforge-backend.onrender.com/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.value,
          language_id: languageId
        })
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        output.textContent = "Execution error: " +
          (result.error || JSON.stringify(result));
        return;
      }

      output.textContent =
        result.stdout ||
        result.compile_output ||
        result.stderr ||
        result.message ||
        "Program finished without output.";
    } catch (error) {
      output.textContent =
        "Could not connect to the local backend. Make sure python app.py is running. " +
        error.message;
    }
  }

  language.addEventListener("change", () => {
    setMode();
    output.textContent = "Your result will appear here.";
    preview.hidden = true;
    output.hidden = false;
  });

  document.getElementById("run-button").addEventListener("click", runCode);

  document.getElementById("reset-button").addEventListener("click", () => {
    const sample = samples[language.value] || samples.hello;
    code.value = sample.code;
    output.textContent = "Example restored. Press Run code.";
    preview.hidden = true;
    output.hidden = false;
    setMode();
  });

  document.getElementById("copy-output").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(output.innerText);
      alert("Output copied successfully!");
    } catch (error) {
      alert("Copy failed. Please open the website using HTTPS.");
    }
  });


  document.querySelectorAll("[data-sample]").forEach(button => {
    button.addEventListener("click", () => {
      const sample = samples[button.dataset.sample];
      if (!sample) return;
      language.value = sample.language;
      code.value = sample.code;
      setMode();
      output.textContent = "Sample loaded. Press Run code.";
      preview.hidden = true;
      output.hidden = false;
      document.getElementById("playground").scrollIntoView({
        behavior: "smooth"
      });
    });
  });

  setMode();
})();
