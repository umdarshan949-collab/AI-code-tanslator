import CodeEditor from "./CodeEditor.jsx";
import "../styles/output.css";

function InfoCard({ title, value, explanation }) {
  return (
    <div className="info-card">
      <h4>{title}</h4>
      <div className="badge">{value}</div>
      {explanation && <p>{explanation}</p>}
    </div>
  );
}

function OutputPanel({ result, action, targetLanguage }) {
  if (!result) {
    return (
      <div className="empty-state">
        <p>
          Write code, pick an action, and hit <span>Run</span>
        </p>
      </div>
    );
  }

  if (action === "translate") {
    return (
      <div className="output-code">
        <CodeEditor
          code={result.translatedCode || ""}
          onChange={() => {}}
          language={targetLanguage}
          readOnly={true}
        />
      </div>
    );
  }

  if (action === "analyze") {
    return (
      <div className="complexity-cards">
        <InfoCard
          title="Time Complexity"
          value={result.timeComplexity}
          explanation={result.explanation}
        />
        <InfoCard
          title="Space Complexity"
          value={result.spaceComplexity}
        />
      </div>
    );
  }

  if (action === "optimize") {
    return (
      <div className="optimize-output">
        <div className="optimize-code">
          <CodeEditor
            code={result.optimizedCode || ""}
            onChange={() => {}}
            language={targetLanguage}
            readOnly={true}
          />
        </div>
        {result.suggestions && (
          <div className="suggestions-box">
            <h4>Suggestions</h4>
            <p>{result.suggestions}</p>
          </div>
        )}
      </div>
    );
  }

  if (action === "explain") {
    return (
      <div className="explain-output">
        <p>{result.explanation}</p>
      </div>
    );
  }

  return null;
}

export default OutputPanel;