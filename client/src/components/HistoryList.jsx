function HistoryList({ entries, onView, onDelete, selectedId }) {
  if (entries.length === 0) {
    return <div className="history-empty">No history yet</div>;
  }

  return (
    <div>
      {entries.map((entry) => (
        <div
          key={entry._id}
          className={`history-item ${selectedId === entry._id ? "active" : ""}`}
          onClick={() => onView(entry)}
        >
          <div className="history-item-info">
            <div className="history-item-type">{entry.type}</div>
            <div className="history-item-meta">
              {entry.sourceLanguage}
              {entry.targetLanguage ? ` → ${entry.targetLanguage}` : ""}
              {" · "}
              {new Date(entry.createdAt).toLocaleDateString()}
            </div>
          </div>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry._id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default HistoryList;