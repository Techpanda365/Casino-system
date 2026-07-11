import React from 'react';

const SubscriptionPlan = () => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-100 rounded-lg">
          <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7C7 5 8 3 12 3C16 3 17 5 17 7V11"/>
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Subscription Management</h2>
          <p className="text-xs text-gray-500">Control admin access to the platform</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-full">
            <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16V12M12 8H12.01"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">How it works</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              As a <strong>Super Admin</strong>, you can activate or deactivate any admin's subscription from the list above.
              When an admin's subscription is <strong>deactivated</strong>, they will not be able to log in to the dashboard.
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-500">Active - Can login</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                <span className="text-gray-500">Deactive - Cannot login</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlan;
