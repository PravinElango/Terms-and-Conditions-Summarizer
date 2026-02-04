import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, FileText, ChevronRight, Trash2 } from 'lucide-react';

const HistorySidebar = ({ history, onSelect, onClose, isOpen, onClear }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 flex flex-col border-r border-gray-100"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-2 text-gray-800">
                                <Clock size={20} className="text-blue-600" />
                                <h2 className="font-bold text-lg">History</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {history.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">
                                    <Clock size={40} className="mx-auto mb-3 opacity-20" />
                                    <p>No recent summaries</p>
                                </div>
                            ) : (
                                history.map((item, idx) => (
                                    <motion.div
                                        key={item.id || idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => onSelect(item)}
                                        className="group p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all relative"
                                    >
                                        <h3 className="font-semibold text-gray-800 truncate pr-4">{item.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{item.date || 'Just now'}</p>
                                        <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-blue-400 transition-colors" />
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {history.length > 0 && (
                            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                                <button
                                    onClick={onClear}
                                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                    Clear History
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default HistorySidebar;
