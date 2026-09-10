import unittest
import os, sys

# Add parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.calculations.tariff import calculate_domestic_bill, estimate_units_from_bill
from app.calculations.solar import get_solar_resource
from app.calculations.pv_sizing import calculate_solar_pv_system
from app.calculations.validation import validate_inputs

class TestSolarCalcEngine(unittest.TestCase):

    def test_pucsl_tariff_lifeline_tier(self):
        """TC-01: 45 units should fall in Lifeline tier (30 @ 4.00 + 15 @ 6.00 + 200 fixed = 410.0 LKR)"""
        res = calculate_domestic_bill(45.0)
        self.assertEqual(res["energy_charge"], 30.0 * 4.00 + 15.0 * 6.00) # 210.0
        self.assertEqual(res["fixed_charge"], 200.0)
        self.assertEqual(res["total_bill"], 410.0)

    def test_pucsl_tariff_90_units(self):
        """TC-02: 90 units (60 @ 11.00 + 30 @ 14.00 + 400 fixed = 1,480.0 LKR)"""
        res = calculate_domestic_bill(90.0)
        expected_energy = 60.0 * 11.00 + 30.0 * 14.00 # 1080.0
        self.assertEqual(res["energy_charge"], expected_energy)
        self.assertEqual(res["fixed_charge"], 400.0)
        self.assertEqual(res["total_bill"], 1480.0)

    def test_pucsl_tariff_150_units(self):
        """TC-03: 150 units (60 @ 11 + 30 @ 14 + 30 @ 20 + 30 @ 33 + 1500 fixed = 4,170.0 LKR)"""
        res = calculate_domestic_bill(150.0)
        expected_energy = 60.0 * 11.00 + 30.0 * 14.00 + 30.0 * 20.00 + 30.0 * 33.00 # 2670.0
        self.assertEqual(res["energy_charge"], expected_energy)
        self.assertEqual(res["fixed_charge"], 1500.0)
        self.assertEqual(res["total_bill"], 4170.0)

    def test_pucsl_tariff_condition_3_prosumer(self):
        """Test Condition 3: Prosumer with net 0 kWh pays 0 LKR fixed charge."""
        res = calculate_domestic_bill(units=0.0, is_solar_prosumer=True, net_units=0.0)
        self.assertEqual(res["total_bill"], 0.0)
        self.assertEqual(res["fixed_charge"], 0.0)

    def test_inverse_tariff_solver(self):
        """Test that inverse solver correctly maps bill back to units."""
        test_units = [45.0, 90.0, 150.0, 250.0]
        for u in test_units:
            bill = calculate_domestic_bill(u)["total_bill"]
            solved_u = estimate_units_from_bill(bill)
            self.assertAlmostEqual(u, solved_u, delta=1.5)

    def test_gsa_resource_benchmark(self):
        """Benchmark GSA solar yield for Colombo (Lat 6.927, Lon 79.861)"""
        res = get_solar_resource(6.9271, 79.8612)
        self.assertGreaterEqual(res["annual_pvout_kwh_per_kwp"], 1500.0)
        self.assertLessEqual(res["annual_pvout_kwh_per_kwp"], 1650.0)
        self.assertEqual(len(res["monthly_pvout"]), 12)

    def test_end_to_end_sizing(self):
        """Test end-to-end sizing for 250 kWh/month consumption in Colombo"""
        res = calculate_solar_pv_system(
            monthly_units_kwh=250.0,
            latitude=6.9271,
            longitude=79.8612,
            scheme="NET_ACCOUNTING"
        )
        self.assertIn("system", res)
        self.assertGreater(res["system"]["actual_capacity_kwp"], 1.5)
        self.assertLess(res["system"]["actual_capacity_kwp"], 3.0)
        self.assertEqual(res["financials"]["simple_payback_years"] > 0, True)
        self.assertLess(res["financials"]["simple_payback_years"], 6.0) # High savings on 52 LKR tier

    def test_input_validation(self):
        """Test validation rejects invalid coordinates or extreme consumption"""
        valid, errs = validate_inputs(latitude=0.0, longitude=0.0, monthly_units_kwh=100)
        self.assertFalse(valid)
        self.assertTrue(len(errs) > 0)

if __name__ == "__main__":
    unittest.main()
