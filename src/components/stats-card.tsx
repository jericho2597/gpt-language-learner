interface StatsCardProps {
  stat: string;
  metric: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ stat, metric }) => {
  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <>
      <div className="flex flex-col border-b border-[hsl(240,94%,6%)] px-12 py-2 text-center sm:border-0 ">
        <dt className="font-small text-md order-2 mt-2 leading-6 text-[hsl(223,84%,76%)]">
          {stat}
        </dt>
        <dd className="order-1 text-xl font-bold tracking-tight text-[hsl(228,68%,93%)]">
          {metric}
        </dd>
      </div>
    </>
  );
};

export default StatsCard;
