"use client";

import {
  ArrowDownUp,
  Check,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
} from "react";

type Props = {
  totalProducts: number;
};

const SORT_OPTIONS = [
  {
    value: "newest",
    label: "الأحدث أولاً",
  },
  {
    value: "oldest",
    label: "الأقدم أولاً",
  },
  {
    value: "price_asc",
    label: "السعر: الأقل أولاً",
  },
  {
    value: "price_desc",
    label: "السعر: الأعلى أولاً",
  },
  {
    value: "stock_asc",
    label: "المخزون: الأقل أولاً",
  },
  {
    value: "stock_desc",
    label: "المخزون: الأعلى أولاً",
  },
] as const;

export default function ProductsToolbar({
  totalProducts,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch =
    searchParams.get("search") ?? "";

  const currentSort =
    searchParams.get("sort") ?? "newest";

  const searchInputRef =
    useRef<HTMLInputElement>(null);

  const searchDebounceRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  /* =========================================================
     SYNC URL SEARCH -> INPUT DOM
     ---------------------------------------------------------
     We intentionally do not keep a duplicated React state
     for the search field. The URL is the source of truth,
     while the input is synchronized directly through its ref.
  ========================================================= */

  useEffect(() => {
    const input =
      searchInputRef.current;

    if (!input) {
      return;
    }

    if (
      input.value !==
      currentSearch
    ) {
      input.value =
        currentSearch;
    }
  }, [currentSearch]);

  /* =========================================================
     CLEAN DEBOUNCE TIMER
  ========================================================= */

  useEffect(() => {
    return () => {
      if (
        searchDebounceRef.current
      ) {
        clearTimeout(
          searchDebounceRef.current,
        );

        searchDebounceRef.current =
          null;
      }
    };
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  function updateSearch(
    value: string,
  ) {
    if (
      searchDebounceRef.current
    ) {
      clearTimeout(
        searchDebounceRef.current,
      );
    }

    const normalizedSearch =
      value.trim();

    if (
      normalizedSearch ===
      currentSearch.trim()
    ) {
      return;
    }

    searchDebounceRef.current =
      setTimeout(() => {
        const params =
          new URLSearchParams(
            searchParams.toString(),
          );

        if (
          normalizedSearch
        ) {
          params.set(
            "search",
            normalizedSearch,
          );
        } else {
          params.delete(
            "search",
          );
        }

        params.set(
          "page",
          "1",
        );

        router.replace(
          `${pathname}?${params.toString()}`,
          {
            scroll: false,
          },
        );
      }, 350);
  }

  /* =========================================================
     SORT
  ========================================================= */

  function changeSort(
    value: string,
  ) {
    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    params.set(
      "sort",
      value,
    );

    params.set(
      "page",
      "1",
    );

    router.replace(
      `${pathname}?${params.toString()}`,
      {
        scroll: false,
      },
    );
  }

  /* =========================================================
     CLEAR SEARCH
  ========================================================= */

  function clearSearch() {
    if (
      searchDebounceRef.current
    ) {
      clearTimeout(
        searchDebounceRef.current,
      );

      searchDebounceRef.current =
        null;
    }

    const input =
      searchInputRef.current;

    if (input) {
      input.value = "";
    }

    const params =
      new URLSearchParams(
        searchParams.toString(),
      );

    params.delete(
      "search",
    );

    params.set(
      "page",
      "1",
    );

    router.replace(
      `${pathname}?${params.toString()}`,
      {
        scroll: false,
      },
    );
  }

  /* =========================================================
     SORT LABEL
  ========================================================= */

  const selectedSortLabel =
    useMemo(() => {
      return (
        SORT_OPTIONS.find(
          (option) =>
            option.value ===
            currentSort,
        )?.label ??
        "الأحدث أولاً"
      );
    }, [currentSort]);

  return (
    <section
      dir="rtl"
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-[#d8d0c2]
        bg-[#11110f]
        px-4
        py-4
        shadow-[0_20px_60px_rgba(20,18,14,0.10)]
        sm:px-5
        sm:py-5
      "
    >
      {/* =====================================================
          AMBIENT ATMOSPHERE
      ====================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-24
          h-48
          w-48
          rounded-full
          bg-[#C9A227]/10
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-0
          left-1/3
          h-px
          w-1/2
          bg-gradient-to-r
          from-transparent
          via-[#C9A227]/30
          to-transparent
        "
      />

      <div className="relative">
        {/* ===================================================
            HEADING
        ==================================================== */}

        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#C9A227]
                  shadow-[0_0_12px_rgba(201,162,39,0.65)]
                "
              />

              <span
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.28em]
                  text-[#C9A227]
                "
              >
                Collection Control
              </span>
            </div>

            <h2
              className="
                text-lg
                font-semibold
                tracking-[-0.02em]
                text-[#F7F5F0]
                sm:text-xl
              "
            >
              The Collection
            </h2>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-[#8e8a82]
                sm:text-sm
              "
            >
              ابحث ورتّب مجموعة الساعات الحالية.
            </p>
          </div>

          {/* =================================================
              PRODUCT COUNT
          ================================================= */}

          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-3
              rounded-full
              border
              border-[#C9A227]/20
              bg-[#181815]
              px-4
              py-2.5
            "
          >
            <span
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#77736b]
              "
            >
              Pieces
            </span>

            <span
              aria-hidden="true"
              className="
                h-3
                w-px
                bg-[#2e2d29]
              "
            />

            <span
              className="
                font-serif
                text-lg
                leading-none
                text-[#F7F5F0]
              "
            >
              {totalProducts}
            </span>
          </div>
        </div>

        {/* ===================================================
            CONTROLS
        ==================================================== */}

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="relative">
            <label
              htmlFor="products-search"
              className="sr-only"
            >
              البحث عن منتج
            </label>

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-[#2b2a26]
                bg-[#181815]
                transition-all
                duration-300
                focus-within:border-[#C9A227]/65
                focus-within:shadow-[0_0_0_4px_rgba(201,162,39,0.06),0_12px_40px_rgba(0,0,0,0.18)]
              "
            >
              {/* Hover / focus sweep */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  right-0
                  w-24
                  bg-gradient-to-l
                  from-[#C9A227]/[0.06]
                  to-transparent
                  opacity-0
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                  group-focus-within:opacity-100
                "
              />

              {/* Search icon */}

              <Search
                size={18}
                strokeWidth={1.7}
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-[#77736b]
                  transition-colors
                  duration-300
                  group-focus-within:text-[#C9A227]
                "
              />

              {/* Search input */}

              <input
                ref={
                  searchInputRef
                }
                id="products-search"
                type="search"
                defaultValue={
                  currentSearch
                }
                onChange={(event) =>
                  updateSearch(
                    event.target
                      .value,
                  )
                }
                placeholder="ابحث باسم المنتج..."
                autoComplete="off"
                spellCheck={false}
                className="
                  relative
                  z-[1]
                  h-14
                  w-full
                  bg-transparent
                  pl-12
                  pr-12
                  text-sm
                  font-medium
                  text-[#F7F5F0]
                  outline-none
                  placeholder:text-[#66635d]
                  sm:text-[15px]
                "
              />

              {/* Clear button */}

              {currentSearch.trim() ? (
                <button
                  type="button"
                  onClick={
                    clearSearch
                  }
                  aria-label="مسح البحث"
                  className="
                    absolute
                    left-3
                    top-1/2
                    z-10
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#302f2a]
                    bg-[#20201c]
                    text-[#89857d]
                    transition-all
                    duration-200
                    hover:border-[#C9A227]/40
                    hover:bg-[#27261f]
                    hover:text-[#C9A227]
                    active:scale-95
                  "
                >
                  <X
                    size={14}
                    strokeWidth={2}
                  />
                </button>
              ) : null}
            </div>
          </div>

          {/* =================================================
              SORT
          ================================================= */}

          <div className="relative min-w-0 lg:w-[270px]">
            <label
              htmlFor="products-sort"
              className="sr-only"
            >
              ترتيب المنتجات
            </label>

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-[#2b2a26]
                bg-[#181815]
                transition-all
                duration-300
                focus-within:border-[#C9A227]/65
                focus-within:shadow-[0_0_0_4px_rgba(201,162,39,0.06),0_12px_40px_rgba(0,0,0,0.18)]
              "
            >
              {/* Sort icon */}

              <ArrowDownUp
                size={17}
                strokeWidth={1.7}
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-1/2
                  z-10
                  -translate-y-1/2
                  text-[#77736b]
                  transition-colors
                  duration-300
                  group-focus-within:text-[#C9A227]
                "
              />

              {/* Desktop sort indicator */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  z-10
                  hidden
                  -translate-y-1/2
                  items-center
                  gap-1.5
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-[#5e5b55]
                  sm:flex
                "
              >
                <SlidersHorizontal
                  size={12}
                  strokeWidth={1.8}
                />

                <span>
                  Sort
                </span>
              </div>

              <select
                id="products-sort"
                value={
                  currentSort
                }
                onChange={(event) =>
                  changeSort(
                    event.target
                      .value,
                  )
                }
                className="
                  relative
                  z-[1]
                  h-14
                  w-full
                  cursor-pointer
                  appearance-none
                  bg-transparent
                  pl-12
                  pr-12
                  text-sm
                  font-semibold
                  text-[#EAE6DD]
                  outline-none
                "
              >
                {SORT_OPTIONS.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                      className="
                        bg-[#181815]
                        text-[#F7F5F0]
                      "
                    >
                      {
                        option.label
                      }
                    </option>
                  ),
                )}
              </select>

              {/* Selected indicator */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  bottom-2
                  left-4
                  right-4
                  h-px
                  overflow-hidden
                  bg-[#292823]
                "
              >
                <div className="h-full w-1/3 bg-[#C9A227]/70" />
              </div>
            </div>

            {/* Current sort label */}

            <div
              className="
                mt-1.5
                hidden
                items-center
                gap-1.5
                px-1
                text-[10px]
                text-[#6f6b64]
                sm:flex
              "
            >
              <Check
                size={11}
                strokeWidth={2}
                className="text-[#C9A227]"
              />

              <span>
                {selectedSortLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}