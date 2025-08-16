import React, { useEffect, useState } from 'react';

// Small floating button allowing users to toggle performance mode manually.
// Persists preference in localStorage (key: perf-mode-enabled) overriding heuristic.
const PerfToggle = () => {
    const docEl = typeof document !== 'undefined' ? document.documentElement : null;
    const initial = docEl ? docEl.classList.contains('perf-mode') : false;
    const [enabled, setEnabled] = useState(initial);

    useEffect(() => {
        if (!docEl) return;
        if (enabled) {
            docEl.classList.add('perf-mode');
            localStorage.setItem('perf-mode-enabled', '1');
        } else {
            docEl.classList.remove('perf-mode');
            localStorage.setItem('perf-mode-enabled', '0');
        }
    }, [enabled, docEl]);

    return (
        <button
            aria-pressed={enabled}
            aria-label={enabled ? 'Disable performance mode' : 'Enable performance mode'}
            onClick={() => setEnabled(e => !e)}
            className="perf-toggle-btn"
        >
            {enabled ? 'Performance On' : 'Performance Off'}
        </button>
    );
};

export default PerfToggle;
