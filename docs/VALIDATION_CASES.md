# SolarCalc LK V1.0 — Validation Test Cases & Results

| Case ID | Location | Consumption (kWh) | Scheme | Panel Model | PV Size (kWp) | Pre-Solar Bill (LKR) | Post-Solar Bill (LKR) | Monthly Net (LKR) | Payback (Yrs) | Pass Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Colombo | 45 | Net Metering | EGing 415W | 0.42 | 410.0 | 75.0 | 335.0 | 8.5 | PASSED |
| **TC-02** | Colombo | 90 | Net Accounting | EGing 415W | 0.83 | 1,480.0 | 0.0 | 1,480.0 | 5.2 | PASSED |
| **TC-03** | Colombo | 150 | Net Accounting | EGing 415W | 1.25 | 4,170.0 | 0.0 | 4,170.0 | 4.1 | PASSED |
| **TC-04** | Colombo | 250 | Net Accounting | EGing 415W | 2.08 | 11,900.0 | 0.0 | 11,900.0 | 3.2 | PASSED |
| **TC-05** | Jaffna | 300 | Net Accounting | SunPower 415W | 2.28 | 14,900.0 | 0.0 | 14,900.0 | 3.4 | PASSED |
| **TC-06** | Kandy | 200 | Net Accounting | Qcells 350W | 1.63 | 8,900.0 | 0.0 | 8,900.0 | 3.9 | PASSED |
| **TC-07** | Galle | 350 | Net Plus | EGing 415W | 2.71 | 17,500.0 | 17,500.0 | 15,500.0 | 4.2 | PASSED |
| **TC-08** | Colombo | 600 | Net Accounting | BiMAX 430W | 4.73 | 30,500.0 | 0.0 | 30,500.0 | 2.9 | PASSED |
| **TC-09** | Anuradhapura | 800 | Net Accounting | SunPower 480W | 6.24 | 40,900.0 | 0.0 | 40,900.0 | 3.1 | PASSED |
| **TC-10** | Colombo | 0 | Net Metering | EGing 415W | 0.00 | 0.0 | 0.0 | 0.0 | 0.0 | PASSED |
| **TC-11** | Colombo | 150 (50% offset) | Net Accounting | EGing 415W | 0.63 | 4,170.0 | 1,480.0 | 2,690.0 | 4.4 | PASSED |
| **TC-12** | Colombo | 200 (120% offset) | Net Accounting | EGing 415W | 2.08 | 8,900.0 | -1,800.0 | 10,700.0 | 3.5 | PASSED |
