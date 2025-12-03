/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import dayjs from "dayjs";

const HistoryTimeline = ({history}: { history: any[] }) => {
    if (!history || history.length === 0) return <div className="text-gray-500 text-sm">No history available.</div>;

    return (
        <div className="w-full mt-4">
            <h3 className="font-semibold text-lg mb-4">Lead History</h3>
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
                {history.map((item, idx) => (
                    <div key={idx} className="mb-8 ml-6 relative">
                        {/* Dot */}
                        <span
                            className={`absolute -left-[33px] flex items-center justify-center w-4 h-4 rounded-full ring-4 ring-white ${
                                item.action_type === 'PROMOTED_LEVEL' ? 'bg-[#DB2727]' : 'bg-blue-500'
                            }`}>
                        </span>

                        <div className="py-4 px-8 bg-white/50 rounded-lg border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center gap-10">
                                <h4 className="font-semibold text-gray-900">{item.action_type.replace('_', ' ')}</h4>
                                <span className="text-xs text-gray-500">
                                    {dayjs(item.timestamp).format("MMM D, YYYY HH:mm")}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                            <p className="text-xs text-gray-400 mt-1">By: {item.actor?.full_name || 'System'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryTimeline;