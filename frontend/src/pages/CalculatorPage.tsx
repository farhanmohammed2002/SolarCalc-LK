import React, { useState } from 'react';
import { WizardStepper } from '../components/Calculator/WizardStepper';
import { StepLocation } from '../components/Calculator/StepLocation';
import { StepConsumption } from '../components/Calculator/StepConsumption';
import { StepProperty } from '../components/Calculator/StepProperty';
import { StepSystem } from '../components/Calculator/StepSystem';
import { StepResults } from '../components/Calculator/StepResults';
import { DistrictLocation, CalculationRequest, CalculationResult } from '../types/solar';
import { SRI_LANKA_DISTRICTS, executeSolarCalculationClient } from '../utils/solarEngine';

interface CalculatorPageProps {
  initialDistrictName?: string;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ initialDistrictName }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReachedStep, setMaxReachedStep] = useState(1);

  // Form State
  const initialDist = initialDistrictName 
    ? (SRI_LANKA_DISTRICTS.find(d => d.name.toLowerCase() === initialDistrictName.toLowerCase()) || SRI_LANKA_DISTRICTS[0])
    : SRI_LANKA_DISTRICTS[0];
  const [district, setDistrict] = useState<DistrictLocation>(initialDist);
  const [monthlyUnits, setMonthlyUnits] = useState<number>(250);
  const [monthlyBill, setMonthlyBill] = useState<number | undefined>(11900);
  const [roofType, setRoofType] = useState<'ASBESTOS' | 'CLAY_TILE' | 'CORRUGATED_ZINC' | 'CONCRETE_SLAB'>('ASBESTOS');
  const [roofAreaSqm, setRoofAreaSqm] = useState<number | undefined>(45);
  const [azimuthDeg, setAzimuthDeg] = useState<number>(180);
  const [tiltDeg, setTiltDeg] = useState<number>(10);
  const [scheme, setScheme] = useState<'NET_ACCOUNTING' | 'NET_METERING' | 'NET_PLUS'>('NET_ACCOUNTING');
  const [targetOffsetPct, setTargetOffsetPct] = useState<number>(100);
  const [panelId, setPanelId] = useState<number>(1);
  const [customCost, setCustomCost] = useState<number | undefined>(undefined);

  // Calculation Result
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleNext = (nextStep: number) => {
    setCurrentStep(nextStep);
    if (nextStep > maxReachedStep) {
      setMaxReachedStep(nextStep);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCalculate = async () => {
    const req: CalculationRequest = {
      district: district.name,
      latitude: district.lat,
      longitude: district.lon,
      monthly_units_kwh: monthlyUnits,
      monthly_bill_lkr: monthlyBill,
      target_offset_pct: targetOffsetPct,
      scheme,
      roof_type: roofType,
      roof_area_sqm: roofAreaSqm,
      azimuth_deg: azimuthDeg,
      tilt_deg: tiltDeg,
      panel_id: panelId,
      custom_system_cost_lkr: customCost
    };

    try {
      // Try backend API first
      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        // Fallback to client calculation engine
        const clientRes = executeSolarCalculationClient(req);
        setResult(clientRes);
      }
    } catch (err) {
      // Offline / standalone client calculation engine
      const clientRes = executeSolarCalculationClient(req);
      setResult(clientRes);
    }

    handleNext(5);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <WizardStepper
        currentStep={currentStep}
        setStep={setCurrentStep}
        maxReachedStep={maxReachedStep}
      />

      {currentStep === 1 && (
        <StepLocation
          selectedDistrict={district.name}
          onSelectDistrict={d => setDistrict(d)}
          onNext={() => handleNext(2)}
        />
      )}

      {currentStep === 2 && (
        <StepConsumption
          monthlyUnits={monthlyUnits}
          setMonthlyUnits={setMonthlyUnits}
          monthlyBill={monthlyBill}
          setMonthlyBill={setMonthlyBill}
          onNext={() => handleNext(3)}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <StepProperty
          roofType={roofType}
          setRoofType={setRoofType}
          roofAreaSqm={roofAreaSqm}
          setRoofAreaSqm={setRoofAreaSqm}
          azimuthDeg={azimuthDeg}
          setAzimuthDeg={setAzimuthDeg}
          tiltDeg={tiltDeg}
          setTiltDeg={setTiltDeg}
          onNext={() => handleNext(4)}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <StepSystem
          scheme={scheme}
          setScheme={setScheme}
          targetOffsetPct={targetOffsetPct}
          setTargetOffsetPct={setTargetOffsetPct}
          panelId={panelId}
          setPanelId={setPanelId}
          customCost={customCost}
          setCustomCost={setCustomCost}
          onCalculate={handleCalculate}
          onBack={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 5 && result && (
        <StepResults
          result={result}
          onModify={() => setCurrentStep(4)}
        />
      )}
    </div>
  );
};
