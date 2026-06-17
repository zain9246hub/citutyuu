import React, { useState, useMemo, useEffect } from "react";
import { Search, Store, Tag, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { deals as initialDeals } from "@/utils/dealData";
import { businesses } from "@/data/businessData";

// Words to ignore when parsing the user's natural-language query
const STOP_WORDS = new Set([
  "a", "an", "the", "of", "in", "on", "at", "for", "to", "and", "or",
  "with", "near", "me", "my", "today", "tonight", "tomorrow", "now",
  "this", "that", "is", "are", "any", "some", "best", "top",
  "show", "find", "search", "please", "give",
]);

// Words that signal the user wants something specific — boost relevance
const INTENT_WORDS = new Set([
  "offer", "offers", "deal", "deals", "discount", "discounts", "sale",
  "coupon", "promo", "menu", "shop", "store", "restaurant",
]);

interface SearchHit {
  type: "deal" | "business";
  id: string | number;
  title: string;
  subtitle: string;
  location?: string;
  score: number;
}

const tokenize = (q: string): string[] =>
  q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOP_WORDS.has(t));

const scoreText = (text: string | undefined, tokens: string[]): number => {
  if (!text) return 0;
  const lower = text.toLowerCase();
  let s = 0;
  for (const t of tokens) {
    if (!t) continue;
    if (lower === t) s += 5;
    else if (lower.includes(t)) s += INTENT_WORDS.has(t) ? 1 : 2;
  }
  return s;
};

const SAMPLE_QUERIES = [
  "burger offer today in Adajan",
  "pizza deals in Mumbai",
  "spa discount near me",
  "cafe in Bandra",
  "weekend offers in Pune",
  "biryani deals tonight",
  "salon offers in Delhi",
  "ice cream near me",
  "gym membership discount",
  "best restaurant in Surat",
  "shopping sale this week",
  "coffee shop in Koramangala",
];

const SmartSearch: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(() =>
    Math.floor(Math.random() * SAMPLE_QUERIES.length)
  );

  // Rotate placeholder every 2.5s while dialog is open and input is empty
  useEffect(() => {
    if (!open || query) return;
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % SAMPLE_QUERIES.length);
    }, 2500);
    return () => clearInterval(id);
  }, [open, query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  // Keyboard shortcut: /
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.target as HTMLElement)?.tagName !== "INPUT" && (e.target as HTMLElement)?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results: SearchHit[] = useMemo(() => {
    const tokens = tokenize(query);
    if (tokens.length === 0) return [];

    // Load user-added deals from localStorage too
    let allDeals = [...initialDeals];
    try {
      const userDealsStr = localStorage.getItem("userDeals");
      if (userDealsStr) allDeals = [...allDeals, ...JSON.parse(userDealsStr)];
    } catch {}

    const hits: SearchHit[] = [];

    for (const d of allDeals) {
      const score =
        scoreText(d.title, tokens) * 3 +
        scoreText(d.description, tokens) +
        scoreText(d.category, tokens) * 2 +
        scoreText(d.city, tokens) * 3 +
        scoreText(d.location, tokens) * 3 +
        scoreText((d.tags || []).join(" "), tokens) * 2;
      if (score > 0) {
        hits.push({
          type: "deal",
          id: d.id,
          title: d.title,
          subtitle: `${d.category} • ${d.discount ? d.discount + "% OFF" : "Deal"}`,
          location: `${d.location || ""}${d.location && d.city ? ", " : ""}${d.city || ""}`,
          score,
        });
      }
    }

    for (const b of businesses) {
      const score =
        scoreText(b.name, tokens) * 3 +
        scoreText(b.category, tokens) * 2 +
        scoreText(b.city, tokens) * 3 +
        scoreText((b as any).location, tokens) * 3 +
        scoreText((b as any).description, tokens) +
        scoreText(((b as any).tags || []).join(" "), tokens);
      if (score > 0) {
        hits.push({
          type: "business",
          id: b.id,
          title: b.name,
          subtitle: b.category,
          location: (b as any).location || b.city,
          score,
        });
      }
    }

    return hits.sort((a, b) => b.score - a.score).slice(0, 20);
  }, [query]);

  const handleSelect = (hit: SearchHit) => {
    setOpen(false);
    if (hit.type === "deal") navigate(`/deal/${hit.id}`);
    else navigate(`/business/${hit.id}`);
  };

  const deals = results.filter((r) => r.type === "deal");
  const biz = results.filter((r) => r.type === "business");

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="text-foreground"
      >
        <Search className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-4 pt-4 pb-2">
            <DialogTitle className="text-base font-semibold">Smart Search</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Try "burger offer today in Adajan"'
                className="pl-9 pr-9 h-11"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                  aria-label="Clear"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Type what you want — food, place, city or area.
            </p>
          </div>

          <div className="max-h-[60vh] overflow-y-auto border-t">
            {query.trim() === "" ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Search across deals and businesses.
              </div>
            ) : results.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No matches for <span className="font-medium text-foreground">"{query}"</span>.
              </div>
            ) : (
              <div className="py-2">
                {deals.length > 0 && (
                  <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Deals
                  </div>
                )}
                {deals.map((hit) => (
                  <button
                    key={`d-${hit.id}`}
                    onClick={() => handleSelect(hit)}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-accent text-left transition-colors"
                  >
                    <Tag className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{hit.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{hit.subtitle}</div>
                      {hit.location && (
                        <div className="text-xs text-muted-foreground/80 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{hit.location}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}

                {biz.length > 0 && (
                  <div className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Businesses
                  </div>
                )}
                {biz.map((hit) => (
                  <button
                    key={`b-${hit.id}`}
                    onClick={() => handleSelect(hit)}
                    className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-accent text-left transition-colors"
                  >
                    <Store className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{hit.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{hit.subtitle}</div>
                      {hit.location && (
                        <div className="text-xs text-muted-foreground/80 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{hit.location}</span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SmartSearch;
