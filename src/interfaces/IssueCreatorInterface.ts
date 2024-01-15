export interface IssueCreatorInterface {
  listIssues(): void
  isIssueInList(listIssue: any): void
  createIssue(): void
}