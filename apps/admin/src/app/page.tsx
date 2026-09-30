export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen p-8">
      <header className="mb-8 border-b pb-4 border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Bansal Foods Management Console</h1>
        <p className="text-sm text-slate-500">Fatehpuri, Delhi Operations & Inventory Hub</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
            Orders Today
          </h2>
          <p className="text-3xl font-bold text-slate-900">0</p>
          <span className="text-xs text-slate-400">Live order processing queue</span>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
            Active SKUs
          </h2>
          <p className="text-3xl font-bold text-slate-900">0</p>
          <span className="text-xs text-slate-400">Pack variants in catalog</span>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
            Low Stock Alerts
          </h2>
          <p className="text-3xl font-bold text-slate-900">0</p>
          <span className="text-xs text-slate-400">Items below threshold</span>
        </div>
      </div>
    </div>
  );
}
