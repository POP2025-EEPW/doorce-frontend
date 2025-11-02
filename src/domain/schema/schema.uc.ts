// import { createApiClient } from "@/api/client";

export class SchemaUseCase {
  // constructor(private client: ReturnType<typeof createApiClient>){}

  async setDataSchema(datasetId: string, schemaId: string): Promise<void> {
    //TODO: WAIT FOR BACKEND TO MAKE ENDPOINT AND IMPLEMENT IT
    console.log(datasetId, schemaId);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
}
