// NotionController.ts
import GetScoresService from "../services/GetScoresService";
import CreateScoreService from "../services/CreateScoreService";

abstract class NotionController {
  /**
   * Get all scores
   * @return List of players with their scores
   * @throws Error if the Notion API request fails
   */
  static async index() {
    try {
      const getScoresService = new GetScoresService();
      const players = await getScoresService.execute();

      return {
        success: true,
        data: players
      };
    } catch (error) {
      console.error("Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }

  /**
   * Create a new score
   * @param pseudo - The player's pseudo
   * @param score - The player's score
   * @return The created player data
   * @throws Error if the Notion API request fails
   */
  static async create(pseudo: string, score: number) {
    console.log('NotionController#create', { pseudo, score });

    try {
      const createScoreService = new CreateScoreService();
      const player = await createScoreService.execute({ pseudo, score });

      return {
        success: true,
        data: player
      };
    } catch (error) {
      console.error("Error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  }
}

export default NotionController;
