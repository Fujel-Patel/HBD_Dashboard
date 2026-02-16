<<<<<<< HEAD
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Button, Card, CardBody, CardHeader, Typography, Input, Spinner, Chip,
  Tabs, TabsHeader, Tab,
} from "@material-tailwind/react";
import {
  ArrowPathIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, FunnelIcon,
  BuildingOfficeIcon, Square3Stack3DIcon, CheckBadgeIcon, TrophyIcon
} from "@heroicons/react/24/solid";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx/dist/xlsx.full.min.js";
import api from "@/utils/Api"; 

// --- Helper Functions for Source Badges ---
const getSourceColor = (src) => {
  const lowerSrc = src.toLowerCase();
  if (lowerSrc.includes("google")) return "green";
  if (lowerSrc.includes("justdial")) return "orange";
  if (lowerSrc.includes("bank") || lowerSrc.includes("atm")) return "blue";
  if (lowerSrc.includes("asklaila")) return "red";
  return "gray";
};

// --- Table Column Definitions ---
const standardColumns = [
  { key: "business_name", label: "Store / Business Name", width: "w-4/12" },
  { key: "category", label: "Service / Category", width: "w-3/12" },
  { key: "total_listings", label: "Total Listings", width: "w-2/12", align: "text-center" },
  { key: "sources", label: "Found On Sources", width: "w-3/12" },
];

const categoryColumns = [
     { key: "category_name", label: "Category Name", width: "w-1/2" },
     { key: "business_count", label: "Unique Businesses", width: "w-1/4", align: "text-center" },
     { key: "avg_sources", label: "Avg. Sources per Business", width: "w-1/4", align: "text-center" },
];
=======
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
  Input,
  Spinner,
} from "@material-tailwind/react";

import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

import { listingData } from "@/data/listingJSON";
import * as XLSX from "xlsx/dist/xlsx.full.min.js";
// import api from "@/api/api.jsx"; // your axios instance; used only when SERVER_PAGINATION = true
// import * as XLSX from "xlsx/dist/xlsx.full.min.js";

const defaultColumns = [
  { key: "name", label: "Name", width: 220 },
  { key: "address", label: "Address", width: 320 },
  { key: "website", label: "Website", width: 180 },
  { key: "phone_number", label: "Contact", width: 140 },
  { key: "reviews_count", label: "Review Count", width: 120 },
  { key: "reviews_average", label: "Review Avg", width: 120 },
  { key: "category", label: "Category", width: 140 },
  { key: "subcategory", label: "Sub-Category", width: 140 },
  { key: "city", label: "City", width: 140 },
  { key: "state", label: "State", width: 140 },
  { key: "area", label: "Area", width: 140 },
];

// Convert JSON to CSV
const convertToCSV = (arr) => {
  if (!arr?.length) return "";
  const headers = Object.keys(arr[0]);
  const rows = arr.map((r) =>
    headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, "'")}"`).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
};
>>>>>>> 2a840bcb2df3f5d97552e0cf9d22c71bb6392309

