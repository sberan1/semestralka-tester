import { Card, CardFooter, CardTitle, CardDescription, CardHeader } from "@/components/ui/card";
import React from "react";
import { Button } from "@/components/ui/button";
import { useQuizStore } from "@/store/store";

type QuizzCardProps = {
  id: number;
  title: string;
  description: string | null;
  className?: string;
};

const QuizzCard: React.FC<QuizzCardProps> = ({ id, title, description, className }) => {
  const { setActiveQuiz } = useQuizStore();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className={"text-2xl font-bold"}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={() => setActiveQuiz(id)}>Start Quizz</Button>
      </CardFooter>
    </Card>
  );
};

export default QuizzCard;
