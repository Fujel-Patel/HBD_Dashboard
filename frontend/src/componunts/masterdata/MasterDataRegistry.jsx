import React, { useState, useEffect, useCallback } from 'react';
import api from '../../utils/Api';
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
  ChevronUpDownIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/solid";
import * as XLSX from "xlsx/dist/xlsx.full.min.js";

// Defined widths so the 36 columns scroll beautifully
const masterColumns = [
  { key: "global_business_id", label: "Global ID", width: 150 },
  { key: "business_id", label: "Business ID", width: 150 },
  { key: "business_name", label: "Business Name", width: 250 },
  { key: "business_category", label: "Category", width: 180 },
  { key: "business_subcategory", label: "Subcategory", width: 180 },
  { key: "ratings", label: "Ratings", width: 100 },
  { key: "reviews", label: "Reviews", width: 100 },
  { key: "primary_phone", label: "Primary Phone", width: 150 },
  { key: "secondary_phone", label: "Secondary Phone", width: 150 },
  { key: "other_phones", label: "Other Phones", width: 150 },
  { key: "virtual_phone", label: "Virtual Phone", width: 150 },
  { key: "whatsapp_phone", label: "WhatsApp", width: 150 },
  { key: "email", label: "Email", width: 200 },
  { key: "website_url", label: "Website", width: 150, isLink: true },
  { key: "facebook_url", label: "Facebook", width: 150, isLink: true },
  { key: "linkedin_url", label: "LinkedIn", width: 150, isLink: true },
  { key: "twitter_url", label: "Twitter", width: 150, isLink: true },
  { key: "address", label: "Address", width: 350 },
  { key: "area", label: "Area", width: 150 },
  { key: "city", label: "City", width: 150 },
  { key: "state", label: "State", width: 150 },
  { key: "pincode", label: "Pincode", width: 120 },
  { key: "country", label: "Country", width: 120 },
  { key: "latitude", label: "Latitude", width: 120 },
  { key: "longitude", label: "Longitude", width: 120 },
  { key: "avg_fees", label: "Avg Fees", width: 120 },
  { key: "course_details", label: "Course Details", width: 200 },
  { key: "duration", label: "Duration", width: 120 },
  { key: "requirement", label: "Requirement", width: 150 },
  { key: "avg_spent", label: "Avg Spent", width: 120 },
  { key: "cost_for_two", label: "Cost for Two", width: 120 },
  { key: "description", label: "Description", width: 300 },
  { key: "data_source", label: "Data Source", width: 150 },
  { key: "avg_salary", label: "Avg Salary", width: 120 },
  { key: "admission_req_list", label: "Admission Req", width: 200 },
  { key: "courses", label: "Courses", width: 200 }
];

