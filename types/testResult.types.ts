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
export interface TestResult {
  uuid: string;
  test_id: string;
  marks: number;
  test_structure: Record<string, any>;
  evaluated_at: string;
}
