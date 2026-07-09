import Button from "./Button";

const items = [
  {
    title: "Master Key Features",
    text: "Unlock the full potential of our platform with quick guides to essential tools and workflows.",
  },
  {
    title: "Find Answers Fast",
    text: "Access searchable FAQs and curated help content tailored to your experience—no digging required.",
  },
  {
    title: "Learn as You Go",
    text: "Stay confident and informed with always-accessible resources—right where you work.",
  },
];

export default function EduCenter() {
  return (
    <div className="relative w-full min-w-105 rounded-lg bg-bg-primary p-6.75 before:pointer-events-none before:absolute before:inset-0 before:bg-[url(/edu-circles.png)] before:bg-no-repeat before:opacity-40 before:content-['']">
      <div className="relative z-1">
        <div className="flex items-center justify-between text-[22px]">
          <span>The New Customer Education Center</span>
          <Button
            variant="callout"
            size="md"
            href="https://learn.enverus.com/learn/dashboard"
            target="_blank"
          >
            Visit
          </Button>
        </div>
        <h2 className="mt-3 text-[19px] font-bold text-enverus">
          LEARN MORE. DO MORE. RIGHT HERE.
        </h2>
        <div className="flex gap-1.5">
          <div className="flex flex-col">
            {items.map((item) => (
              <div
                key={item.title}
                className="mt-2 flex items-baseline gap-3.5"
              >
                <i className="fas fa-check-circle relative top-0.5 text-[20px] text-text-secondary" />
                <div>
                  <div className="text-[16px] font-bold">{item.title}</div>
                  <div className="leading-[1.2] text-text-secondary">
                    {item.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="ml-2 flex w-36 shrink-0 flex-col justify-end">
            <img src="/edu-center.png" alt="education" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
