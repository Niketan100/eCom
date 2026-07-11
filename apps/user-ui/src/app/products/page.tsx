'use client';

import { Suspense } from 'react';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../utils/axiosInstance';
import PageShell from 'apps/user-ui/src/shared/components/PageShell';
import { useSearchParams } from 'next/navigation';
// ─── Icons (inline SVG so no extra dep) ─────────────────────────────────────

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─── Types ───────────────────────────────────────────────────────────────────

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  images?: string[];
};

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc';

// ─── Product Card ─────────────────────────────────────────────────────────────

const ProductCard = ({ product }: { product: Product }) => {
  const displayPrice = product.discountedPrice ?? product.price;
  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.discountedPrice! / product.price) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden border border-[#ECECEA] hover:border-[#F97316]/40 hover:shadow-[0_8px_32px_-8px_rgba(249,115,22,0.18)] transition-all duration-300 hover:-translate-y-0.5">
        {/* Image area */}
        <div className="relative h-52 bg-[#F4F4F2] flex items-center justify-center overflow-hidden">
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-[#F97316] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full z-10">
              -{discountPct}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-3 right-3 bg-[#111010]/70 text-white text-[11px] font-medium px-2.5 py-1 rounded-full z-10">
              Out of stock
            </span>
          )}
          <span className="text-6xl group-hover:scale-110 transition-transform duration-300 select-none">📦</span>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F97316] bg-[#F97316]/10 px-2.5 py-0.5 rounded-full">
              {product.category}
            </span>
            <span className="ml-auto text-xs text-[#9A9A96]">
              {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
            </span>
          </div>

          <h3 className="font-semibold text-[#111010] text-[15px] leading-snug line-clamp-2 mb-2 group-hover:text-[#F97316] transition-colors">
            {product.name}
          </h3>

          <p className="text-[#6B6B6B] text-xs leading-relaxed line-clamp-2 mb-4">
            {product.description}
          </p>

          <div className="flex items-end justify-between">
            <div>
              <span className="text-xl font-bold text-[#111010]">₹{displayPrice.toLocaleString('en-IN')}</span>
              {hasDiscount && (
                <span className="ml-2 text-xs text-[#9A9A96] line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-[#111010] border border-[#ECECEA] px-3 py-1.5 rounded-lg group-hover:bg-[#111010] group-hover:text-white group-hover:border-[#111010] transition-all">
              View →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-[#ECECEA] animate-pulse">
    <div className="h-52 bg-[#F0F0EE]" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-1/3 bg-[#ECECEA] rounded-full" />
      <div className="h-4 w-4/5 bg-[#ECECEA] rounded-full" />
      <div className="h-3 w-full bg-[#ECECEA] rounded-full" />
      <div className="h-3 w-2/3 bg-[#ECECEA] rounded-full" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 w-1/4 bg-[#ECECEA] rounded-full" />
        <div className="h-7 w-16 bg-[#ECECEA] rounded-lg" />
      </div>
    </div>
  </div>
);

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

type FilterSidebarProps = {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  onReset: () => void;
  activeCount: number;
};

const FilterSidebar = ({
  categories,
  selectedCategories,
  toggleCategory,
  priceRange,
  setPriceRange,
  inStockOnly,
  setInStockOnly,
  onReset,
  activeCount,
}: FilterSidebarProps) => {
  const [catOpen, setCatOpen] = React.useState(true);
  const [priceOpen, setPriceOpen] = React.useState(true);

  return (
    <aside className="w-full lg:w-[240px] shrink-0">
      <div className="bg-white border border-[#ECECEA] rounded-2xl p-5 sticky top-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FilterIcon />
            <span className="font-semibold text-[#111010] text-sm">Filters</span>
            {activeCount > 0 && (
              <span className="text-[11px] font-bold bg-[#F97316] text-white w-5 h-5 rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button onClick={onReset} className="text-[11px] text-[#6B6B6B] hover:text-[#F97316] transition-colors font-medium">
              Reset all
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-[#F0F0EE] mb-5" />

        {/* In stock toggle */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm text-[#111010] font-medium">In stock only</span>
          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`w-10 h-5 rounded-full transition-colors relative ${inStockOnly ? 'bg-[#F97316]' : 'bg-[#DDDDD9]'}`}
            aria-checked={inStockOnly}
            role="switch"
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${inStockOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        <div className="h-px bg-[#F0F0EE] mb-5" />

        {/* Price range */}
        <div className="mb-5">
          <button
            onClick={() => setPriceOpen(!priceOpen)}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-sm font-semibold text-[#111010]">Price range</span>
            <span className={`transition-transform ${priceOpen ? 'rotate-180' : ''}`}><ChevronDown /></span>
          </button>

          {priceOpen && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[11px] text-[#9A9A96] font-medium mb-1 block">Min ₹</label>
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full border border-[#ECECEA] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F97316] transition-colors"
                    min={0}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-[#9A9A96] font-medium mb-1 block">Max ₹</label>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full border border-[#ECECEA] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F97316] transition-colors"
                    min={0}
                  />
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {[[0, 500], [500, 2000], [2000, 10000]].map(([min, max]) => (
                  <button
                    key={`${min}-${max}`}
                    onClick={() => setPriceRange([min, max])}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                      priceRange[0] === min && priceRange[1] === max
                        ? 'bg-[#F97316] text-white border-[#F97316]'
                        : 'border-[#ECECEA] text-[#6B6B6B] hover:border-[#F97316] hover:text-[#F97316]'
                    }`}
                  >
                    ₹{min}–₹{max === 10000 ? '10k+' : max}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-[#F0F0EE] mb-5" />

        {/* Categories */}
        <div>
          <button
            onClick={() => setCatOpen(!catOpen)}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-sm font-semibold text-[#111010]">Categories</span>
            <span className={`transition-transform ${catOpen ? 'rotate-180' : ''}`}><ChevronDown /></span>
          </button>

          {catOpen && (
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1 custom-scroll">
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
                      active
                        ? 'bg-[#F97316]/10 text-[#F97316] font-medium'
                        : 'text-[#6B6B6B] hover:bg-[#F4F4F2] hover:text-[#111010]'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      active ? 'bg-[#F97316] border-[#F97316]' : 'border-[#DDDDD9]'
                    }`}>
                      {active && (
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="white">
                          <polyline points="1.5 5 4 7.5 8.5 2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className="capitalize">{cat}</span>
                  </button>
                );
              })}
              {categories.length === 0 && (
                <p className="text-xs text-[#9A9A96] px-3">No categories found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const Page = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 99999]);
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<SortOption>('newest');
  const [page, setPage] = React.useState(1);
  const [showSearch, setShowSearch] = React.useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const limit = 20;


  const searchParams = useSearchParams();

const initialCategory = searchParams.get('category');

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);


  React.useEffect(() => {
  if (initialCategory) {
    setSelectedCategories([initialCategory]);
  }
}, [initialCategory]);

  // Reset page on filter change
  React.useEffect(() => {
    setPage(1);
  }, [selectedCategories, priceRange, inStockOnly, sortBy, debouncedSearch]);

 const { data, isLoading } = useQuery({
  queryKey: [
    'products',
    page,
    selectedCategories,
    priceRange,
    inStockOnly,
    sortBy,
    debouncedSearch,
  ],

  queryFn: async () => {
    const response = await axiosInstance.get(
      '/products/get-all',
      {
        params: {
          page,
          limit,

          search: debouncedSearch,

          categories:
            selectedCategories.length > 0
              ? selectedCategories.join(',')
              : undefined,

          minPrice: priceRange[0],
          maxPrice: priceRange[1],

          inStock: inStockOnly,

          sortBy,
        },
      }
    );

    return response.data;
  },
});

const products = data?.products ?? [];

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get('/products/get-categories');
      return response.data;
    },
  });

  const { data: suggestions = [] } = useQuery({
    queryKey: ['search-suggestions', debouncedSearch],
    enabled: debouncedSearch.trim().length > 0,
    queryFn: async () => {
      const response = await axiosInstance.get('/products/search-suggestions', {
        params: { search: debouncedSearch, limit: 6 },
      });
      return response.data.products;
    },
  });
  
  const meta = data?.meta || null;
  const categories: string[] = categoriesQuery.data?.categories || [];

  // Client-side filter + sort
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 99999]);
    setInStockOnly(false);
    setSortBy('newest');
  };

  const activeFilterCount =
    selectedCategories.length +
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 99999 ? 1 : 0);



  return (
    <PageShell>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #DDDDD9; border-radius: 99px; }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="py-10">
        <div className="rounded-3xl bg-[#111010] px-10 py-12 md:py-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[5px] text-[#F97316] mb-4 font-semibold">
              Modern Marketplace
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Discover<br />
              <span className="text-[#F97316]">Amazing</span> Products
            </h1>
            <p className="text-[#9A9A96] mt-4 text-base max-w-sm">
              Thousands of products from trusted sellers, curated just for you.
            </p>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{meta?.total ?? '—'}</p>
              <p className="text-xs text-[#6B6B6B] mt-1">Products</p>
            </div>
            <div className="w-px bg-[#F97316]" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{categories.length || '—'}</p>
              <p className="text-xs text-[#6B6B6B] mt-1">Categories</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Body: Sidebar + Grid ──────────────────────────────────────────── */}
      <section className="pb-16">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#111010]">Latest Products</h2>
            <p className="text-[#9A9A96] text-sm mt-0.5">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <div className={`flex items-center border rounded-xl transition-all duration-200 bg-white overflow-hidden ${showSearch ? 'border-[#F97316] w-64' : 'border-[#ECECEA] w-10'}`}>
                <button
                  onClick={() => {
                    setShowSearch((v) => !v);
                    setTimeout(() => searchRef.current?.focus(), 50);
                  }}
                  className="w-10 h-10 flex items-center justify-center text-[#6B6B6B] hover:text-[#F97316] shrink-0 transition-colors"
                >
                  <SearchIcon />
                </button>
                {showSearch && (
                  <>
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products…"
                      className="flex-1 bg-transparent text-sm py-2 pr-2 outline-none text-[#111010] placeholder-[#BBBBB8]"
                    />
                    {searchTerm && (
                      <button onClick={() => { setSearchTerm(''); setDebouncedSearch(''); }} className="pr-2 text-[#BBBBB8] hover:text-[#F97316]">
                        <XIcon />
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Suggestions dropdown */}
              {debouncedSearch && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#ECECEA] rounded-xl shadow-xl z-50 overflow-hidden">
                  {suggestions.map((item: Product) => (
                    <Link
                      key={item.id}
                      href={`/products/${item.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#FFF7F2] text-sm text-[#111010] group"
                    >
                      <span className="text-xl">📦</span>
                      <div>
                        <p className="font-medium group-hover:text-[#F97316] transition-colors">{item.name}</p>
                        <p className="text-xs text-[#9A9A96]">{item.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="border border-[#ECECEA] rounded-xl px-3 py-2 text-sm bg-white text-[#111010] outline-none focus:border-[#F97316] transition-colors cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name A–Z</option>
            </select>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen((v) => !v)}
              className="lg:hidden flex items-center gap-2 border border-[#ECECEA] rounded-xl px-3 py-2 text-sm bg-white text-[#111010] hover:border-[#F97316] transition-colors"
            >
              <FilterIcon />
              Filters
              {activeFilterCount > 0 && (
                <span className="text-[11px] font-bold bg-[#F97316] text-white w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {selectedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-1.5 bg-[#F97316]/10 text-[#F97316] text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#F97316]/20 transition-colors"
              >
                {cat} <XIcon />
              </button>
            ))}
            {inStockOnly && (
              <button
                onClick={() => setInStockOnly(false)}
                className="flex items-center gap-1.5 bg-[#F97316]/10 text-[#F97316] text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#F97316]/20 transition-colors"
              >
                In stock <XIcon />
              </button>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 99999) && (
              <button
                onClick={() => setPriceRange([0, 99999])}
                className="flex items-center gap-1.5 bg-[#F97316]/10 text-[#F97316] text-xs font-medium px-3 py-1.5 rounded-full hover:bg-[#F97316]/20 transition-colors"
              >
                ₹{priceRange[0]}–₹{priceRange[1]} <XIcon />
              </button>
            )}
            <button onClick={resetFilters} className="text-xs text-[#9A9A96] hover:text-[#F97316] px-2 py-1.5 transition-colors">
              Clear all
            </button>
          </div>
        )}

        {/* Layout: sidebar + content */}
        <div className="flex gap-6 items-start">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              onReset={resetFilters}
              activeCount={activeFilterCount}
            />
          </div>

          {/* Mobile sidebar drawer */}
          {mobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
              <div className="relative ml-auto w-72 bg-[#FAFAF8] h-full overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-bold text-[#111010]">Filters</span>
                  <button onClick={() => setMobileFiltersOpen(false)} className="text-[#6B6B6B] hover:text-[#F97316]">
                    <XIcon />
                  </button>
                </div>
                <FilterSidebar
                  categories={categories}
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  inStockOnly={inStockOnly}
                  setInStockOnly={setInStockOnly}
                  onReset={resetFilters}
                  activeCount={activeFilterCount}
                />
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : data && products.length === 0 ? ( 
              <div>
                <div className="py-20 text-center rounded-2xl bg-white border border-[#ECECEA]">
                  <p className="text-4xl mb-3">🔍</p>
                  <h3 className="text-lg font-semibold text-[#111010]">No products found</h3>
                  <p className="text-sm text-[#9A9A96] mt-1">Try adjusting your filters or search term.</p>
                  {activeFilterCount > 0 && (
                    <button onClick={resetFilters} className="mt-4 text-sm text-[#F97316] font-medium hover:underline">
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center rounded-2xl bg-white border border-[#ECECEA]">
                <p className="text-4xl mb-3">🔍</p>
                <h3 className="text-lg font-semibold text-[#111010]">No products found</h3>
                <p className="text-sm text-[#9A9A96] mt-1">Try adjusting your filters or search term.</p>
                {activeFilterCount > 0 && (
                  <button onClick={resetFilters} className="mt-4 text-sm text-[#F97316] font-medium hover:underline">
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta && !isLoading && products.length > 0 && (
              <div className="flex items-center justify-between mt-8">
                <p className="text-sm text-[#9A9A96]">
                  Page {meta.page} of {meta.totalPages} · {meta.total} total
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!meta.hasPrev}
                    className="px-4 py-2 rounded-xl border border-[#ECECEA] text-sm text-[#111010] disabled:opacity-40 hover:border-[#F97316] hover:text-[#F97316] transition-colors disabled:hover:border-[#ECECEA] disabled:hover:text-[#111010]"
                  >
                    ← Prev
                  </button>

                  {/* Page number pills */}
                  {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                          page === p
                            ? 'bg-[#F97316] text-white'
                            : 'border border-[#ECECEA] text-[#6B6B6B] hover:border-[#F97316] hover:text-[#F97316]'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!meta.hasNext}
                    className="px-4 py-2 rounded-xl border border-[#ECECEA] text-sm text-[#111010] disabled:opacity-40 hover:border-[#F97316] hover:text-[#F97316] transition-colors disabled:hover:border-[#ECECEA] disabled:hover:text-[#111010]"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default function main() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Page />
        </Suspense>
    );
}

