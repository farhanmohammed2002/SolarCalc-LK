# Sri Lanka CEB Rooftop Solar PV Schemes (RTSPV Framework)

## Document Overview
- **Document ID**: CEB-RTSPV-SCHEMES-2025
- **Category**: Solar Schemes & Regulatory Framework
- **Authority**: Ceylon Electricity Board (CEB), Lanka Electricity Company (Pvt) Ltd (LECO), Ministry of Power & Energy, Sri Lanka
- **Statutory Framework**: National Energy Policy and Strategies of Sri Lanka, "Soorya Bala Sangramaya" (Battle for Solar Energy)

---

## 1. Overview of the Three Statutory Rooftop Schemes
Sri Lanka's electricity utilities (CEB and LECO) offer three standardized grid-connected rooftop solar photovoltaic schemes for residential and commercial prosumers:

1. **Net Metering** (Introduced 2010)
2. **Net Accounting** (Introduced 2016)
3. **Net Plus** (Introduced 2016)

All three schemes operate under standardized 20-year Power Purchase Agreements (PPA) / Interconnection Agreements executed directly between the electricity account holder and the distribution licensee (CEB or LECO).

---

## 2. Scheme 1: Net Metering
### Mechanics
- **Offset Model**: 1:1 physical energy unit (kWh) balancing.
- **Bi-directional Meter**: Measures both imported units from the grid ($E_{\text{import}}$) and exported solar units to the grid ($E_{\text{export}}$).
- **Monthly Net Energy**:
  $$E_{\text{net}} = E_{\text{import}} - E_{\text{export}}$$
- **Billing Calculation**:
  - If $E_{\text{import}} > E_{\text{export}}$: The customer is billed for $E_{\text{net}}$ according to the applicable PUCSL domestic tariff block, plus the corresponding fixed charge (calculated on $E_{\text{net}}$ per PUCSL Condition 3).
  - If $E_{\text{export}} > E_{\text{import}}$: No bill is issued for energy consumption. The surplus $(E_{\text{export}} - E_{\text{import}})$ is credited as a bankable unit credit ($E_{\text{credit}}$) carried forward to the subsequent billing cycle.
- **Financial Compensation**: **Zero cash payment**. Energy bank credits accumulate indefinitely during the contract term to offset future higher consumption (e.g., during summer/dry months or air conditioning usage), but cannot be cashed out.
- **Target Prosumer**: High-consumption households (Block 4 & Block 5 consumers using $>180\text{ kWh/month}$) whose regular monthly tariff is high (up to LKR 52.00/kWh) and who wish to eliminate utility bills completely without seeking cash disbursements.

---

## 3. Scheme 2: Net Accounting
### Mechanics
- **Offset Model**: Hybrid daytime self-consumption + Cash payout for net exported energy.
- **Monthly Energy Balancing**:
  - If $E_{\text{import}} > E_{\text{export}}$: Customer pays for the net energy difference $(E_{\text{import}} - E_{\text{export}})$ at the prevailing domestic tariff tier.
  - If $E_{\text{export}} > E_{\text{import}}$: Customer pays no electricity consumption bill. The net surplus energy $(E_{\text{export}} - E_{\text{import}})$ is purchased directly by CEB/LECO at the gazetted fixed feed-in tariff.
- **Cash Settlement**: Net export revenue is calculated each billing cycle:
  $$\text{Revenue}_{\text{monthly}} = (E_{\text{export}} - E_{\text{import}}) \times \text{Tariff}_{\text{FiT}}$$
  The distribution licensee deposits the earnings directly into the prosumer's designated bank account or credits the utility account.
- **Contract Duration**: 20 years fixed rate.
- **Target Prosumer**: The vast majority of Sri Lankan residential installations (1 kW to 20 kW). Provides immediate bill zeroing plus an inflation-hedged secondary monthly cash revenue stream.

---

## 4. Scheme 3: Net Plus
### Mechanics
- **Offset Model**: Total gross generation export (No direct physical self-consumption offsetting the customer bill).
- **Dual Metering Configuration**:
  - Meter 1 (Import Meter): Measures total household consumption ($E_{\text{consumption}}$). Customer pays for 100% of this energy according to standard PUCSL domestic tariff rates.
  - Meter 2 (Solar Generation Meter): Measures 100% of the rooftop solar array gross generation ($E_{\text{gross}}$). All generated electricity is exported directly into the CEB/LECO low-voltage distribution network.
- **Utility Payment**:
  $$\text{Revenue}_{\text{export}} = E_{\text{gross}} \times \text{Tariff}_{\text{FiT}}$$
- **Utility Bill**: Standard domestic bill issued independently. Many prosumers request CEB to set off their domestic consumption bill against their solar export revenue, receiving the net financial balance in cash.
- **Target Prosumer**: Vacant properties, holiday bungalows, low-consumption households with large unshaded roof space, or properties where domestic consumption is in low lifeline blocks ($\le 60\text{ kWh/month}$ @ LKR 4-6/kWh) while solar generation is sold at the higher feed-in tariff.

---

## 5. Feed-In Tariff (FiT) Structure (CEB / PUCSL 2024–2025)
The fixed feed-in tariff paid for solar generation under Net Accounting and Net Plus depends on the system's contract capacity:

| Contract Capacity Tier | Feed-In Tariff (LKR / kWh) | PPA Term | Payment Guarantee |
| :--- | :--- | :--- | :--- |
| **Tier 1: $\le 20\text{ kW}$ (Residential standard)** | **LKR 44.14 / kWh** | 20 Years | CEB / LECO Treasury |
| **Tier 2: $> 20\text{ kW}$ to $\le 100\text{ kW}$** | **LKR 41.52 / kWh** | 20 Years | CEB / LECO Treasury |
| **Tier 3: $> 100\text{ kW}$ to $\le 500\text{ kW}$** | **LKR 38.90 / kWh** | 20 Years | CEB / LECO Treasury |

*Note: The Tier 1 rate of LKR 44.14/kWh provides an exceptional internal rate of return (IRR 24%–32%) for Sri Lankan residential installations with equipment payback periods under 4 years.*

---

## 6. Comparison Matrix for Homeowners
| Parameter | Net Metering | Net Accounting *(Recommended)* | Net Plus |
| :--- | :--- | :--- | :--- |
| **Primary Incentive** | Zero electricity bill | Zero bill + Cash deposits | Pure cash generation |
| **Surplus Handling** | Rolled-over kWh credits | Cash payout @ LKR 44.14/kWh | 100% cash @ LKR 44.14/kWh |
| **Cash Paid to Customer?** | No | Yes (Monthly) | Yes (Monthly) |
| **Consumption Bill** | LKR 0 (if net $\le 0$) | LKR 0 (if net $\le 0$) | Billed at standard PUCSL rates |
| **Fixed Charge Rule** | Condition 3 applied on net | Condition 3 applied on net | Standard fixed charge on gross |
| **System Sizing Limit** | Based on contract demand | Contract demand or 20 kW | Transformer capacity limit |
| **Typical Payback Period** | 4.2 – 5.5 Years | **3.2 – 4.2 Years** | 3.5 – 4.5 Years |
