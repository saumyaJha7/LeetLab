import type { ReactNode } from "react";
import { Card } from "heroui-native";
import { EnteringView } from "../ui";

type DetailSectionProps = {
  title: string;
  children: ReactNode;
  /** Stagger order on the detail screen — 50ms steps, capped. */
  index?: number;
};

/** Uniform content section: HeroUI Card with a title. */
export function DetailSection({ title, children, index = 0 }: DetailSectionProps) {
  return (
    <EnteringView index={index} className="mb-4">
      <Card>
        <Card.Body className="gap-3">
          <Card.Title>{title}</Card.Title>
          {children}
        </Card.Body>
      </Card>
    </EnteringView>
  );
}
