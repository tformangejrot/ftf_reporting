# Sample Data for Demo

This folder contains **fake sample data** generated for demonstration purposes. All names, emails, and numbers are randomly generated and do not represent real people or actual business data.

## Files Included

1. **momence--membership-sales-export-norenewals.csv** - ~28 new membership sales (no renewals)
2. **momence--membership-sales-export-withrenewals.csv** - ~180 total memberships (new + renewals)
3. **momence-intro-offers-sales-report.csv** - ~85 intro offer sales
4. **momence-new-leads-and-customers.csv** - ~240 leads over 3 months (July-Sept)
5. **momence-intro-offers-conversions-report.csv** - ~95 conversions from intros
6. **momence-latest-payments-report.csv** - ~450 payment transactions

## Sample Metrics (Approximate)

Based on this sample data, you should see metrics similar to:

- **New Members**: ~28 (September 2025)
- **Intro Sales**: ~85 (September 2025)
- **Lead to Intro Conversion**: ~35-40% (3-month period)
- **Intro to Member Conversion**: ~20-25% (3-month period)
- **Total Sales**: ~$42,000-$48,000 (September 2025)
- **Avg Leads per Day**: ~8 (September 2025)

## How to Use

### Option 1: Upload Files Manually
1. Go to http://localhost:3001
2. Click "Upload CSV Files"
3. Select the month/year (September 2025 recommended)
4. Upload all 6 CSV files from this folder
5. Click "Process Files"

### Option 2: Copy to a Demo Folder
You can copy these files to a new folder and update the API route to load from there instead of the real data folder.

## Regenerating Sample Data

If you want different sample data, you can run:

```bash
node generate-sample-data.js
```

This will regenerate all the CSV files with new random data.

## Notes

- All customer names are randomly generated from common first and last names
- Email addresses use the format: firstname.lastname@example.com
- All dates are set to 2025 (July-September)
- Prices match the real membership/class pricing structure
- The data is designed to produce realistic-looking dashboard metrics

