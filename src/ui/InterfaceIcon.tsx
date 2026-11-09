type IconName =
  | 'learn'
  | 'code'
  | 'path'
  | 'projects'
  | 'review'
  | 'finish'
  | 'pitch'
  | 'arrowRight'
  | 'arrowLeft'
  | 'external';
const paths: Record<IconName, string> = {
  learn: 'M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-3H4V4Zm16 0h-4a3 3 0 0 0-3 3m7-3v14h-3a4 4 0 0 0-4 3',
  path: 'M6 5h12M6 12h12M6 19h12M3 5h.01M3 12h.01M3 19h.01',
  projects: 'M9 6V4h6v2M3 8h18v12H3V8Zm0 5h18M10 12v3h4v-3',
  review: 'M4 10a8 8 0 1 1 1 8M4 4v6h6M12 8v5l3 2',
  finish: 'M8 3h8v5a4 4 0 0 1-8 0V3Zm0 2H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 1v7m-4 2h8',
  pitch: 'M3 5h18v14H3V5Zm9 0v14M3 9h4v6H3m18-6h-4v6h4M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',
  arrowRight: 'M4 12h16m-6-6 6 6-6 6',
  arrowLeft: 'M20 12H4m6-6-6 6 6 6',
  external: 'M7 5h12v12M19 5 5 19',
};
export function InterfaceIcon({
  name,
  className = 'nav-icon',
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
