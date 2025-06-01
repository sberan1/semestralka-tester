// File: src/components/MergedQuizForm.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface CreateQuizFormProps {
  fileContent: string;
  setFileContent: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  handleParse: () => void;
}

const CreateQuizForm: React.FC<CreateQuizFormProps> = ({
                                                         fileContent,
                                                         setFileContent,
                                                         name,
                                                         setName,
                                                         description,
                                                         setDescription,
                                                         handleParse,
                                                       }) => {
  return (
    <div className="p-4">
      <div className="mb-4">
        <Label htmlFor="quizFileContent">Quiz File Content</Label>
        <textarea
          id="quizFileContent"
          className="border p-2 w-full h-40 mt-2"
          placeholder="Enter quiz file content here..."
          value={fileContent}
          onChange={(e) => setFileContent(e.target.value)}
        />
        <button
          onClick={handleParse}
          className="bg-primary text-white px-4 py-2 rounded mt-2"
        >
          Parse Quiz
        </button>
      </div>
      <div className="mb-4">
        <Label htmlFor="quizName">Name of the quiz</Label>
        <Input
          id="quizName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="quizDescription">Description of the quiz</Label>
        <Input
          id="quizDescription"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default CreateQuizForm;
