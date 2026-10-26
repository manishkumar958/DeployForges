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
      code: 'const learner = "Builder";\nconst nextStep = "Deploy";\n\nconsole.log(`Hello, ${learner}!`);\nconsole.log(`Your next step: ${nextStep}.`);'
    },
    loop: {
      language: "javascript",
      code: 'for (let step = 1; step <= 4; step++) {\n  console.log(`Pipeline step ${step}: ${["Code", "Test", "Build", "Deploy"][step - 1]}`);\n}'
    },
    html: {
      language: "html",
      code: '<main style="font-family:Arial;padding:28px;color:#142033">\n  <p style="color:#0d9488;font-weight:bold">DEPLOYFORGE LAB</p>\n  <h1>Hello, builder 👋</h1>\n  <p>Your first preview is working.</p>\n  <button onclick="this.textContent=\\'You did it! ✓\\'">Try me</button>\n</main>\n<style>button{padding:10px 14px;border:0;border-radius:8px;background:#0d9488;color:white;cursor:pointer}</style>'
    }
  };

  function setMode() {
    const isHtml = language.value === "html";
    filename.textContent = isHtml ? "index.html" : "main.js";
    editorMode.textContent = isHtml ? "HTML" : "JAVASCRIPT";
  }

  function runCode() {
    const isHtml = language.value === "html";
    preview.hidden = true;
    output.hidden = false;
    output.textContent = "";

    if (isHtml) {
      // The preview is sandboxed and cannot access the parent page.
      preview.srcdoc = code.value;
      preview.hidden = false;
      output.hidden = true;
      return;
    }

    try {
      const source = code.value.replace(/</g, "\\u003c");
      const wrapped = `
        <!doctype html><html><body><pre id="result"></pre>
        <script>
          const result = document.getElementById('result');
          const write = (...args) => {
            result.textContent += args.map(v => {
              try { return typeof v === 'object' ? JSON.stringify(v) : String(v); }
              catch (_) { return String(v); }
            }).join(' ') + '\\\\n';
          };
          console.log = write; console.warn = write; console.error = write;
          try { ${source} } catch (e) { write('Error: ' + e.message); }
          if (!result.textContent) result.textContent = 'Code executed successfully (no output).';
          parent.postMessage({ type: 'deployforge-output', value: result.textContent }, '*');
        <\/script></body></html>`;
      preview.srcdoc = wrapped;
      preview.hidden = false;
      output.hidden = true;
      output.textContent = "Running in a restricted browser preview…";
    } catch (error) {
      output.textContent = "Error: " + error.message;
    }
  }

  window.addEventListener("message", event => {
    if (event.source !== preview.contentWindow) return;
    if (event.data && event.data.type === "deployforge-output") {
      output.textContent = event.data.value;
      output.hidden = false;
      preview.hidden = true;
    }
  });

  language.addEventListener("change", () => {
    setMode();
    output.textContent = "Your result will appear here.";
    preview.hidden = true;
    output.hidden = false;
  });
  document.getElementById("run-button").addEventListener("click", runCode);
  document.getElementById("reset-button").addEventListener("click", () => {
    const sample = language.value === "html" ? samples.html : samples.hello;
    code.value = sample.code;
    output.textContent = "Example restored. Press Run code.";
    preview.hidden = true;
    output.hidden = false;
    setMode();
  });
  document.getElementById("clear-output").addEventListener("click", () => {
    output.textContent = "";
    preview.hidden = true;
    output.hidden = false;
  });
  document.querySelectorAll("[data-sample]").forEach(button => {
    button.addEventListener("click", () => {
      const sample = samples[button.dataset.sample];
      language.value = sample.language;
      code.value = sample.code;
      setMode();
      output.textContent = "Sample loaded. Press Run code.";
      preview.hidden = true;
      output.hidden = false;
      document.getElementById("playground").scrollIntoView({ behavior: "smooth" });
    });
  });

  setMode();
})();
