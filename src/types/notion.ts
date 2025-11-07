// Types for Notion API response
interface NotionTitleText {
  type: "text";
  text: {
    content: string;
    link: null | string;
  };
  plain_text: string;
}

interface NotionTitle {
  id: string;
  type: "title";
  title: NotionTitleText[];
}

interface NotionNumber {
  id: string;
  type: "number";
  number: number;
}

interface NotionProperties {
  Pseudo: NotionTitle;
  Score: NotionNumber;
}

interface NotionResult {
  properties: NotionProperties;
}

export interface NotionResponse {
  results: NotionResult[];
}