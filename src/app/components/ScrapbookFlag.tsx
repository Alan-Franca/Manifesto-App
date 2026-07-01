

interface ScrapbookFlagProps {
  flag: string;
  rotate?: string;
  className?: string;
}

const emojiToCountryCode: Record<string, string> = {
  '🇧🇷': 'br',
  '🇳🇴': 'no',
  '🇲🇽': 'mx',
  '🇪🇨': 'ec',
  '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 'gb-eng',
  '🇨🇩': 'cd',
  '🇧🇪': 'be',
  '🇸🇳': 'sn',
  '🇺🇸': 'us',
  '🇧🇦': 'ba',
  '🇪🇸': 'es',
  '🇦🇹': 'at',
  '🇵🇹': 'pt',
  '🇭🇷': 'hr',
  '🇫🇷': 'fr',
  '🇯🇵': 'jp',
};

export function ScrapbookFlag({ flag, rotate = 'random', className = '' }: ScrapbookFlagProps) {
  const getRotation = () => {
    if (rotate !== 'random') return rotate;
    let hash = 0;
    for (let i = 0; i < flag.length; i++) {
      hash = flag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const deg = (hash % 6) - 3; // -3 to 3 degrees
    return `${deg}deg`;
  };

  const code = emojiToCountryCode[flag];

  return (
    <div 
      style={{ transform: `rotate(${getRotation()})` }}
      className={`inline-flex items-center justify-center bg-white border border-slate-300 px-1 py-0.5 shadow-sm rounded select-none transition-transform hover:scale-110 flex-shrink-0 ${className}`}
    >
      {code ? (
        <img
          src={`https://flagcdn.com/w40/${code}.png`}
          alt={flag}
          className="w-[18px] h-[12px] object-cover rounded-sm filter drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]"
        />
      ) : (
        <span className="text-sm leading-none filter drop-shadow-sm">{flag}</span>
      )}
    </div>
  );
}
