export default function RollingHills({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1200 600" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Remove the background rect and gradient */}

      <path d="M0,400 C200,300 400,320 600,280 C800,240 1000,300 1200,350 L1200,600 L0,600 Z" fill="#4a7c59" />
      <path d="M0,450 C150,380 350,360 500,340 C700,310 900,380 1200,420 L1200,600 L0,600 Z" fill="#5d9c6b" />
      <path d="M0,520 C100,460 250,440 400,420 C500,410 600,440 650,480 L650,600 L0,600 Z" fill="#7cb342" />
      <path d="M650,480 C750,430 900,400 1050,420 C1150,435 1200,460 1200,480 L1200,600 L650,600 Z" fill="#8bc34a" />
    </svg>
  );
}