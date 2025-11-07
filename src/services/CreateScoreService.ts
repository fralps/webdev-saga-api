// CreateScoreService.ts
import { CreateScoreInput, CreatedPlayer } from "../types";

class CreateScoreService {
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
   * Execute the service to create a new score
   */
  async execute(input: CreateScoreInput): Promise<CreatedPlayer> {
    this.validateInput(input);
    const response = await this.createNotionEntry(input);
    return this.transformResponse(response);
  }

  /**
   * Validate input data
   */
  private validateInput(input: CreateScoreInput): void {
    if (!input.pseudo || input.pseudo.trim().length === 0) {
      throw new Error("Pseudo cannot be empty");
    }

    if (typeof input.score !== "number" || input.score < 0) {
      throw new Error("Score must be a positive number");
    }
  }

  /**
   * Create a new entry in Notion
   */
  private async createNotionEntry(input: CreateScoreInput): Promise<any> {
    const payload = {
      properties: {
        Pseudo: {
          title: [
            {
              text: {
                content: input.pseudo,
              },
            },
          ],
        },
        Score: {
          number: input.score,
        },
      },
    };

    const response = await fetch(
      `https://api.notion.com/v1/pages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.notionApiKey}`,
          "Notion-Version": this.notionVersion,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parent: {
            type: "data_source_id",
            data_source_id: this.notionDataSourceId,
          },
          properties: payload.properties,
        }),
      }
    );

    if (response.status === 200) {
      console.log("NotionController#create - Successfully created score in Notion");
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
   * Transform Notion response to CreatedPlayer object
   */
  private transformResponse(response: any): CreatedPlayer {
    return {
      id: response.id,
      pseudo: response.properties.Pseudo.title[0]?.plain_text || "",
      score: response.properties.Score.number,
      createdAt: response.created_time,
    };
  }
}

export default CreateScoreService;
