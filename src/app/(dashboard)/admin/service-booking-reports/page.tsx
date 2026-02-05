"use client";

import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import { Download, Loader2, Calendar, Filter } from 'lucide-react';
import { DatePicker, Select, ConfigProvider } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { getBookingsForReports, getServiceTypes } from '@/services/serviceCenterService';
import { getServiceLines } from '@/services/serviceCenterService';
import { listBranches } from '@/services/serviceParkService';
import { ServiceCenterBooking } from '@/types/serviceCenter';
import { useCurrentUser } from '@/utils/auth';
import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;

interface Branch {
    id: number;
    name: string;
}

interface ServiceLine {
    id: number;
    name: string;
    type?: string;
}

export default function ServiceBookingReports() {
    const { toast, showToast, hideToast } = useToast();
    const user = useCurrentUser();
    const isAdmin = user?.user_role === 'ADMIN';

    // Filter states
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([dayjs().startOf('month'), dayjs().endOf('month')]);

    const [selectedBranchId, setSelectedBranchId] = useState<number | 'all' | null>(null);
    
    useEffect(() => {

        if (user !== undefined) {
            if (isAdmin && selectedBranchId === null) {
                setSelectedBranchId('all');
            } else if (!isAdmin && selectedBranchId === 'all') {
                setSelectedBranchId(null);
            }
        }
    }, [isAdmin, user, selectedBranchId]);
    const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
    const [selectedLineId, setSelectedLineId] = useState<number | null>(null);

    // Data states
    const [branches, setBranches] = useState<Branch[]>([]);
    const [serviceTypes, setServiceTypes] = useState<string[]>([]);
    const [serviceLines, setServiceLines] = useState<ServiceLine[]>([]);
    const [bookings, setBookings] = useState<ServiceCenterBooking[]>([]);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);

    // Pagination
    const PAGE_SIZE = 20;
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // Fetch initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [branchesData, typesData] = await Promise.all([
                    listBranches(),
                    getServiceTypes()
                ]);
                setBranches(branchesData);
                setServiceTypes(typesData);
            } catch {
                showToast('Failed to load initial data', 'error');
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedBranchId && selectedBranchId !== 'all') {
            const fetchLines = async () => {
                try {
                    const lines = await getServiceLines(selectedBranchId);
                    setServiceLines(lines);
                    setSelectedLineId(null);
                } catch {
                    showToast('Failed to load service lines', 'error');
                }
            };
            fetchLines();
        } else {
            setServiceLines([]);
            setSelectedLineId(null);
        }
    }, [selectedBranchId]);


    const fetchBookings = async (pageOverride?: number) => {
        if (!dateRange[0] || !dateRange[1]) {
            showToast('Please select date range', 'error');
            return;
        }


        if (selectedBranchId === 'all' && !isAdmin) {
            showToast('Admin access required to view all branches. Please select a specific branch.', 'error');
            return;
        }

        const currentPage = pageOverride ?? page;
        if (pageOverride !== undefined) setPage(pageOverride);

        setLoading(true);
        try {
            const startDate = dateRange[0].format('YYYY-MM-DD');
            const endDate = dateRange[1].format('YYYY-MM-DD');

            const { data: list, total: totalCount } = await getBookingsForReports({
                branchId: selectedBranchId === 'all' ? undefined : selectedBranchId ?? undefined,
                startDate,
                endDate,
                lineId: selectedLineId ?? undefined,
                serviceType: selectedServiceType ?? undefined,
                page: currentPage,
                limit: PAGE_SIZE,
            });

            setBookings(list);
            setTotal(totalCount);
            showToast(
                totalCount === 0
                    ? 'No bookings found'
                    : `Showing ${list.length} of ${totalCount} bookings`,
                'success'
            );
        } catch (error: unknown) {
            const errorMessage = (error instanceof Error ? error.message : String(error)) || 'Failed to fetch bookings';
            const errorResponse = (error as { response?: { status?: number } })?.response;
            const lowerMessage = errorMessage.toLowerCase();
            
            // Check for permission/access denied errors
            if (lowerMessage.includes('access denied') || 
                lowerMessage.includes('admin role required') ||
                lowerMessage.includes('permission') ||
                lowerMessage.includes('forbidden') ||
                (errorResponse?.status === 403)) {
              
                if (isAdmin) {
                    showToast(
                        '⚠️ Backend authorization issue: You are logged in as admin but backend denied access. Please check backend authorization logic or contact support.',
                        'error',
                        8000 
                    );
                    console.error('[ServiceBookingReports] Admin user denied access by backend:', {
                        user_role: user?.user_role,
                        errorMessage,
                        status: errorResponse?.status
                    });
                } else {
                    showToast(
                        '⚠️ Admin access required: You need admin role to view bookings from all branches. Please select a specific branch.',
                        'error',
                        6000
                    );
                }
                
                if (branches.length > 0 && selectedBranchId === 'all' && !isAdmin) {
                }
            }

            else if ((lowerMessage.includes('branchid') && 
                 (lowerMessage.includes('required') || 
                  lowerMessage.includes('must be'))) ||
                lowerMessage.includes('not found') ||
                lowerMessage.includes('404') ||
                (errorResponse?.status === 404)) {
                showToast(
                    '⚠️ Backend route needed: Create GET /service-center/bookings/reports endpoint. See docs/BACKEND_SERVICE_BOOKING_REPORTS_API.md',
                    'error',
                    7000 
                );
            } else {
                showToast(errorMessage, 'error');
            }
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all bookings for export (bypasses pagination)
    const fetchAllBookingsForExport = async (): Promise<ServiceCenterBooking[]> => {
        if (!dateRange[0] || !dateRange[1]) {
            throw new Error('Date range is required');
        }


        if (selectedBranchId === 'all' && !isAdmin) {
            throw new Error('Admin access required to export all branches');
        }

        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');
        const allBookings: ServiceCenterBooking[] = [];
        

        const EXPORT_LIMIT = 10000; 
        let currentPage = 1;
        let totalCount = 0;
        let hasMore = true;

        while (hasMore) {
            try {
                const { data: pageBookings, total: pageTotal } = await getBookingsForReports({
                    branchId: selectedBranchId === 'all' ? undefined : selectedBranchId ?? undefined,
                    startDate,
                    endDate,
                    lineId: selectedLineId ?? undefined,
                    serviceType: selectedServiceType ?? undefined,
                    page: currentPage,
                    limit: EXPORT_LIMIT,
                });

                if (currentPage === 1) {
                    totalCount = pageTotal;
                }

                allBookings.push(...pageBookings);

                if (pageBookings.length < EXPORT_LIMIT) {
                    hasMore = false;
                } else if (allBookings.length >= totalCount) {
                    hasMore = false;
                } else {
                    currentPage++;
                }
            } catch (error: unknown) {
                const errorMessage = (error instanceof Error ? error.message : String(error)) || 'Failed to fetch bookings';
                throw new Error(`Error fetching data for export: ${errorMessage}`);
            }
        }

        return allBookings;
    };

    // Export to Excel
    const exportToExcel = async () => {
        if (!dateRange[0] || !dateRange[1]) {
            showToast('Please select date range', 'error');
            return;
        }

        setExporting(true);
        try {
            
            showToast('Fetching all bookings for export... This may take a moment.', 'success', 4000);

            
            const allBookings = await fetchAllBookingsForExport();

            if (allBookings.length === 0) {
                showToast('No data to export', 'error');
                setExporting(false);
                return;
            }

            // Prepare data for Excel
            const excelData = allBookings.map((booking, index) => ({
                'No': index + 1,
                ...(showBranchColumn && { 'Branch': booking.branch_name ?? booking.branch_id ?? '-' }),
                'Date': booking.date,
                'Time Slot': `${booking.start_time} - ${booking.end_time}`,
                'Vehicle Number': booking.vehicle_no || '-',
                'Customer Name': booking.customer_name || '-',
                'Phone Number': booking.phone_number || '-',
                'Email': booking.email || '-',
                'Address': booking.address || '-',
                'Vehicle Model': booking.vehicle_model || '-',
                'Vehicle Make': booking.vehicle_make || '-',
                'Odometer': booking.odometer || '-',
                'Mileage': booking.mileage || '-',
                'Oil Type': booking.oil_type || '-',
                'Service Advisor': booking.service_advisor || '-',
                'Status': booking.status,
                'Service Type': booking.service_type || '-',
                'Line ID': booking.line_id || '-',
            }));

            // Create workbook and worksheet
            const ws = XLSX.utils.json_to_sheet(excelData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Service Bookings');

            // Generate filename with date range
            const startDateStr = dateRange[0].format('YYYY-MM-DD');
            const endDateStr = dateRange[1].format('YYYY-MM-DD');
            const branchName = selectedBranchId === 'all' ? 'all-branches' : (branches.find(b => b.id === selectedBranchId)?.name ?? 'branch');
            const filename = `service-bookings_${branchName}_${startDateStr}_to_${endDateStr}.xlsx`;

            // Download
            XLSX.writeFile(wb, filename);
            showToast(`Excel file downloaded successfully (${allBookings.length} bookings)`, 'success', 5000);
        } catch (error: unknown) {
            const errorMessage = (error instanceof Error ? error.message : String(error)) || 'Failed to export Excel file';
            showToast(errorMessage, 'error', 6000);
            console.error('Error exporting to Excel:', error);
        } finally {
            setExporting(false);
        }
    };

    const selectedBranch = selectedBranchId !== 'all' ? branches.find(b => b.id === selectedBranchId) : null;
    const selectedLine = serviceLines.find(l => l.id === selectedLineId);
    const showBranchColumn = selectedBranchId === 'all';
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
    const to = Math.min(page * PAGE_SIZE, total);

    return (
        <div className="relative w-full min-h-screen bg-[#E6E6E6B2]/70 backdrop-blur-md text-gray-900 montserrat overflow-x-hidden">
            <main className="pt-30 px-16 ml-16 max-w-[1440px] mx-auto flex flex-col gap-8 pb-20">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="font-bold text-[25px] leading-[100%] tracking-normal text-[#1D1D1D] mb-2">
                        Service Booking Reports
                    </h1>
                    <p className="text-[#575757] text-lg">View and download service booking reports in Excel format</p>
                </div>

                {/* Filters Card */}
                <div className="bg-white rounded-[1.25rem] p-6 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter className="w-5 h-5 text-[#DB2727]" />
                        <h2 className="text-lg font-semibold text-[#1D1D1D]">Filters</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-[#575757] mb-2">
                                Date Range
                            </label>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: '#DB2727',
                                    },
                                }}
                            >
                                <RangePicker
                                    value={dateRange[0] && dateRange[1] ? [dateRange[0], dateRange[1]] as [Dayjs, Dayjs] : null}
                                    onChange={(dates) => {
                                        if (dates && dates[0] && dates[1]) {
                                            setDateRange([dates[0], dates[1]]);
                                        } else {
                                            setDateRange([null, null]);
                                        }
                                    }}
                                    format="YYYY-MM-DD"
                                    className="w-full"
                                    style={{ height: '40px' }}
                                />
                            </ConfigProvider>
                        </div>

                        {/* Branch */}
                        <div>
                            <label className="block text-sm font-medium text-[#575757] mb-2">
                                Branch
                            </label>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: '#DB2727',
                                    },
                                }}
                            >
                                <Select<number | 'all'>
                                    placeholder="Select Branch"
                                    value={selectedBranchId}
                                    onChange={setSelectedBranchId}
                                    className="w-full"
                                    style={{ height: '40px' }}
                                    options={[
                                        ...(isAdmin ? [{ value: 'all' as const, label: 'All Branches' }] : []),
                                        ...branches.map(branch => ({
                                            value: branch.id,
                                            label: branch.name
                                        }))
                                    ]}
                                />
                            </ConfigProvider>
                        </div>

                        {/* Service Type */}
                        <div>
                            <label className="block text-sm font-medium text-[#575757] mb-2">
                                Service Type
                            </label>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: '#DB2727',
                                    },
                                }}
                            >
                                <Select
                                    placeholder="All Types"
                                    value={selectedServiceType}
                                    onChange={setSelectedServiceType}
                                    allowClear
                                    className="w-full"
                                    style={{ height: '40px' }}
                                    options={serviceTypes.map(type => ({
                                        value: type,
                                        label: type.charAt(0) + type.slice(1).toLowerCase()
                                    }))}
                                />
                            </ConfigProvider>
                        </div>

                        {/* Service Line */}
                        <div>
                            <label className="block text-sm font-medium text-[#575757] mb-2">
                                Service Line
                            </label>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: '#DB2727',
                                    },
                                }}
                            >
                                <Select
                                    placeholder={selectedBranchId && selectedBranchId !== 'all' ? "All Lines" : "Select a branch to filter by line"}
                                    value={selectedLineId}
                                    onChange={setSelectedLineId}
                                    disabled={!selectedBranchId || selectedBranchId === 'all'}
                                    allowClear
                                    className="w-full"
                                    style={{ height: '40px' }}
                                    options={serviceLines.map(line => ({
                                        value: line.id,
                                        label: line.name
                                    }))}
                                />
                            </ConfigProvider>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => fetchBookings(1)}
                            disabled={loading || !dateRange[0] || !dateRange[1]}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-colors ${loading || !dateRange[0] || !dateRange[1]
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#DB2727] text-white hover:bg-[#C02020]'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Calendar className="w-4 h-4" />
                                    Load Bookings
                                </>
                            )}
                        </button>

                        <button
                            onClick={exportToExcel}
                            disabled={exporting || !dateRange[0] || !dateRange[1]}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-colors ${exporting || !dateRange[0] || !dateRange[1]
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#039855] text-white hover:bg-[#027A48]'
                                }`}
                        >
                            {exporting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Exporting...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Export to Excel
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Results Card */}
                <div className="bg-white rounded-[1.25rem] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-[#1D1D1D]">
                            Bookings {total > 0 ? `(${from}-${to} of ${total})` : ''}
                        </h2>
                        {selectedBranch && (
                            <span className="text-sm text-[#575757]">
                                {selectedBranch.name}
                                {selectedLine && ` • ${selectedLine.name}`}
                            </span>
                        )}
                        {selectedBranchId === 'all' && total > 0 && (
                            <span className="text-sm text-[#575757]">All Branches</span>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-[#DB2727] animate-spin" />
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-12 text-[#575757]">
                            No bookings found. Adjust filters and click Load Bookings button.
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-[#F9FAFB] border-b-2 border-[#E5E7EB]">
                                            {showBranchColumn && (
                                                <th className="text-left p-3 text-sm font-semibold text-[#1D1D1D]">Branch</th>
                                            )}
                                            <th className="text-left p-3 text-sm font-semibold text-[#1D1D1D]">Date</th>
                                            <th className="text-left p-3 text-sm font-semibold text-[#1D1D1D]">Time</th>
                                            <th className="text-left p-3 text-sm font-semibold text-[#1D1D1D]">Vehicle</th>
                                            <th className="text-left p-3 text-sm font-semibold text-[#1D1D1D]">Customer</th>
                                            <th className="text-left p-3 text-sm font-semibold text-[#1D1D1D]">Phone</th>
                                            <th className="text-left p-3 text-sm font-semibold text-[#1D1D1D]">Status</th>
                                            <th className="text-left p-3 text-sm font-semibold text-[#1D1D1D]">Service Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((booking, index) => (
                                            <tr key={booking.id || index} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]">
                                                {showBranchColumn && (
                                                    <td className="p-3 text-sm text-[#1D1D1D]">
                                                        {booking.branch_name ?? booking.branch_id ?? '-'}
                                                    </td>
                                                )}
                                                <td className="p-3 text-sm text-[#1D1D1D]">{booking.date}</td>
                                                <td className="p-3 text-sm text-[#1D1D1D]">
                                                    {booking.start_time} - {booking.end_time}
                                                </td>
                                                <td className="p-3 text-sm text-[#1D1D1D] font-medium">
                                                    {booking.vehicle_no || '-'}
                                                </td>
                                                <td className="p-3 text-sm text-[#1D1D1D]">
                                                    {booking.customer_name || '-'}
                                                </td>
                                                <td className="p-3 text-sm text-[#1D1D1D]">
                                                    {booking.phone_number || '-'}
                                                </td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${booking.status === 'BOOKED' ? 'bg-[#FFD4D4] text-[#DB2727]' :
                                                        booking.status === 'PENDING' ? 'bg-[#FFF3CD] text-[#FF961B]' :
                                                            booking.status === 'COMPLETED' ? 'bg-[#C3F3C8] text-[#039855]' :
                                                                'bg-[#E5E7EB] text-[#575757]'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-sm text-[#1D1D1D]">
                                                    {booking.service_type || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {total > PAGE_SIZE && (
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E5E7EB]">
                                    <span className="text-sm text-[#575757]">
                                        Page {page} of {totalPages}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => fetchBookings(page - 1)}
                                            disabled={loading || page <= 1}
                                            className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-sm font-medium text-[#1D1D1D] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F9FAFB]"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => fetchBookings(page + 1)}
                                            disabled={loading || page >= totalPages}
                                            className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-sm font-medium text-[#1D1D1D] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F9FAFB]"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Toast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onClose={hideToast}
                duration={toast.duration}
            />
        </div>
    );
}