const ListingComplete = () => {
  // --- State Management ---
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [rawData, setRawData] = useState([]); 
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("complete");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // --- KPI State ---
  const [kpiStats, setKpiStats] = useState({
    uniqueBusinesses: 0,
    totalAggregated: 0,
    multiSourceVerified: 0,
    dominantSource: "N/A",
  });

  // --- 1. Fetch Data ---
  const fetchCompleteData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/listing-master");
      const data = response.data || [];
      setRawData(data);
      calculateKPIs(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      if (err.response && err.response.status === 401) {
          setError("Session expired. Please log in again.");
      } else {
          setError("Failed to load master data report.");
      }
    } finally {
=======
  const [fullData, setFullData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [search, setSearch] = useState("");
  const [areaSearch, setAreaSearch] = useState("");

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const [columns] = useState(defaultColumns);

  // Load Data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFullData(listingData);
      setTotal(listingData.length);
>>>>>>> 2a840bcb2df3f5d97552e0cf9d22c71bb6392309
      setLoading(false);
    }, 300);
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    fetchCompleteData();
  }, [fetchCompleteData]);

  // --- 2. KPI Calculation Logic ---
  const calculateKPIs = (data) => {
    if (!data.length) return;

    let totalAggregated = 0;
    let multiSourceCount = 0;
    const sourceCounts = {};

    data.forEach((item) => {
      totalAggregated += (item.total_listings || 0);

      const sourceArray = item.sources ? item.sources.split(",") : [];
      if (sourceArray.length >= 2) {
        multiSourceCount++;
      }

      sourceArray.forEach((src) => {
        const cleanSrc = src.trim();
        sourceCounts[cleanSrc] = (sourceCounts[cleanSrc] || 0) + 1;
      });
    });

    let dominantSource = "N/A";
    let maxCount = 0;
    Object.entries(sourceCounts).forEach(([source, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantSource = source;
      }
    });

    setKpiStats({
      uniqueBusinesses: data.length,
      totalAggregated,
      multiSourceVerified: multiSourceCount,
      dominantSource,
    });
=======
  // Filter Data (Safe with Strings)
  const filteredData = useMemo(() => {
    let data = [...fullData];

    const safeValue = (value) => String(value ?? "").toLowerCase();

    if (search) {
      const s = search.toLowerCase();
      data = data.filter((x) => safeValue(x.name).includes(s));
    }

    if (areaSearch) {
      const s = areaSearch.toLowerCase();
      data = data.filter((x) => safeValue(x.category).includes(s));
    }

    return data;
  }, [fullData, search, areaSearch]);

  // Sort Data
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const A = String(a[sortField] ?? "").toLowerCase();
      const B = String(b[sortField] ?? "").toLowerCase();
      if (A === B) return 0;
      return sortOrder === "asc" ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
    });
  }, [filteredData, sortField, sortOrder]);

  // Pagination
  useEffect(() => {
    const start = (currentPage - 1) * limit;
    setPageData(sortedData.slice(start, start + limit));
    setTotal(sortedData.length);
  }, [sortedData, currentPage]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Sorting Handler
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // CSV Download
  const downloadCSV = (currentOnly = false) => {
    const arr = currentOnly ? pageData : fullData;
    const csv = convertToCSV(arr);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = currentOnly ? "listing_page.csv" : "listing_all.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Excel Download
  const downloadExcel = (currentOnly = false) => {
    const arr = currentOnly ? pageData : fullData;
    if (!arr.length) return;

    const ws = XLSX.utils.json_to_sheet(arr);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Listings");
    XLSX.writeFile(wb, currentOnly ? "listing_page.xlsx" : "listing_all.xlsx");
>>>>>>> 2a840bcb2df3f5d97552e0cf9d22c71bb6392309
  };

    // --- 3. Data Processing & Filtering ---
    const processedData = useMemo(() => {
        if (activeTab === "category-breakdown") {
            const categoryMap = new Map();
            rawData.forEach(item => {
                const cat = item.category || "Uncategorized";
                const sourceCount = item.sources ? item.sources.split(",").length : 0;
                
                if (!categoryMap.has(cat)) {
                    categoryMap.set(cat, { count: 0, totalSources: 0 });
                }
                const existing = categoryMap.get(cat);
                categoryMap.set(cat, { 
                    count: existing.count + 1, 
                    totalSources: existing.totalSources + sourceCount 
                });
            });

            const groupedData = Array.from(categoryMap, ([name, stats]) => ({
                category_name: name,
                business_count: stats.count,
                avg_sources: (stats.totalSources / stats.count).toFixed(1)
            }));
             
            return groupedData.filter(item => 
                 item.category_name.toLowerCase().includes(search.toLowerCase())
            );

        } else {
            let filtered = rawData;

            if (activeTab === "highly-verified") {
                filtered = filtered.filter(item => item.sources?.split(",").length >= 3);
            } else if (activeTab === "single-source") {
                 filtered = filtered.filter(item => item.sources?.split(",").length === 1);
            }

            if (search) {
                filtered = filtered.filter(item =>
                    item.business_name?.toLowerCase().includes(search.toLowerCase())
                );
            }
            if (categoryFilter) {
                 filtered = filtered.filter(item =>
                    item.category?.toLowerCase().includes(categoryFilter.toLowerCase())
                 );
            }
            return filtered;
        }
    }, [rawData, activeTab, search, categoryFilter]);


  // --- 4. Export Functionality ---
  const handleExport = () => {
    if (!processedData.length) return;
    const sheetName = activeTab.replace("-", "_").toUpperCase() + "_DATA";
    const ws = XLSX.utils.json_to_sheet(processedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `Listing_Master_Report_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const currentColumns = activeTab === "category-breakdown" ? categoryColumns : standardColumns;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-4">
        <Spinner className="h-12 w-12 text-blue-600" />
        <Typography className="font-medium text-gray-600 animate-pulse">
          Loading Master Data Report...
        </Typography>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50/50 p-6">
      {/* --- Header --- */}
      <div className="mb-6">
        <Typography variant="h4" color="blue-gray" className="font-bold">
          Listing Master Data Report
        </Typography>
        <Typography variant="small" className="text-gray-600 font-normal mt-1">
          Comprehensive overview and analysis of all aggregated business listings.
        </Typography>
      </div>

      {/* --- SECTION 1: KPI Summary Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Total Unique Businesses"
          value={kpiStats.uniqueBusinesses.toLocaleString()}
          icon={<BuildingOfficeIcon className="h-8 w-8 text-blue-500" />}
        />
        <KpiCard
          title="Total Aggregated Listings"
          value={kpiStats.totalAggregated.toLocaleString()}
          icon={<Square3Stack3DIcon className="h-8 w-8 text-indigo-500" />}
        />
        <KpiCard
          title="Multi-Source Verified (2+)"
          value={kpiStats.multiSourceVerified.toLocaleString()}
          icon={<CheckBadgeIcon className="h-8 w-8 text-green-500" />}
        />
         <KpiCard
          title="Most Dominant Source"
          value={kpiStats.dominantSource}
          icon={<TrophyIcon className="h-8 w-8 text-orange-500" />}
          isTextValue
        />
      </div>

      {/* --- SECTION 2: Tabs and Actions --- */}
      <Card className="shadow-sm border border-blue-gray-100 mb-4">
        <CardBody className="p-2 flex flex-col md:flex-row justify-between items-center gap-4">
           <Tabs value={activeTab} className="w-full md:w-auto">
            <TabsHeader className="bg-transparent p-0" indicatorProps={{ className: "bg-blue-500/10 shadow-none !text-blue-500" }}>
              <Tab value="complete" onClick={() => setActiveTab("complete")} className={activeTab === "complete" ? "text-blue-600 font-semibold" : ""}>
                Complete Database
              </Tab>
              <Tab value="highly-verified" onClick={() => setActiveTab("highly-verified")} className={activeTab === "highly-verified" ? "text-blue-600 font-semibold" : ""}>
                Highly Verified (3+)
              </Tab>
              <Tab value="single-source" onClick={() => setActiveTab("single-source")} className={activeTab === "single-source" ? "text-blue-600 font-semibold" : ""}>
                Single Source / Leads
              </Tab>
               <Tab value="category-breakdown" onClick={() => setActiveTab("category-breakdown")} className={activeTab === "category-breakdown" ? "text-blue-600 font-semibold" : ""}>
                Category Breakdown
              </Tab>
            </TabsHeader>
          </Tabs>

          <div className="flex gap-2 shrink-0">
            <Button variant="outlined" size="sm" className="flex items-center gap-2 border-gray-300 text-gray-700" onClick={fetchCompleteData}>
              <ArrowPathIcon className="h-4 w-4" /> Refresh
            </Button>
            <Button variant="gradient" color="blue" size="sm" className="flex items-center gap-2" onClick={handleExport}>
              <ArrowDownTrayIcon className="h-4 w-4" /> Export View
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* --- SECTION 3: Data Table & Filters --- */}
      <Card className="shadow-sm border border-blue-gray-100">
        <CardHeader floated={false} shadow={false} className="rounded-none p-4 bg-white">
           <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="w-full md:w-72">
                <Input
                  label={activeTab === 'category-breakdown' ? "Search Categories" : "Search Business Name"}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              {activeTab !== 'category-breakdown' && (
                  <div className="w-full md:w-64">
                    <Input
                      label="Filter by Category"
                      icon={<FunnelIcon className="h-5 w-5" />}
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    />
                  </div>
              )}
            </div>
            <div className="mt-4 text-sm text-gray-500 font-medium">
                {error ? (
                    <span className="text-red-500">{error}</span>
                ) : (
                    <span>Showing {processedData.length} results based on current filters.</span>
                )}
            </div>
        </CardHeader>

        <CardBody className="overflow-x-auto px-0 pt-0 pb-2">
          <table className="w-full min-w-[1000px] table-fixed text-left">
            <thead>
              <tr>
                {currentColumns.map((col, index) => (
                  <th
                    key={index}
                    className={`border-y border-blue-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-100 ${col.width} ${col.align || 'text-left'}`}
                  >
                    <Typography variant="small" color="blue-gray" className="flex items-center justify-between gap-2 font-bold leading-none opacity-70">
                      {col.label}
                      <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4 cursor-pointer" />
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedData.length > 0 ? (
                processedData.map((row, index) => (
                  <tr key={index} className="even:bg-blue-gray-50/50 hover:bg-gray-50 transition-colors border-b border-blue-gray-50">
                    {activeTab === 'category-breakdown' ? (
                        <>
                            <td className="p-4"><Typography variant="small" color="blue-gray" className="font-bold">{row.category_name}</Typography></td>
                            <td className="p-4 text-center"><Typography variant="small" className="font-medium text-blue-600">{row.business_count}</Typography></td>
                            <td className="p-4 text-center"><Typography variant="small" className="font-medium">{row.avg_sources}</Typography></td>
                        </>
                    ) : (
                        <>
                        <td className="p-4">
                          <Typography variant="small" color="blue-gray" className="font-bold">
                            {row.business_name || "N/A"}
                          </Typography>
                        </td>
                        <td className="p-4">
                          <Typography variant="small" className="font-medium text-gray-700">
                            {row.category || "Uncategorized"}
                          </Typography>
                        </td>
                        <td className="p-4 text-center">
                          <Chip variant="ghost" size="sm" value={`${row.total_listings} records`} className="rounded-full bg-blue-gray-50/50 text-blue-gray-700" />
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {row.sources?.split(",").filter(Boolean).map((src, i) => (
                              <Chip
                                key={i}
                                variant="gradient"
                                size="sm"
                                value={src.trim()}
                                color={getSourceColor(src.trim())}
                                className="rounded-full py-0.5 px-2 text-[10px] font-bold"
                              />
                            ))}
                          </div>
                        </td>
                        </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={currentColumns.length} className="p-16 text-center">
                    <Typography variant="h6" color="blue-gray" className="opacity-50 italic">
                        {error ? "Could not load data." : "No matching records found for this view."}
                    </Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
=======
    <div className="min-h-screen mt-8 mb-12 px-4 rounded bg-white text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" className="pb-2">
          Listing Complete Data
        </Typography>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => downloadCSV(false)} className="bg-gray-800 text-gray-100">
            CSV All
          </Button>
          <Button size="sm" onClick={() => downloadCSV(true)} className="bg-gray-800 text-gray-100">
            CSV Page
          </Button>
          <Button size="sm" onClick={() => downloadExcel(false)} className="bg-gray-800 text-gray-100">
            Excel All
          </Button>
          <Button size="sm" onClick={() => downloadExcel(true)} className="bg-gray-800 text-gray-100">
            Excel Page
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <Card className="bg-white text-black border">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gray-100">
          <div className="flex gap-3 items-center flex-wrap">
            <Input label="Search Name..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Input
              label="Search Category..."
              value={areaSearch}
              onChange={(e) => setAreaSearch(e.target.value)}
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>

          <div className="flex gap-2 items-center">
            <div>Page {currentPage} / {totalPages}</div>
            <Button size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Prev</Button>
            <Button size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</Button>
          </div>
        </CardHeader>

        {/* Table Body */}
        <CardBody className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner className="h-10 w-10" />
            </div>
          ) : (
            <table className="w-full table-fixed border-collapse min-w-[1500px]">
              <thead className="sticky top-0 z-20 border-b bg-gray-200">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} style={{ width: col.width }} className="px-3 py-2 text-left">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleSort(col.key)}>
                        <span className="capitalize text-sm font-semibold">{col.label}</span>

                        {sortField === col.key ? (
                          sortOrder === "asc" ? <ChevronUpDownIcon className="h-4" /> : <ChevronDownIcon className="h-4" />
                        ) : (
                          <ChevronUpDownIcon className="h-4 opacity-40" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {pageData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center p-6">No records found</td>
                  </tr>
                ) : (
                  pageData.map((row, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      {columns.map((col) => (
                        <td key={col.key} style={{ width: col.width }} className="px-3 py-3 break-words text-sm">
                          {String(row[col.key] ?? "-")}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
>>>>>>> 2a840bcb2df3f5d97552e0cf9d22c71bb6392309
        </CardBody>
      </Card>

      {/* Footer Pagination */}
      <div className="mt-4 flex justify-center items-center gap-2">
        <Button size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          First
        </Button>
        <Button size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
          Prev
        </Button>

        <div className="px-3 py-1 border rounded">
          Page {currentPage} / {totalPages}
        </div>

        <Button size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
          Next
        </Button>
        <Button size="sm" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
          Last
        </Button>
      </div>
    </div>
  );
};

<<<<<<< HEAD
// --- Simple Sub-component for KPI Cards ---
const KpiCard = ({ title, value, icon, isTextValue = false }) => (
  <Card className="shadow-sm border border-blue-gray-100">
    <CardBody className="p-4 flex items-center justify-between">
      <div>
        <Typography variant="small" className="font-medium text-gray-600 mb-1">
          {title}
        </Typography>
        <Typography variant="h3" color="blue-gray" className={`font-bold ${isTextValue ? 'text-2xl truncate' : ''}`}>
          {value}
        </Typography>
      </div>
      <div className="p-3 bg-gray-50 rounded-lg">
        {icon}
      </div>
    </CardBody>
  </Card>
);

export default ListingComplete;
=======
export default ListingComplete;
>>>>>>> 2a840bcb2df3f5d97552e0cf9d22c71bb6392309
