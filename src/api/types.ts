import type { DatasetClient } from "@/use-cases/dataset.uc";
import type { QualityClient } from "@/use-cases/quality.uc";
import type { AuthClient } from "@/use-cases/auth.uc";

export type CombinedClient = DatasetClient & QualityClient & AuthClient;
