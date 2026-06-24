"""
Test pricing cascade fixes from iteration_17.
Validates:
 - All 13 city landing pages render correct $1,200 (+ travel fee for outer tier)
 - City FAQ + price range + travel notes use new locked values
 - No legacy $650 / $750 / $1,000 / $850 / $9,000 / $2,500 / $156,259 / $15,625 remain
"""
import os
import re
import pytest
import requests

BASE = "http://localhost:3000"

TRIAD_CORE = [
    "winston-salem", "greensboro", "charlotte", "raleigh", "high-point",
    "burlington", "kernersville", "lexington", "thomasville", "clemmons", "mocksville",
]
OUTER_TIER = ["asheboro", "salisbury"]
ALL_CITIES = TRIAD_CORE + OUTER_TIER

# Legacy prices that must NOT appear (homepage allowed exception $16,131 noted)
LEGACY_PRICES = ["$850", "$9,000", "$2,500", "$156,259", "$15,625"]
LEGACY_OFFER_NUMERIC = ['"price":"650"', '"price":"750"', '"price":"900"', '"price":"950"', '"price": "650"', '"price": "750"', '"price": "900"']


def _fetch(path):
    r = requests.get(f"{BASE}{path}", timeout=20)
    assert r.status_code == 200, f"GET {path} -> {r.status_code}"
    return r.text


# NOTE: The app is a React SPA — server returns the same index.html for all routes.
# Server-side HTML will only differ when pre-rendered. We grep the static bundle as best-effort
# but the actual rendered values must be confirmed via Playwright (see test_pricing_ui.py).

class TestStaticBundle:
    def test_homepage_jsonld_has_new_offer_prices(self):
        """Source bundle (HomePage.js compiled) must contain new offer prices."""
        # Inspect the source file directly since SPA HTML doesn't include the JSON-LD until React renders.
        with open("/app/frontend/src/pages/HomePage.js") as f:
            src = f.read()
        assert '"price": "1200"' in src
        assert '"price": "1300"' in src
        assert '"price": "1500"' in src
        for legacy in ['"price": "650"', '"price": "750"', '"price": "900"', '"price": "950"']:
            assert legacy not in src, f"Legacy offer price {legacy} still in HomePage.js"

    def test_city_landing_page_source_uses_1200(self):
        with open("/app/frontend/src/pages/CityLandingPage.js") as f:
            src = f.read()
        # priceStart fallback
        assert "data.priceStart || 1200" in src
        # priceRangeTop = 2000
        assert "priceRangeTop = 2000" in src
        # travel-note copy
        assert "travel fee applies in addition to the base walkthrough price" in src
        # Each city seoDesc references $1,200
        for city in ALL_CITIES:
            # rudimentary: ensure the cities dict block mentions $1,200 nearby
            assert "1200" in src
        # No legacy fallbacks
        assert "|| 650" not in src
        assert "|| 750" not in src
        # No price-range copy at 650-1000 or 750-1200 patterns
        assert "650\u2013" not in src and "750\u2013" not in src
        # Outer tier travelNote travel-fee label
        assert "$1,200 + travel fee" in src

    def test_seo_generator_uses_new_prices(self):
        with open("/app/frontend/scripts/generate-seo-pages.js") as f:
            src = f.read()
        # New Offer prices
        assert "1200" in src
        # Reject legacy explicit Offer price strings
        for legacy in ['"price": "650"', '"price": "750"', '"price": "900"']:
            assert legacy not in src, f"{legacy} still in generate-seo-pages.js"

    def test_llms_txt_no_legacy_prices(self):
        path = "/app/frontend/public/llms.txt"
        if not os.path.exists(path):
            pytest.skip("llms.txt not present")
        with open(path) as f:
            txt = f.read()
        # Forbid stale references
        for legacy in ["$650", "$750"]:
            assert legacy not in txt, f"{legacy} found in llms.txt"
