import type { DatasetComment } from "@/domain/quality/quality.type";

export default class DataQualityPresenter {
  listComments(comments: DatasetComment[]) {
    return comments;
  }
}
