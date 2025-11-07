// GetScoresService.ts
import { NotionResponse, Player } from "../types";

class GetScoresService {
  private readonly notionVersion: string;
  private readonly notionApiKey: string;
  private readonly notionDataSourceId: string;

  constructor() {
    this.notionVersion = process.env.NOTION_VERSION || "";
    this.notionApiKey = process.env.NOTION_API_KEY || "";
    this.notionDataSourceId = process.env.NOTION_DATA_SOURCE_ID || "";

    if (!this.notionApiKey || !this.notionDataSourceId) {
      throw new Error("Missing required environment variables: NOTION_API_KEY or NOTION_DATA_SOURCE_ID");
    }
  }

  /**
   * Execute the service to get all scores
   */
  async execute(): Promise<Player[]> {
    const data = await this.fetchNotionData();
    return this.transformData(data);
  }

  /**
   * Fetch data from Notion API
   */
  private async fetchNotionData(): Promise<NotionResponse> {
    const payload = {
      sorts: [
        {
          property: "Score",
          direction: "ascending",
        },
      ],
      page_size: 3
    };

    const response = await fetch(
      `https://api.notion.com/v1/data_sources/${this.notionDataSourceId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.notionApiKey}`,
          "Notion-Version": this.notionVersion,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (response.status === 200) {
      console.log("NotionController#index - Successfully fetched scores from Notion");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Notion API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return await response.json();
  }

  /**
   * Transform Notion data to simple Player objects
   */
  private transformData(data: NotionResponse): Player[] {
    return data.results.map((item) => {
      const pseudo = item.properties.Pseudo.title[0]?.plain_text || "";
      const score = item.properties.Score.number;

      return {
        pseudo,
        score,
      };
    });
  }
}

export default GetScoresService;
