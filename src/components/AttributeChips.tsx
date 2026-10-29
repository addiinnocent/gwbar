'use client'

export type AttributeChip = {
  name: string,
  rank: number,
  primary?: boolean,
}

export default function AttributeChips({
  attributes,
}: {
  attributes: AttributeChip[],
}) {
  const spent = attributes.filter(a => a.rank > 0);
  if (!spent.length) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {spent.map(attribute => (
        <span
          key={attribute.name}
          className="text-xs px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
        >
          {attribute.primary && (
            <span className="mr-1 font-semibold text-amber-600 dark:text-amber-400">
              {attribute.name}
            </span>
          )}
          {!attribute.primary && attribute.name}
          {' '}<span className="font-semibold tabular-nums">{attribute.rank}</span>
        </span>
      ))}
    </div>
  );
}