const MasterDataRegistry = () => {
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState([]);
  const [error, setError] = useState(null);

  // Pagination & Search States
  const [currentPage, setCurrentPage] = useState(1);
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursors, setPrevCursors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  
  const [search, setSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const limit = 10;

  const fetchData = useCallback(async (cursor = null, direction = 'next') => {
    setLoading(true);
    setError(null);

    const params = { 
      limit,
      search,
      city: citySearch
    };
    if (cursor) params.cursor = cursor;

    try {
      // Fetching from the fixed API route
      const response = await api.get(`/master_table/list`, { params });
      const result = response.data;

      setPageData(result.data || []);
      setNextCursor(result.next_cursor || null);
      
      // If backend provides total counts, calculate pages. Otherwise just show current.
      const total = result.total_count || result.total_records || 0;
      setTotalRecords(total);
      setTotalPages(total > 0 ? Math.ceil(total / limit) : (result.next_cursor ? currentPage + 1 : currentPage));

      if (direction === 'next' && cursor) {
        setPrevCursors(prev => [...prev, cursor]);
        setCurrentPage(prev => prev + 1);
      } else if (direction === 'prev') {
        setCurrentPage(prev => (prev > 1 ? prev - 1 : 1));
      } else if (direction === 'init') {
        setCurrentPage(1);
        setPrevCursors([]);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Failed to fetch Master Data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, citySearch, currentPage]);

  // Initial Load
  useEffect(() => {
    fetchData(null, 'init');
    // eslint-disable-next-line
  }, [search, citySearch]);

  const exportToExcel = () => {
    if (!pageData.length) return;
    const ws = XLSX.utils.json_to_sheet(pageData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Master_Data");
    XLSX.writeFile(wb, `Master_Registry_Page_${currentPage}.xlsx`);
  };

  return (
    <div className="min-h-screen mt-8 mb-12 px-4 rounded bg-white text-black">
      <div className="flex justify-between items-end mb-6">
        <div>
          <Typography variant="h4" className="font-bold text-blue-gray-900">
            Complete Master Registry
          </Typography>
          <Typography variant="small" className="font-medium text-gray-500">
            {error ? (
              <span className="text-red-500 font-bold">{error}</span>
            ) : (
              `Displaying consolidated records from all sources ${totalRecords > 0 ? `(${totalRecords.toLocaleString()} total)` : ''}`
            )}
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="gradient" 
            color="green" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={exportToExcel}
          >
            <ArrowDownTrayIcon className="h-4 w-4" /> Export Page
          </Button>
          <Button 
            variant="outlined" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => fetchData(null, 'init')}
          >
            <ArrowPathIcon className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      <Card className="h-full w-full border border-blue-gray-100">
        <CardHeader floated={false} shadow={false} className="rounded-none p-4 bg-blue-gray-50/50">
          <div className="flex flex-wrap items-center justify-between gap-y-4">
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <div className="w-72">
                <Input 
                  label="Search Business Name" 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                />
              </div>
              <div className="w-48">
                <Input 
                  label="Filter by City" 
                  value={citySearch} 
                  onChange={(e) => setCitySearch(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Typography variant="small" className="font-bold text-blue-gray-700">
                Page {currentPage} {totalRecords > 0 ? `of ${totalPages}` : ''}
              </Typography>
              <div className="flex gap-2">
                <Button 
                  variant="outlined" 
                  size="sm" 
                  disabled={currentPage === 1 || loading} 
                  onClick={() => {
                    const prevCursor = prevCursors[prevCursors.length - 2] || null;
                    setPrevCursors(prev => prev.slice(0, -1));
                    fetchData(prevCursor, 'prev');
                  }}
                >
                  Previous
                </Button>
                <Button 
                  variant="outlined" 
                  size="sm" 
                  disabled={(!nextCursor && pageData.length < limit) || loading} 
                  onClick={() => fetchData(nextCursor, 'next')}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-auto p-0">
          {loading ? (
            <div className="flex flex-col justify-center py-24 items-center gap-4">
              <Spinner className="h-10 w-10 text-blue-500" />
              <Typography className="animate-pulse font-medium text-gray-600">
                Fetching massive dataset...
              </Typography>
            </div>
          ) : (
            <table className="w-full min-w-[3000px] table-fixed text-left">
              <thead>
                <tr>
                  {masterColumns.map((col) => (
                    <th
                      key={col.key}
                      style={{ width: col.width }}
                      className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-bold leading-none opacity-70"
                      >
                        {col.label} <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.length > 0 ? (
                  pageData.map((row, index) => (
                    <tr key={index} className="even:bg-blue-gray-50/50 hover:bg-blue-50 transition-colors">
                      {masterColumns.map((col) => (
                        <td key={col.key} className="p-4 border-b border-blue-gray-50">
                          <Typography variant="small" color="blue-gray" className="font-normal break-words">
                            {col.isLink && row[col.key] ? (
                              <a href={row[col.key]} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                                Link
                              </a>
                            ) : (
                              row[col.key] || "-"
                            )}
                          </Typography>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={masterColumns.length} className="p-20 text-center">
                      <Typography variant="h6" color="blue-gray" className="opacity-40 italic">
                        {error || "No master records found."}
                      </Typography>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default MasterDataRegistry;