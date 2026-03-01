import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/photobookSearch.css";

const API_URL = "http://localhost:3001";

const getTitleRaw = (b) => b?.Titulo || b?.["Título"] || "";
const getTitle = (b) => (getTitleRaw(b) || "").toString().trim();

export default function PhotobookSearch({
  value,
  onChange,
  placeholder = "Buscar por título, autor, país, editorial...",
  showIcon = true,
  wrapperClassName = "search-wrapper",
  inputClassName = "search-input-custom",
  iconClassName = "bi bi-search",
}) {
  const isControlled = typeof value === "string" && typeof onChange === "function";

  const [qInternal, setQInternal] = useState("");
  const q = isControlled ? value : qInternal;

  const setQ = (next) => {
    if (isControlled) onChange(next);
    else setQInternal(next);
  };

  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const navigate = useNavigate();
  const rootRef = useRef(null);

  useEffect(() => {
    if (!q.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }

    const t = setTimeout(() => {
      fetch(`${API_URL}/fotolibros/buscar?q=${encodeURIComponent(q.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(Array.isArray(data) ? data : []);
          setActiveIndex(-1);
        });
    }, 250);

    return () => clearTimeout(t);
  }, [q]);

  const titles = useMemo(() => {
    return results
      .map((b) => ({
        id: b?.id,
        title: getTitle(b),
      }))
      .filter((x) => x.id != null && x.title);
  }, [results]);

  const goTo = (id) => {
    if (id == null) return;
    setOpen(false);
    setQ("");
    setResults([]);
    setActiveIndex(-1);
    navigate(`/fotolibro/${id}`);
  };

  useEffect(() => {
    const onDocMouseDown = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const onKeyDown = (e) => {
    if (!open || titles.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, titles.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < titles.length) {
        e.preventDefault();
        goTo(titles[activeIndex].id);
      }
    }

    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="photobook-search" ref={rootRef}>
      <div className={wrapperClassName}>
        {showIcon && <i className={iconClassName} aria-hidden="true" />}

        <input
          type="text"
          value={q}
          className={inputClassName}
          placeholder={placeholder}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          autoComplete="off"
        />
      </div>

      {open && q.trim() && titles.length > 0 && (
        <div className="photobook-search-results" role="listbox">
          {titles.slice(0, 10).map((x, idx) => (
            <div
              key={x.id}
              className={`photobook-search-item ${idx === activeIndex ? "is-active" : ""}`}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => goTo(x.id)}
              role="option"
              aria-selected={idx === activeIndex}
            >
              <div className="photobook-search-title-only">{x.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}