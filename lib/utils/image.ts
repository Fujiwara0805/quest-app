/**
 * クエスト画像のパスを取得する
 * @param filename 画像ファイル名
 * @returns 画像の完全なパス
 */
export function getQuestImagePath(filename: string): string {
  return `/images/quests/${filename}`;
}