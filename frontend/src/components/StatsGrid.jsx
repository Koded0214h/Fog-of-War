// src/components/StatsGrid.jsx
export default function StatsGrid({ userStats }) {
  const stats = [
    {
      label: "Total Games Played",
      value: userStats.totalGames,
      format: "number"
    },
    {
      label: "Total SOL Extracted",
      value: userStats.totalSol,
      format: "sol"
    },
    {
      label: "Successful Extractions",
      value: userStats.extractions,
      format: "number"
    },
    {
      label: "Eliminations",
      value: userStats.eliminations,
      format: "number"
    }
  ];

  const formatValue = (value, format) => {
    if (format === "sol") {
      return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    return value.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 bg-bgSecondary border border-borderDark"
        >
          <p className="text-textSecondary text-base font-medium leading-normal">
            {stat.label}
          </p>
          <p className="text-primary tracking-light text-3xl font-bold leading-tight">
            {formatValue(stat.value, stat.format)}
          </p>
        </div>
      ))}
    </div>
  );
}