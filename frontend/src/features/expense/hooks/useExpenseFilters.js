import { useMemo, useState } from "react";

export function useExpenseFilters(items = []) {
    const [search, setSearch] = useState("");
    const filtered = useMemo(() => items.filter((x) => (x.title || "").toLowerCase().includes(search.toLowerCase())), [items, search]);
    return { search, setSearch, filtered };
}
