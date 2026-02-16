<<<<<<< HEAD
import React, { useEffect, useState, useCallback } from "react";
import api from "@/utils/Api"; // Using your standard API wrapper
=======
import React, { useEffect, useMemo, useState } from "react";
>>>>>>> 2a840bcb2df3f5d97552e0cf9d22c71bb6392309
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

const GoogleData = () => {
  const [loading, setLoading] = useState(true);
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
<<<<<<< HEAD
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: limit,
        search: search,
        city: citySearch,
      });

      // Using the api utility instead of hardcoded fetch
      // Note: We used url_prefix='/api' in app.py, so we include it here
      const response = await api.get(`/google-listings?${queryParams}`);
      const result = response.data;

      setPageData(result.data || []);
      setTotalPages(result.total_pages || 1);
      setTotalRecords(result.total_count || 0);
    } catch (err) {
      console.error("Fetch Error:", err);
      // Standardized error handling from your AtmData example
      if (err.code === "ERR_NETWORK") {
        setError("Backend offline. Check Docker logs or Network.");
      } else {
        setError("Failed to fetch Google data.");
      }
    } finally {
=======
    setTimeout(() => {
      setFullData(listingData);
      setTotal(listingData.length);
>>>>>>> 2a840bcb2df3f5d97552e0cf9d22c71bb6392309
      setLoading(false);
    }, 300);
  }, []);

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

<<<<<<< HEAD
  const exportToExcel = () => {
    if (!pageData.length) return;
    const ws = XLSX.utils.json_to_sheet(pageData);
=======
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
>>>>>>> 2a840bcb2df3f5d97552e0cf9d22c71bb6392309
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Listings");
    XLSX.writeFile(wb, currentOnly ? "listing_page.xlsx" : "listing_all.xlsx");
  };

  return (
    <div className="min-h-screen mt-8 mb-12 px-4 rounded bg-white text-black">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" className="pb-2">
          Google Data
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

<<<<<<< HEAD
      <Card className="h-full w-full border border-blue-gray-100">
        <CardHeader floated={false} shadow={false} className="rounded-none p-4 bg-blue-gray-50/50">
          <div className="flex flex-wrap items-center justify-between gap-y-4">
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <div className="w-72">
                <Input 
                  label="Search Business Name" 
                  value={search} 
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1); // Reset page on search
                  }} 
                />
              </div>
              <div className="w-48">
                <Input 
                  label="Filter by City" 
                  value={citySearch} 
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    setCurrentPage(1); // Reset page on filter
                  }} 
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Typography variant="small" className="font-bold text-blue-gray-700">
                Page {currentPage} of {totalPages}
              </Typography>
              <div className="flex gap-2">
                <Button 
                  variant="outlined" 
                  size="sm" 
                  disabled={currentPage === 1 || loading} 
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Previous
                </Button>
                <Button 
                  variant="outlined" 
                  size="sm" 
                  disabled={currentPage === totalPages || loading} 
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
=======
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
>>>>>>> 2a840bcb2df3f5d97552e0cf9d22c71bb6392309
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

export default GoogleData;
