export interface TestResult {
  uuid: string;
  test_id: string;
  marks: number;
  evaluated_at: string;
  test_structure: {
    question_ID: string;
    question: string;
    trait_measured: string;
    options: string[];
    userResponse: string; // selected option
  }[];
}