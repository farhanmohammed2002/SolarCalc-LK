import React from 'react';
import { Receipt, Check, ArrowDownRight, ShieldAlert } from 'lucide-react';
import { CalculationResult } from '../../types/solar';

interface TariffBreakdownTableProps {
  result: CalculationResult;
}

export const TariffBreakdownTable: React.FC<TariffBreakdownTableProps> = ({ result }) => {
  const { scheme, inputs } = result;
  const pre = scheme.pre_solar_breakdown;
  const post = scheme.post_solar_breakdown;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">
              PUCSL January 18, 2025 Tariff Billing Comparison
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Demonstrating exact block-by-block savings and prosumer fixed charge relief under PUCSL Condition 3.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
          Baseline Consumption: {inputs.monthly_units_kwh} kWh
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-100 uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Tariff Component / Block</th>
              <th className="py-2.5 px-3">Rate (LKR/kWh)</th>
              <th className="py-2.5 px-3">Without Solar (LKR)</th>
              <th className="py-2.5 px-3">With Rooftop Solar (LKR)</th>
              <th className="py-2.5 px-3 text-right">Net Monthly Benefit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {pre?.blocks_breakdown?.map((block: any, idx: number) => {
              const postBlock = post?.blocks_breakdown?.find((b: any) => b.block === block.block);
              const postAmt = postBlock ? postBlock.amount : 0.0;
              const diff = block.amount - postAmt;

              return (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-medium text-slate-900">{block.block}</td>
                  <td className="py-2.5 px-3 font-mono">{block.rate.toFixed(2)}</td>
                  <td className="py-2.5 px-3 font-mono">LKR {block.amount.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">
                    {postAmt > 0 ? `LKR ${postAmt.toLocaleString()}` : '— (Eliminated)'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                    +LKR {diff.toLocaleString()}
                  </td>
                </tr>
              );
            })}

            {/* Fixed Charge Row */}
            <tr className="bg-slate-50/70 font-semibold">
              <td className="py-2.5 px-3 text-slate-900">
                Utility Fixed Monthly Charge
                <span className="text-[10px] text-sky-600 block font-normal">Condition 3 Applied: Assessed on net consumption</span>
              </td>
              <td className="py-2.5 px-3 font-mono text-slate-400">—</td>
              <td className="py-2.5 px-3 font-mono">LKR {pre?.fixed_charge?.toLocaleString()}</td>
              <td className="py-2.5 px-3 font-mono text-slate-600">
                {post?.fixed_charge > 0 ? `LKR ${post.fixed_charge.toLocaleString()}` : 'LKR 0.00 (Zero Net)'}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">
                +LKR {((pre?.fixed_charge || 0) - (post?.fixed_charge || 0)).toLocaleString()}
              </td>
            </tr>

            {/* Cash Export Row */}
            {scheme.cash_export_revenue_lkr > 0 && (
              <tr className="bg-amber-50/40 text-amber-950 font-semibold">
                <td className="py-2.5 px-3">
                  Surplus Generation Export to Grid
                  <span className="text-[10px] text-amber-700 block font-normal">
                    CEB Feed-In Tariff ({scheme.scheme_details.net_export_kwh || scheme.scheme_details.gross_export_kwh} kWh exported)
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono">{scheme.scheme_details.export_rate_applied.toFixed(2)}</td>
                <td className="py-2.5 px-3 font-mono text-slate-400">0.00</td>
                <td className="py-2.5 px-3 font-mono text-amber-700">
                  +LKR {scheme.cash_export_revenue_lkr.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-600">
                  +LKR {scheme.cash_export_revenue_lkr.toLocaleString()}
                </td>
              </tr>
            )}

            {/* Total Row */}
            <tr className="bg-slate-900 text-white font-black text-sm">
              <td className="py-3 px-3">Total Monthly Net Balance</td>
              <td className="py-3 px-3 font-mono text-slate-400">—</td>
              <td className="py-3 px-3 font-mono text-rose-300">
                LKR {scheme.pre_solar_bill_lkr.toLocaleString()}
              </td>
              <td className="py-3 px-3 font-mono text-sky-300">
                LKR {scheme.post_solar_bill_lkr.toLocaleString()}
              </td>
              <td className="py-3 px-3 text-right font-mono text-amber-400">
                LKR {scheme.net_monthly_benefit_lkr.toLocaleString()} / mo
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-[11px] text-slate-600">
        <ShieldAlert className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <span>
          <b>PUCSL Annex 2, Condition 3:</b> <i>"Fixed charges for solar prosumers shall be based on the net consumption."</i> 
          This statutory rule prevents solar adopters from being penalized with upper-bracket fixed charges when generating their own power.
        </span>
      </div>
    </div>
  );
};
