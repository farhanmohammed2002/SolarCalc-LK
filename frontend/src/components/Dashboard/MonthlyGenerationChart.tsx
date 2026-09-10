import React from 'react';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

interface MonthlyGenerationChartProps {
  monthlyGeneration: number[];
  monthlyLoad: number;
}

export const MonthlyGenerationChart: React.FC<MonthlyGenerationChartProps> = ({
  monthlyGeneration,
  monthlyLoad
}) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data = months.map((m, idx) => ({
    month: m,
    solar_generation: monthlyGeneration[idx] || 0,
    electricity_load: monthlyLoad
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Monthly Solar Generation vs Electricity Consumption
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            12-month expected yield derived from Global Solar Atlas v2.0 Sri Lanka seasonal rasters.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
            <span className="text-slate-700">Solar Yield (kWh)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-sky-600 inline-block" />
            <span className="text-slate-700">Monthly Load (kWh)</span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px'
              }}
              formatter={(val: any, name: any) => [
                `${Number(val).toLocaleString()} kWh`,
                name === 'solar_generation' ? 'Solar Generation' : 'Household Consumption'
              ]}
            />
            <Bar dataKey="solar_generation" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Line type="monotone" dataKey="electricity_load" stroke="#0284c7" strokeWidth={2.5} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl">
        <span>☀️ Peak Solar Months: <b>February - April</b> (Dry Season)</span>
        <span>🌧️ Monsoon Dip: <b>May - June & November</b> (Cloud Cover)</span>
      </div>
    </div>
  );
};
