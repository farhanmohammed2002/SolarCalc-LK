# Rooftop Solar PV Engineering & Practical FAQ (Sri Lanka)

## Document Overview
- **Document ID**: SOLAR-PV-FAQ-LK-2025
- **Category**: Frequently Asked Questions & Operational Guidance
- **Applicability**: Sri Lanka Residential & Light Commercial Rooftop Solar Installations

---

## 1. Grid Approval & Interconnection Process
### Q: What is the step-by-step procedure to get CEB/LECO approval for a rooftop solar system?
**A:** The standard utility approval pipeline involves 5 steps:
1. **Preliminary Assessment & Engineering Sizing**: Calculate required capacity, verify roof structural integrity, and ensure the selected inverter is on the CEB-approved equipment list.
2. **Application Submission**: Submit the CEB/LECO Interconnection Application along with the electrical single-line diagram (SLD), solar module and inverter technical datasheets, warranty certificates, and proof of electricity account ownership. An application fee of LKR 5,000–10,000 is payable.
3. **Utility Engineering Feasibility Study**: CEB/LECO area engineers inspect the local distribution transformer capacity to ensure solar penetration does not exceed line limits (typically max 80% of transformer kVA).
4. **Installation & Testing**: A registered solar installer mounts the system adhering to IEEE 1547 / IEC 62548 standards. An independent chartered electrical engineer certification may be required for systems $> 10\text{ kW}$.
5. **Testing, Meter Replacement & Commissioning**: CEB/LECO engineers test anti-islanding protection and install the official bi-directional smart meter. The 20-year Power Purchase Agreement (PPA) is formally signed.

---

## 2. Power Outages & Grid Failure
### Q: Will my solar system power my house during a CEB grid power outage?
**A:** 
- **Standard Grid-Tied Inverter**: **No**. Standard grid-tied inverters (e.g. Sungrow SG3.0RS, Fronius Primo) are legally required by international safety standards (IEEE 1547 / IEC 62116) to execute **anti-islanding shutdown within 2.0 seconds** when grid voltage drops. This prevents energizing the utility line and electrocuting CEB linesmen repairing downstream cables.
- **Hybrid Inverter + Battery Storage (BESS)**: **Yes**. If you install a hybrid inverter (e.g. Deye SUN-5K-SG04LP1 or Huawei SUN2000 with LUNA2000 battery) with an integrated automatic transfer switch (ATS), the inverter isolates the house from the grid in $< 10\text{ ms}$ and continues supplying essential domestic circuits from rooftop solar and the battery storage.

---

## 3. Maintenance, Dust & Degradation
### Q: How often should solar panels be cleaned in Sri Lanka?
**A:**
- In coastal, agricultural, or roadside dusty environments (e.g. Jaffna, Hambantota, Colombo marine drive), panels should be cleaned **once every 4 to 6 weeks**.
- Panels should be washed with soft water and a microfiber brush early in the morning (before 08:00) or late afternoon (after 17:30). **Never wash hot solar panels under midday sun**, as thermal shock can micro-crack the tempered glass.
- High-pressure washers (>1,500 psi) and abrasive detergents must be avoided to protect anti-reflective hydrophobic glass coatings.
- Rain provides partial cleaning if panels are mounted with at least a **$10^\circ$ tilt angle**.

---

## 4. Lightning & Surge Protection
### Q: Does having a solar system increase the risk of lightning strikes on my roof?
**A:** A rooftop solar array does not attract lightning, but being a metallic structure exposed on the roof requires robust surge protection:
1. **DC Surge Protection Device (SPD)**: Class II DC SPDs (rated 600V or 1000V) must be installed between the array and inverter.
2. **AC Surge Protection Device (SPD)**: Class II AC SPD at the inverter AC output and main distribution board.
3. **Equipotential Bonding & Earth Electrode**: The aluminum mounting rails, inverter chassis, and panel frames must be bonded using $\ge 6\text{ mm}^2$ or $16\text{ mm}^2$ copper earth conductor connected to an independent earth rod with earth resistance measured $< 5\ \Omega$ (or $< 10\ \Omega$ per CEB regulations).

---

## 5. Payback & Electricity Bill Settlement
### Q: How does CEB pay out surplus electricity under Net Accounting?
**A:**
- Each monthly billing cycle, the meter reader records cumulative export units ($E_{\text{export}}$) and import units ($E_{\text{import}}$).
- If export exceeds import, CEB issues a bill statement showing a negative balance or credits your designated prosumer account.
- The surplus $(E_{\text{export}} - E_{\text{import}})$ is multiplied by **LKR 44.14/kWh** (for systems $\le 20\text{ kW}$).
- Payment is disbursed by CEB either via monthly direct bank transfer (CEB online prosumer settlement system) or via account cheque.
