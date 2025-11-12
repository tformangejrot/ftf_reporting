# Demo Guide

## Using Sample Data for Demonstrations

To protect your real business data during demos, I've generated a complete set of **fake sample data** that matches the structure of your actual CSV files.

### Quick Start

1. **Navigate to the dashboard**: Open http://localhost:3001

2. **Upload the sample files**:
   - Click "Upload CSV Files"
   - Select **September 2025** as the month/year
   - Upload all 6 files from the `sample-data/` folder:
     - `momence--membership-sales-export-norenewals.csv`
     - `momence--membership-sales-export-withrenewals.csv`
     - `momence-intro-offers-sales-report.csv`
     - `momence-new-leads-and-customers.csv`
     - `momence-intro-offers-conversions-report.csv`
     - `momence-latest-payments-report.csv`
   - Click "Process Files"

3. **View the demo dashboard** with realistic but fake metrics!

### What's in the Sample Data?

The sample data includes:
- **28 new members** (September 2025)
- **~180 total active memberships** (including renewals)
- **85 intro offer sales**
- **240 leads** over 3 months (July-September)
- **~95 conversions** from intro offers
- **450 payment transactions**

All names, emails, and specific numbers are randomly generated.

### Expected Metrics

With the sample data, you should see approximately:
- **New Members**: 28
- **Intro Sales**: 85
- **Lead to Intro Conversion**: 35-40%
- **Intro to Member Conversion**: 20-25%
- **Total Sales**: $42,000-$48,000
- **Avg Leads per Day**: 8
- **Intro to Pack Conversion**: 12-15%

### Regenerating Sample Data

If you want fresh sample data with different random values:

```bash
node scripts/generate-sample-data.js
```

This will create new CSV files in the `sample-data/` folder.

### Security Note

✅ **Safe for demos**: All data in `sample-data/` is completely fake
❌ **Keep private**: Your real data remains in the `september-2025/` folder

### Tips for Demos

1. **Practice first**: Upload the sample data and familiarize yourself with the dashboard before your demo
2. **Explain the metrics**: Use the sample data to walk through each KPI and what it means
3. **Show the charts**: Navigate through all the chart tabs to demonstrate the full functionality
4. **Highlight features**: Show the month/year selector and file upload capabilities
5. **Discuss insights**: Talk about how the threshold-based color coding helps identify areas needing attention

---

**Questions?** The sample data is designed to produce realistic-looking metrics that demonstrate all the dashboard features without exposing any real business information.

