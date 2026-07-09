"use client";

import Button from "@/components/Button";

// ponytail: demo reset — wipe every sessionStorage flag and reload so
// in-memory mock state (banks, paid invoices, drawers) resets with it.
// z-40 keeps it under modal overlays (z-50).
export default function GlobalReset() {
  return (
    <div className="fixed right-5 bottom-5 z-40 rounded-sm border border-border-secondary bg-bg-primary p-2 shadow-lg">
      <Button
        variant="default"
        size="sm"
        onClick={() => {
          sessionStorage.clear();
          location.reload();
        }}
      >
        <i className="fas fa-undo mr-1.5 text-[12px]" />
        Reset demo
      </Button>
    </div>
  );
}
