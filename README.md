# Fitness Studio Analytics Dashboard

A modern, automated reporting dashboard for boutique fitness studios built with Next.js, TypeScript, and shadcn/ui.

## Features

- 📊 **7 Key Performance Metrics**
  - New members
  - Intro sales
  - Lead to intro conversion
  - Intro to member conversion
  - Total sales
  - Average leads per day
  - Intro to pack conversion

- 📈 **Interactive Charts**
  - New leads & customers vs intro sales (with targets)
  - New members tracking (with target line)
  - Cumulative memberships (retained vs new)
  - Total sales breakdown by category

- 🎨 **Modern UI**
  - Clean, professional design using shadcn/ui components
  - Threshold-based color coding for quick insights
  - Month-over-month percentage change tracking
  - Responsive layout for all screen sizes

- 📁 **Flexible Data Import**
  - Upload CSV files directly through the UI
  - Select any month/year for reporting
  - Automatic data processing and calculation

## Getting Started

### Prerequisites

- Node.js 20.0.0 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal)

## Usage

### Using Your Own Data

1. Click "Upload CSV Files" on the home screen
2. Select the month and year for your report
3. Upload the following 6 CSV files:
   - Membership Sales (No Renewals)
   - Membership Sales (With Renewals)
   - Intro Offers Sales
   - New Leads and Customers
   - Intro Offers Conversions
   - Latest Payments
4. Click "Process Files" to generate your dashboard

### Demo Mode

For demonstrations or testing, use the **sample data** provided:

1. See the `sample-data/` folder for fake CSV files
2. Read the [DEMO_GUIDE.md](./DEMO_GUIDE.md) for detailed instructions
3. All sample data is randomly generated and safe for public demos

To regenerate sample data:
```bash
node scripts/generate-sample-data.js
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── dashboard.tsx
│   │   ├── metric-card.tsx
│   │   └── *-chart.tsx  # Chart components
│   └── lib/             # Utility functions
│       ├── csv-processor.ts      # CSV parsing and metrics
│       ├── chart-data-processor.ts
│       └── metric-utils.ts
├── sample-data/         # Demo data (fake)
├── september-2025/      # Your real data (keep private)
└── scripts/             # Utility scripts
```

## Metrics Explained

### Threshold-Based Color Coding

Each metric has color-coded thresholds to quickly identify performance:

- **Green**: Exceeding targets
- **Yellow**: Meeting minimum thresholds
- **Red**: Below targets, needs attention

See `src/lib/metric-utils.ts` for specific threshold values.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

## Development

### Adding New Metrics

1. Add calculation function to `src/lib/csv-processor.ts`
2. Update the `DashboardMetrics` interface
3. Add threshold logic to `src/lib/metric-utils.ts`
4. Update the dashboard component to display the new metric

### Adding New Charts

1. Create chart data processor in `src/lib/chart-data-processor.ts`
2. Create chart component in `src/components/`
3. Add new tab to the dashboard
4. Update the `processCSVData` function to generate chart data

## License

This project is private and proprietary.

## Support

For questions or issues, please contact the development team.
