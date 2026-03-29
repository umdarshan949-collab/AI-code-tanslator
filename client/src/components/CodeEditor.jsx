import Editor from "@monaco-editor/react";
import { MONACO_LANGUAGE_MAP } from "../constants/languages.js";

function CodeEditor({ code, onChange, language, readOnly = false }) {
  return (
    <Editor
      height="100%"
      language={MONACO_LANGUAGE_MAP[language] || "plaintext"}
      value={code}
      onChange={(v) => onChange(v || "")}
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        readOnly,
        wordWrap: "on",
        automaticLayout: true,
        bracketPairColorization: { enabled: true },
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        folding: true,
        lineNumbersMinChars: 3,
        padding: { top: 16 },
      }}
    />
  );
}

export default CodeEditor;