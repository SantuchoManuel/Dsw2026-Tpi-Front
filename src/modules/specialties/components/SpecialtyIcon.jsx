import {
  Heart,
  Lightbulb,
  FlaskConical,
  Smile,
  Stethoscope,
} from 'lucide-react';

const ICON_RULES = [
  { keywords: ['cardio', 'coraz'], Icon: Heart },
  { keywords: ['neuro', 'cerebr'], Icon: Lightbulb },
  { keywords: ['derma', 'piel'], Icon: FlaskConical },
  { keywords: ['pedia', 'niñ'], Icon: Smile },
];

function SpecialtyIcon({ name = '' }) {
  const lower = name.toLowerCase();
  const rule = ICON_RULES.find(({ keywords }) =>
    keywords.some((keyword) => lower.includes(keyword))
  );
  const Icon = rule ? rule.Icon : Stethoscope;

  return (
    <div className="w-9 h-9 rounded-full bg-med-primary-50 flex items-center justify-center text-med-primary-900 shrink-0">
      <Icon className="w-4 h-4" />
    </div>
  );
}

export default SpecialtyIcon;