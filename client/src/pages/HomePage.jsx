import { useState } from "react";
import toast from "react-hot-toast";
import CodeEditor from "../components/CodeEditor.jsx";
import OutputPanel from "../components/OutputPanel.jsx";
import LanguageSelector from "../components/LanguageSelector.jsx";
import { STARTER_CODE } from "../constants/languages.js";
import {
  translateCode,
  analyzeComplexity,
  optimizeCode,
  explainCode,
} from "../services/codeService.js";
import "../styles/home.css";

const ACTIONS = ["translate", "analyze", "optimize", "explain"];

function HomePage() {
  const [activeAction, setActiveAction] = useState("translate");
  const [code, setCode] = useState(STARTER_CODE.python);
  const [sourceLanguage, setSourceLanguage] = useState("python");
  const [targetLanguage, setTargetLanguage] = useState("java");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSourceChange = (langId) => {
    setSourceLanguage(langId);
    if (STARTER_CODE[langId]) setCode(STARTER_CODE[langId]);
    setResult(null);
  };

  const handleSwap = () => {
    if (activeAction !== "translate") return;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    if (result?.translatedCode) {
      setCode(result.translatedCode);
      setResult(null);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    let text = "";
    if (activeAction === "translate") text = result.translatedCode || "";
    else if (activeAction === "optimize") text = result.optimizedCode || "";
    else if (activeAction === "explain") text = result.explanation || "";
    else if (activeAction === "analyze")
      text = `Time: ${result.timeComplexity}\nSpace: ${result.spaceComplexity}\n\n${result.explanation || ""}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy.");
    }
  };

  const handleRun = async () => {
    if (!code.trim()) return toast.error("Please write some code first.");
    if (!sourceLanguage) return toast.error("Select a source language.");
    if (activeAction === "translate" && !targetLanguage)
      return toast.error("Select a target language.");

    setLoading(true);
    setResult(null);

    try {
      const fns = {
        translate: () => translateCode(code, sourceLanguage, targetLanguage),
        analyze: () => analyzeComplexity(code, sourceLanguage),
        optimize: () => optimizeCode(code, sourceLanguage),
        explain: () => explainCode(code, sourceLanguage),
      };

      const data = await fns[activeAction]();
      setResult(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="action-tabs">
          {ACTIONS.map((a) => (
            <button
              key={a}
              className={`action-tab ${activeAction === a ? "active" : ""}`}
              onClick={() => {
                setActiveAction(a);
                setResult(null);
              }}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          {result && (
            <button className="copy-btn" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
          <button className="run-btn" onClick={handleRun} disabled={loading}>
            {loading ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Panels */}
      <div className="panels">
        {/* Left — Source */}
        <div className="panel">
          <div className="panel-header">
            <span>Source</span>
            <LanguageSelector
              value={sourceLanguage}
              onChange={handleSourceChange}
              disabled={loading}
            />
          </div>
          <div className="panel-body">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={sourceLanguage}
            />
          </div>
        </div>

        {/* Swap / Arrow button */}
        {activeAction === "translate" ? (
          <button className="swap-btn" onClick={handleSwap} title="Swap">
            ⇄
          </button>
        ) : (
          <div className="swap-btn" style={{ cursor: "default" }}>→</div>
        )}

        {/* Right — Output */}
        <div className="panel">
          <div className="panel-header">
            <span>Output</span>
            {activeAction === "translate" ? (
              <LanguageSelector
                value={targetLanguage}
                onChange={setTargetLanguage}
                disabled={loading}
              />
            ) : (
              <span className="action-badge">{activeAction}</span>
            )}
          </div>
          <div className="panel-body">
            {loading ? (
              <div className="loading-panel">
                <div className="spinner" />
              </div>
            ) : (
              <OutputPanel
                result={result}
                action={activeAction}
                targetLanguage={targetLanguage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;