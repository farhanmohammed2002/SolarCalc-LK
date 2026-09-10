import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface CashFlowChartProps {
  trajectory: Array<{
    year: number;
    annual_benefit: number;
    om_cost: number;
    net_annual: number;
    cumulative: number;
  }>;
  paybackYears: number;
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  trajectory,
  paybackYears
}) => {
  const data = trajectory.map(t => ({
    year: `Yr ${t.year}`,
    year_num: t.year,
    cumulative_lkr: t.cumulative,
    net_annual_lkr: t.net_annual
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            20-Year Cumulative Cash Flow & Payback Breakeven
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Accounts for 0.55%/yr panel degradation, 1% annual O&M, and Year-10 inverter maintenance reserve.
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          Payback Point: ~{paybackYears} Years
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
            <YAxis
              tick={{ fontSize: 10, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(val: number) => `${(val / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px'
              }}
              formatter={(val: any) => [
                `LKR ${Number(val).toLocaleString()}`,
                'Cumulative Net Cash Flow'
              ]}
            />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5} label={{ value: 'Breakeven', fill: '#ef4444', fontSize: 10, position: 'top' }} />
            <Area
              type="monotone"
              dataKey="cumulative_lkr"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#cashGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl flex items-center justify-between">
        <span>📉 Initial Outflow: <b>Year 0 Turnkey Installation</b></span>
        <span>📈 Pure Profit Phase: <b>Years {Math.ceil(paybackYears)} to 20</b></span>
      </div>
    </div>
  );
};
