"use client";

import { useState } from "react";
import { Search } from "lucide-react";

// Filters the server-rendered achievement cards in place by toggling `hidden`,
// so the cards themselves never need to hydrate.
export function AchievementSearch({ listId }) {
  const [noResults, setNoResults] = useState(false);

  const onChange = (e) => {
    const q = e.target.value.trim().toLowerCase();
    let shown = 0;
    document.querySelectorAll(`#${listId} [data-search]`).forEach((card) => {
      const match = !q || card.dataset.search.includes(q);
      card.hidden = !match;
      if (match) shown++;
    });
    setNoResults(shown === 0);
  };

  return (
    <div className="mb-8 flex flex-col items-center gap-3">
      <div className="relative w-full md:max-w-lg">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search achievements..."
          aria-label="Search achievements"
          aria-controls={listId}
          onChange={onChange}
          className="flex w-full border px-3 py-2 text-base md:text-sm pl-10 h-11 rounded-xl border-border/60 bg-card/50 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary/50 transition-colors"
        />
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {noResults ? "No achievements match that search." : ""}
      </p>
    </div>
  );
}
