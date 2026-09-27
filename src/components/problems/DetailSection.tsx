import type { ReactNode } from "react";
import { Card } from "heroui-native";

type DetailSectionProps = {
  title: string;
  children: ReactNode;
};

/** Uniform content section: HeroUI Card with a title. */
export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <Card className="mb-4">
      <Card.Body className="gap-3">
        <Card.Title>{title}</Card.Title>
        {children}
      </Card.Body>
    </Card>
  );
}
