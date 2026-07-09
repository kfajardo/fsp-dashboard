import Button from "./Button";

export type NewsItem = {
  text: string;
  action: string;
};

export default function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <div
      className="my-auto grid gap-y-4"
      style={{ gridTemplateRows: `repeat(${items.length},1fr)` }}
    >
      {items.map((item) => (
        <div key={item.text} className="flex w-full justify-between gap-11.25">
          <div className="text-[16px] text-text-emphasis">{item.text}</div>
          <div className="w-20 min-w-20">
            <Button variant="secondary" size="md" className="w-full">
              {item.action}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
