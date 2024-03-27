type Props = {
  total: number;
  current: number;
};

const ProgressDots = ({ total, current }: Props) => {
  return (
    <div className="flex items-center gap-[3px] h-2">
      {Array.from({ length: total }).map((_, index) => (
        <DotItem key={index} active={index + 1 === current} />
      ))}
    </div>
  );
};

const DotItem = ({ active = false }: { active?: boolean }) => {
  return (
    <div className="p-0.5">
      {active ? (
        <div className="w-2 h-2 rounded-full bg-orange5" />
      ) : (
        <div className="w-2 h-2 rounded-full bg-gray2" />
      )}
    </div>
  );
};

export default ProgressDots;
