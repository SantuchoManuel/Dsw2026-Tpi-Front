import Card from '../../shared/components/Card';

function StatCard({ icon, badgeText, badgeClassName, label, value }) {
  return (
    <Card className="flex flex-col justify-between p-6">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-med-primary-50 text-med-primary-900 flex items-center justify-center">
          {icon}
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeClassName}`}
        >
          {badgeText}
        </span>
      </div>

      <div className="mt-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-med-text-sub">
          {label}
        </span>
        <p className="text-3xl sm:text-4xl font-extrabold text-med-primary-900 mt-1">
          {value}
        </p>
      </div>
    </Card>
  );
}

export default StatCard;
